const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
//const allowedOrigins = [process.env.BASE_URL, 'https://meek-nasturtium-a72598.netlify.app'];
const allowedOrigins = [process.env.BASE_URL, 'https://66d408cda10a30e4cdd87dac--radiant-paletas-e87272.netlify.app'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Request Origin:', origin); // Log origin to debug
        if (!origin) return callback(null, true); // For requests with no origin (e.g., curl or mobile apps)
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
};



app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(bodyParser.json());

// Routes
app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
