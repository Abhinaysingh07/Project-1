const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser'); // Import the cookie-parser package
const app = express();
const cors = require('cors'); // Import the cors package
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the JWT library
app.use(cookieParser()); // Use the cookie-parser middleware
app.use(express.urlencoded({ extended: true }));// Middleware to parse incoming request bodies
app.use(express.json());
app.use(cors());
const port = 5500;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'swagpizzacart'
})

app.post('/signup', (req, res) => {

    const { s_username, pno, password } = req.body;

    // Check if the phone number is already registered
    pool.query('SELECT * FROM userss WHERE phone = ?', [pno], (phoneCheckErr, phoneCheckResults) => {
        if (phoneCheckErr) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (phoneCheckResults.length > 0) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Phone number is not registered, proceed with registration
        const hashedPassword = bcrypt.hashSync(password, 10); // Using sync version for simplicity

        pool.query('INSERT INTO userss (username, phone, password) VALUES (?, ?, ?)', [s_username, pno, hashedPassword], (insertErr, result) => {
            if (insertErr) {
                return res.status(500).json({ error: 'Server error' });
            }

            if (result.affectedRows > 0) {
                return res.json({ message: 'User registered successfully' });
            } else {
                return res.status(500).json({ error: 'Server error' });
            }
        });
    });
});

app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    // Retrieve user information based on the provided phone number
    pool.query('SELECT * FROM userss WHERE phone = ?', [phone], (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.json({ message: 'This Number is not registered' });
        }

        const user = results[0];//saving user details 

        //checking if passworrd is correct
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.json({ message: 'Password incorrect' });
        }

        // If the password is correct, generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });
        pool.query('select * from cart where user_id = ?', [user.id], (err, allrows) => {
            // Send the JWT token to the frontend in the response
            return res.json({ token, message: 'Login successful', quant: allrows.length, username: user.username, phone: user.phone });
        })

    });
});

// Middleware to verify JWT token from Authorization header
function verifyToken(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"

    if (!token) {
        return res.status(403).json({ message: 'Token missing' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Store the decoded user information in the request object
        req.user = decoded;
        next(); // Continue processing the request
    });
}

app.post('/saveUserCartData', verifyToken, (req, res) => {
    const userId = req.user.userId;
    const { cartItems } = req.body;

    // Add the user's ID to the cartItems object
    cartItems.user_id = userId;

    // Check if the dishName already exists in the cart for the user
    pool.query('SELECT * FROM cart WHERE dishName = ? AND user_id = ?', [cartItems.dishName, userId], (err, rows) => {
        if (err) {
            console.error('Select query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (rows.length > 0) {
            // If the dishName exists for the user, update the quantity
            const currentQuantity = rows[0].quantity;
            const updatedQuantity = currentQuantity + cartItems.quantity;

            // Update query
            pool.query('UPDATE cart SET quantity = ? WHERE dishName = ? AND user_id = ?', [updatedQuantity, cartItems.dishName, userId], (err) => {
                if (err) {
                    console.error('Update query error:', err);
                    return res.status(500).json({ error: 'Update error' });
                }

                // Select query to retrieve updated data
                pool.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, allrows) => {
                    return res.json({ message: 'Quantity updated successfully', quant: allrows.length });
                });
            });
        } else {
            // If the dishName does not exist for the user, insert a new row in the cart table with the provided data
            pool.query('INSERT INTO cart (user_id, dishName, quantity, price, image) VALUES (?, ?, ?, ?, ?)', [userId, cartItems.dishName, cartItems.quantity, cartItems.price, cartItems.image], (err) => {
                if (err) {
                    console.error('Insert query error:', err);
                    return res.status(500).json({ error: 'Insert error' });
                }

                // Select query to retrieve updated data
                pool.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, allrows) => {
                    return res.json({ message: 'Data inserted successfully', quant: allrows.length });
                });
            });
        }
    });
});

app.get('/getCartData', verifyToken, (req, res) => {
    const userId = req.user.userId; // Extracted from the token verification middleware

    // Fetch and return cart data specific to the user's ID
    pool.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.send(rows);
    });
});

app.delete('/deleteCartData', verifyToken, (req, res) => {
    const removeItem = req.body.removeDish;
    const userId = req.user.userId;
    // DELETE query to remove the item from the cart
    pool.query('DELETE FROM cart WHERE dishName = ? AND user_id = ?', [removeItem, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error deleting cart item.' });
        }
        // Check if any rows were affected (item was found and deleted)
        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: 'Cart item deleted successfully.' });
        } else {
            return res.status(404).json({ success: false, message: 'Cart item not found.' });
        }
    });
});

app.put("/updateQuantity", verifyToken, (req, res) => {
    const { dishName, quantityChange } = req.body;
    const updatedQuantity = parseInt(quantityChange);
    const userId = req.user.userId; // Extracted from the token verification middleware

    // Check if the dishName exists for the specific user
    pool.query('SELECT * FROM cart WHERE dishName = ? AND user_id = ?', [dishName, userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Dish not found in the user\'s cart' });
        }

        // Update the quantity for the specific dishName and user
        pool.query('UPDATE cart SET quantity = ? WHERE dishName = ? AND user_id = ?', [updatedQuantity, dishName, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error updating quantity' });
            }
            return res.status(200).json({ success: true, message: 'Quantity updated successfully' });
        });
    });
});

// Listen on enviroment port or 3000

app.listen(port, () => console.log(`Listening on port ${port}`))
