const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for completed exercises
const CompletedExerciseSchema = new Schema({
    exercise_name: {
        type: String,
        required: true,
    },
    date_completed: {
        type: Date,
        required: true,
    },
    session_duration: {
        type: Number, // Storing duration in minutes
        required: false,
    },
});

// Define the schema for achievements
const AchievementSchema = new Schema({
    achievement_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date_earned: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

// Define the schema for users
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    completed_exercises: [CompletedExerciseSchema],  // Array of completed exercises
    achievements: [AchievementSchema],  // Array of achievements
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
