const express = require('express');
const User = require('../models/User'); // Import the User model
const { isWithinSameWeek, isConsecutiveDays } = require('../utils/dateUtils');

const router = express.Router();

// Route to fetch the user's achievements
router.get('/', async (req, res) => {
    try {
        // Assuming the user is logged in and their user ID is stored in the session
        const userId = req.session.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch the user from the database using the userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the achievements from the user document
        const userAchievements = user.achievements;

        // Send the user's achievements as a JSON response
        res.status(200).json(userAchievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to check and award achievements
router.post('/award-achievements', async (req, res) => {
    const userId = req.session.user.id;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let newAchievements = [];

        // Mindful Beginnings – Complete your first Mindful Meditation session.
        if (!user.achievements.some(a => a.achievement_id === 'ach_001')) {
            const firstMeditation = user.completed_exercises.find(ex => ex.exercise_name === 'Mindful Meditation');
            if (firstMeditation) {
                newAchievements.push({
                    achievement_id: 'ach_001',
                    name: 'Mindful Beginnings' // Complete your first Mindful Meditation session.
                });
            }
        }

        // Body Awareness – Perform your first Body Scan exercise.
        if (!user.achievements.some(a => a.achievement_id === 'ach_002')) {
            const firstBodyScan = user.completed_exercises.find(ex => ex.exercise_name === 'Body Scan');
            if (firstBodyScan) {
                newAchievements.push({
                    achievement_id: 'ach_002',
                    name: 'Body Awareness' // Perform your first Body Scan exercise.
                });
            }
        }

        // Calm Continuity – Perform a Mindful Meditation session each day for 3 consecutive days.
        if (!user.achievements.some(a => a.achievement_id === 'ach_003')) {
            const meditationSessions = user.completed_exercises
                .filter(ex => ex.exercise_name === 'Mindful Meditation')
                .sort((a, b) => a.date_completed - b.date_completed);

            if (meditationSessions.length >= 3) {
                const meditationDates = meditationSessions.map(session => new Date(session.date_completed));
                if (isConsecutiveDays(meditationDates.slice(-3))) {
                    newAchievements.push({
                        achievement_id: 'ach_003',
                        name: 'Calm Continuity' // Perform a Mindful Meditation session each day for 3 consecutive days.
                    });
                }
            }
        }

        // Committed Scanner – Perform a Body Scan session each day for 3 consecutive days.
        if (!user.achievements.some(a => a.achievement_id === 'ach_004')) {
            const bodyScanSessions = user.completed_exercises
                .filter(ex => ex.exercise_name === 'Body Scan')
                .sort((a, b) => a.date_completed - b.date_completed);

            if (bodyScanSessions.length >= 3) {
                const bodyScanDates = bodyScanSessions.map(session => new Date(session.date_completed));
                if (isConsecutiveDays(bodyScanDates.slice(-3))) {
                    newAchievements.push({
                        achievement_id: 'ach_004',
                        name: 'Committed Scanner' // Perform a Body Scan session each day for 3 consecutive days.
                    });
                }
            }
        }

        // Deep Dive – Perform a Mindful Meditation session for at least 15 minutes.
        if (!user.achievements.some(a => a.achievement_id === 'ach_005')) {
            const longMeditation = user.completed_exercises.find(ex =>
                ex.exercise_name === 'Mindful Meditation' && ex.session_duration >= 15
            );
            if (longMeditation) {
                newAchievements.push({
                    achievement_id: 'ach_005',
                    name: 'Deep Dive' // Perform a Mindful Meditation session for at least 15 minutes.
                });
            }
        }

        // Fully Aware – Complete your first Five Senses exercise.
        if (!user.achievements.some(a => a.achievement_id === 'ach_006')) {
            const firstFiveSenses = user.completed_exercises.find(ex => ex.exercise_name === 'Five Senses');
            if (firstFiveSenses) {
                newAchievements.push({
                    achievement_id: 'ach_006',
                    name: 'Fully Aware' // Complete your first Five Senses exercise.
                });
            }
        }

        // Mind-Body Connection – Perform a Body Scan exercise for at least 10 minutes.
        if (!user.achievements.some(a => a.achievement_id === 'ach_007')) {
            const longBodyScan = user.completed_exercises.find(ex =>
                ex.exercise_name === 'Body Scan' && ex.session_duration >= 10
            );
            if (longBodyScan) {
                newAchievements.push({
                    achievement_id: 'ach_007',
                    name: 'Mind-Body Connection' // Perform a Body Scan exercise for at least 10 minutes.
                });
            }
        }

        // Mindful Week – Perform at least 1 of any mindful exercise each day for 7 consecutive days.
        if (!user.achievements.some(a => a.achievement_id === 'ach_008')) {
            const allSessions = user.completed_exercises
                .sort((a, b) => a.date_completed - b.date_completed);

            if (allSessions.length >= 7) {
                const sessionDates = allSessions.map(session => new Date(session.date_completed));
                if (isConsecutiveDays(sessionDates.slice(-7))) {
                    newAchievements.push({
                        achievement_id: 'ach_008',
                        name: 'Mindful Week' // Perform at least 1 of any mindful exercise each day for 7 consecutive days.
                    });
                }
            }
        }

        // Senses in Sync – Perform a Five Senses session each day for 3 consecutive days.
        if (!user.achievements.some(a => a.achievement_id === 'ach_009')) {
            const fiveSensesSessions = user.completed_exercises
                .filter(ex => ex.exercise_name === 'Five Senses')
                .sort((a, b) => a.date_completed - b.date_completed);

            if (fiveSensesSessions.length >= 3) {
                const fiveSensesDates = fiveSensesSessions.map(session => new Date(session.date_completed));
                if (isConsecutiveDays(fiveSensesDates.slice(-3))) {
                    newAchievements.push({
                        achievement_id: 'ach_009',
                        name: 'Senses in Sync' // Perform a Five Senses session each day for 3 consecutive days.
                    });
                }
            }
        }

        // Week of Balance – Complete all three exercises within the same week.
        if (!user.achievements.some(a => a.achievement_id === 'ach_010')) {
            const exercisesByType = {
                'Mindful Meditation': user.completed_exercises.filter(ex => ex.exercise_name === 'Mindful Meditation'),
                'Body Scan': user.completed_exercises.filter(ex => ex.exercise_name === 'Body Scan'),
                'Five Senses': user.completed_exercises.filter(ex => ex.exercise_name === 'Five Senses')
            };

            if (
                exercisesByType['Mindful Meditation'].length > 0 &&
                exercisesByType['Body Scan'].length > 0 &&
                exercisesByType['Five Senses'].length > 0
            ) {
                const latestMindfulDate = exercisesByType['Mindful Meditation'][0].date_completed;
                const latestBodyScanDate = exercisesByType['Body Scan'][0].date_completed;
                const latestFiveSensesDate = exercisesByType['Five Senses'][0].date_completed;

                if (
                    isWithinSameWeek(new Date(latestMindfulDate), new Date(latestBodyScanDate)) &&
                    isWithinSameWeek(new Date(latestMindfulDate), new Date(latestFiveSensesDate))
                ) {
                    newAchievements.push({
                        achievement_id: 'ach_010',
                        name: 'Week of Balance' // Complete all three exercises within the same week.
                    });
                }
            }
        }

        // Save new achievements to the database
        if (newAchievements.length > 0) {
            user.achievements.push(...newAchievements);
            await user.save();
        }

        res.json({ achievementsAwarded: newAchievements });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
