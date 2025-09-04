require('dotenv').config()
const express = require('express');
const con = require('./db/Config');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const authenticateToken = require('./middleware/AuthMiddleWare');
const { data } = require('react-router-dom');
const { useState } = require('react');
const jwtKey = process.env.JWT_SECRET
console.log("jwt key is ", jwtKey)

const app = express();
app.use(express.json())
app.use(cors());

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ success: false, message: "Name, email, and password are required" })
    }
    const existEmail = 'SELECT * FROM users WHERE email = ?';
    con.query(existEmail, [email], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message })
        } else if (result.length > 0) {
            return res.status(400).send({ success: false, message: "Your Email is already exists" })
        } else {

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).send({ success: false, message: "Error hashing password" });
                }

                const insertQuery = 'INSERT INTO users (name , email , password ) VALUES (?,?,?)';
                con.query(insertQuery, [name, email, hash], (err, result) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: err.message })
                    } else {
                        return res.status(201).send({ success: true, message: "User registered successfully" });
                    }
                })
            })
        }
    })
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ success: false, message: "Email and Password are required" });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message });
        }

        if (result.length === 0) {
            return res.status(400).send({ success: false, message: "Email is incorrect" });
        }

        const user = result[0];

        // ✅ compare plain password with hashed password
        bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send({ success: false, message: "Error comparing passwords" });
            }

            if (!isMatch) {
                return res.status(400).send({ success: false, message: "Password is incorrect" });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            jwt.sign(payload, jwtKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    return res.status(403).send({ success: false, message: 'Something went wrong, please try again.' });
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Login Successfully',
                        user: payload,
                        auth: token
                    });
                }
            });
        });
    });
});


app.post('/add-expense', authenticateToken, (req, res) => {
    const { user_id, expense_category, amount, date } = req.body;
    if (!expense_category || !amount || !date) {
        return res.status(400).send({ success: false, message: 'You must enter all required fields' })
    }
    const insertBuilding = 'INSERT INTO expenses(user_id , expense_category , amount , date ) values (?,?,?,?)';
    con.query(insertBuilding, [user_id, expense_category, amount, date], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message })
        } else {
            return res.status(200).send({
                success: true,
                message: 'expense added successfully',
            });
        }
    })
})

app.get('/get-expenses-current-month', authenticateToken, (req, res) => {  // current month
    const user_id = req.user.id;

    const getExpenses = `
        SELECT * FROM expenses 
        WHERE user_id = ? 
        AND MONTH(date) = MONTH(CURDATE()) 
        AND YEAR(date) = YEAR(CURDATE())
    `;

    con.query(getExpenses, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message });
        } else if (result.length > 0) {
            res.status(200).send({ success: true, data: result });
        } else {
            return res.status(404).send({ success: false, message: 'No expenses found for this month' });
        }
    });
});

app.get('/get-expense/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM expenses WHERE id = ?';
    con.query(query, [id], (err, result) => {
        if (err) return res.status(500).send({ success: false, message: err.message });

        if (result.length === 0) {
            return res.status(404).send({ success: false, message: 'Expense not found' });
        }

        res.status(200).send({ success: true, data: result[0] });
    });
});

app.put('/edit-expense/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { expense_category, amount, date } = req.body;
    if (!expense_category || !amount || !date) {
        return res.status(400).send({ success: false, message: 'All fields are required' });
    }

    const updateCustomer = 'UPDATE expenses SET expense_category = ? , amount = ? , date = ?  WHERE id = ?';
    con.query(updateCustomer, [expense_category, amount, date, id], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message })
        } else if (result.affectedRows > 0) {
            res.status(200).send({ success: true, message: 'Update successfully' })
        } else {
            return res.status(400).send({ success: false, message: 'expense not found or no changes made' })
        }
    })
})

app.delete('/delete-expense/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM expenses WHERE id = ?';
    con.query(deleteQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
        if (result.affectedRows > 0) {
            return res.status(200).send({ success: true, message: 'Expense deleted successfully' });
        } else {
            return res.status(404).send({ success: false, message: 'Expense not found' });
        }
    });
});

app.get('/overall-spend-expenses', authenticateToken, (req, res) => {
    const user_id = req.user.id;

    const getTotalExpense = 'SELECT SUM(amount) AS total_spent FROM expenses WHERE user_id = ?';
    con.query(getTotalExpense, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message });
        }

        const totalSpent = result[0].total_spent || 0;
        res.status(200).send({ success: true, data: totalSpent });
    });
})

app.get('/overall-category-expenses', authenticateToken, (req, res) => {
    const user_id = req.user.id;

    const getExpensesByCategory = `
        SELECT expense_category, SUM(amount) AS total_amount
        FROM expenses
        WHERE user_id = ?
        GROUP BY expense_category
    `;

    con.query(getExpensesByCategory, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message });
        } else if (result.length > 0) {
            res.status(200).send({ success: true, data: result });
        } else {
            return res.status(404).send({ success: false, message: 'No expenses found for this user' });
        }
    });
});

app.get('/recent-expenses', authenticateToken, (req, res) => {
    const user_id = req.user.id;

    const getExpenses = `
        SELECT * FROM expenses 
        WHERE user_id = ? 
        ORDER BY date DESC 
        LIMIT 5
    `;

    con.query(getExpenses, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: err.message });
        } else if (result.length > 0) {
            res.status(200).send({ success: true, data: result });
        } else {
            return res.status(404).send({ success: false, message: 'No expenses found for this user' });
        }
    });
});

app.listen(5000, () => {
    console.log("Server is runnig..")
})
