const mongoose = require('mongoose');
const { MONGODB_URI } = require('./.env');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("...DB is connected");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

module.exports = { connectDB };
