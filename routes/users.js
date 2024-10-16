// routes/users.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route to create a new user
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Create a new user
        const newUser = new User({
            username,
            password,
            completed_exercises: [],
            achievements: []
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

module.exports = router;  // Export the router
