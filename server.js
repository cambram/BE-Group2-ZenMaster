const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const exerciseRoutes = require('./routes/exercises');
const achievementRoutes = require('./routes/achievements');
const cors = require("cors");
require('dotenv').config();

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN;
// Middleware to parse JSON
app.use(express.json());

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('Connection error:', err));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,  // Ensures cookies are only sent over HTTPS
        sameSite: 'None', // Required for cross-origin requests
    }
}));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/achievements', achievementRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
