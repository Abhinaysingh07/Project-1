const express = require('express');
const mysql = require('mysql');
const cookieParser = require('cookie-parser'); // Import the cookie-parser package
const app = express();
const port = 5500;
const cors = require('cors'); // Import the cors package
app.use(cors());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the JWT library
app.use(cookieParser()); // Use the cookie-parser middleware
app.use(express.urlencoded({ extended: true }));// Middleware to parse incoming request bodies
app.use(cookieParser());

app.use(express.json());



app.use(cors()); // Use the corsOptions when setting up CORS

// MySQL

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
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'This Number is not registered' });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        // If the password is correct, generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

        // Send the JWT token to the frontend in the response
        return res.json({ token, message: 'Login successful' });
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
    cartItems.user_id = userId; // Use 'user_id' column name from the database table

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            throw err;
        }

        // Check if the dishName already exists in the cart for the user
        connection.query('SELECT * FROM cart WHERE dishName = ? AND user_id = ?', [cartItems.dishName, userId], (err, rows) => {
            if (err) {
                connection.release();
                console.error('Select query error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (rows.length > 0) {
                // If the dishName exists for the user, update the quantity
                const currentQuantity = rows[0].quantity;
                const updatedQuantity = currentQuantity + cartItems.quantity;

                connection.query('UPDATE cart SET quantity = ? WHERE dishName = ? AND user_id = ?', [updatedQuantity, cartItems.dishName, userId], (err) => {
                    connection.release();
                    if (err) {
                        console.error('Update query error:', err);
                        return res.status(500).json({ error: 'Update error' });
                    }
                    return res.json({ message: 'Quantity updated successfully' });
                });
            } else {
                // If the dishName does not exist for the user, insert a new row in the cart table with the provided data
                connection.query('INSERT INTO cart (user_id, dishName, quantity, price, image) VALUES (?, ?, ?, ?, ?)', [userId, cartItems.dishName, cartItems.quantity, cartItems.price, cartItems.image], (err) => {
                    connection.release();
                    if (err) {
                        console.error('Insert query error:', err);
                        return res.status(500).json({ error: 'Insert error' });
                    }
                    return res.json({ message: 'Data inserted successfully' });
                });
            }
        });
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


// Delete a beer

app.delete('/deleteCartData', verifyToken, (req, res) => {
    const removeItem = req.body.removeDish;

    // Extract the user ID from the decoded JWT token
    const userId = req.user.userId;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('DELETE FROM cart WHERE dishName = ? AND user_id = ?', [removeItem, userId], (err, result) => {
            connection.release(); // return the connection to the pool
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Error deleting cart item.' });
            } else {
                res.status(200).json({ success: true, message: 'Cart item deleted successfully.' });
            }
        });
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
