const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5500;
const cors = require('cors'); // Import the cors package
app.use(cors());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the JWT library

// Middleware to parse incoming request bodies

app.use(express.urlencoded({ extended: true }));

// Parse application/json

app.use(express.json());



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

        // Send the token back to the client
        return res.json({ message: 'Login successful', token });
    });
});


// add data

app.post('/saveCartData', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const { dishName, quantity, price, image } = req.body;

        // Check if the dishName already exists in the cart
        connection.query('SELECT * FROM cart WHERE dishName = ?', [dishName], (err, rows) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: 'Database error' });
            }

            if (rows.length > 0) {
                // If the dishName exists, update the quantity
                const currentQuantity = rows[0].quantity; // Get the current quantity from the database
                const updatedQuantity = currentQuantity + quantity; // Calculate the updated quantity

                connection.query('UPDATE cart SET quantity = ? WHERE dishName = ?', [updatedQuantity, dishName], (err) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({ error: 'Update error' });
                    }
                    return res.json({ message: 'Quantity updated successfully' });
                });
            } else {
                // If the dishName does not exist, insert a new row in the cart table with the provided quantity, price, and image
                connection.query('INSERT INTO cart (dishName, quantity, price, image) VALUES (?, ?, ?, ?)', [dishName, quantity, price, image], (err) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({ error: 'Insert error' });
                    }
                    return res.json({ message: 'Data inserted successfully' });
                });
            }
        });
    });
});


// Get all beers

app.get('/getCartData', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from cart', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// Delete a beer

app.delete('/deleteCartData', (req, res) => {
    const removeItem = req.body.removeDish;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('DELETE FROM cart WHERE dishName = ?', [removeItem], (err, rows) => {
            connection.release(); // return the connection to pool
            if (!err) {
                res.send(`Cart with the name ${removeItem} has been removed.`);
            } else {
                console.log(err);
            }
        });
    });
});

// [req.params.id]

app.put("/updateQuantity", (req, res) => {
    const { dishName, quantityChange } = req.body;
    const updatedQuantity = parseInt(quantityChange);

    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('UPDATE cart SET quantity = ? WHERE dishName = ?', [updatedQuantity, dishName], (err, result) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Error updating quantity.' });
            } else {
                res.status(200).json({ success: true, message: 'Quantity updated successfully.' });
            }
        });
    });

});



// Listen on enviroment port or 3000

app.listen(port, () => console.log(`Listening on port ${port}`))