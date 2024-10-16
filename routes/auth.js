const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Login route - authenticate user and store session
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Check password (simple check for now)
    if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Store user session after successful login
    req.session.user = {
        id: user._id,
        username: user.username
    };

    res.status(200).json({ message: 'Login successful' });
});

// Route to check if user is already logged in
router.get('/check-session', (req, res) => {
    if (req.session.user) {
        return res.status(200).send({ loggedIn: true });
    } else {
        return res.status(200).send({ loggedIn: false });
    }
});


// Check if user is logged in
router.get('/auth-status', (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({ loggedIn: true, username: req.session.user.username });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'User not logged in' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.status(200).send({ message: 'Logged out successfully' });
    });
});

module.exports = router;
