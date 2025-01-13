

const { connect } = require('mongoose');

const dbConnection = async () => {
    try {
        await connect(process.env.DB_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = dbConnection;

