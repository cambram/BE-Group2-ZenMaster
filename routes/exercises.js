const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Route to log completed exercise
router.post('/complete', async (req, res) => {
    try {
        const { exercise_name, date_completed, session_duration } = req.body;

        // Ensure the user is authenticated
        const userId = req.session.user.id; // Getting user ID from session

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the user in the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the completed exercise to the user's completedExercises array
        user.completed_exercises.push({
            exercise_name,
            date_completed,
            session_duration
        });

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: 'Exercise logged successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
