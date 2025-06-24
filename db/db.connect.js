const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGODB;

const initializeLeadsData = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('Database Connected Successfully.');
    } catch (error) {
        console.log('Error While Connecting Database!', error);
    }
};

module.exports = { initializeLeadsData };
