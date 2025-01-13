const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/userSchema');
const router = express.Router();

// Helper function to send validation errors
const sendValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Signup Route
router.post('/signup', 
    // Validation rules
    [
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        body('role').isIn(['admin', 'broker', 'user']).withMessage('Invalid user role')
    ],
    async (req, res) => {
        sendValidationErrors(req, res);

        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Create a new user
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
                role: req.body.role
            });

            const savedUser = await user.save();
            res.status(201).json({ message: "User successfully created" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something wrong happened" });
        }
    }
);

// Login Route
router.post('/login', 
    // Validation rules
    [
        body('username').trim().exists().withMessage('Username is required'),
        body('password').exists().withMessage('Password is required')
    ],
    async (req, res) => {
        sendValidationErrors(req, res);

        try {
            // Check if user exists
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(400).send('Cannot find user');
            }

            // Check password
            if (await bcrypt.compare(req.body.password, user.password)) {
                // Create and assign a token
                const token = jwt.sign(
                    { userId: user._id, role: user.role },
                    process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
                    { expiresIn: '1h' }
                );

                res.header('auth-token', token).send(token);
            } else {
                res.status(403).send('Not Allowed');
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
