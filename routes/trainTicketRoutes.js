const express = require('express');
const { body, validationResult, query } = require('express-validator');
const TrainTicket = require('../models/trainTicketSchema');
const User = require('../models/userSchema'); // Assuming this is your user model
const { isBroker } = require('../middlewares/authMiddleware'); // Assuming this is your combined middleware
const router = express.Router();

// Validation error handling function
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Fetch all train tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await TrainTicket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new train ticket (only broker can do so)
router.post('/', isBroker, [
    body('trainName').trim().notEmpty().withMessage('Train name is required'),
    body('trainNumber').trim().notEmpty().withMessage('Train number is required'),
    body('from').trim().notEmpty().withMessage('Departure location is required'),
    body('to').trim().notEmpty().withMessage('Arrival location is required'),
    body('date').isISO8601().toDate().withMessage('Invalid date format'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('currentStatus').trim().notEmpty().withMessage('Current status is required'),
    body('confirmChance').isInt({ min: 0, max: 100 }).withMessage('Confirm chance must be between 0 and 100'),
    body('pnrNumber').trim().notEmpty().withMessage('PNR number is required'),
    body('isSold').isBoolean().withMessage('isSold must be a boolean'),
    // Additional validations as necessary
], handleValidationErrors, async (req, res) => {
    try {
        const newTicket = new TrainTicket({ ...req.body, brokerId: req.user.userId });
        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Find tickets by train number, from location, date
router.get('/search', [
    query('trainNumber').optional().trim(),
    query('from').optional().trim(),
    query('date').optional().isISO8601().toDate(),
    // Additional validations as necessary
], handleValidationErrors, async (req, res) => {
    try {
        const query = { 
            ...(req.query.trainNumber && { trainNumber: req.query.trainNumber }),
            ...(req.query.from && { from: req.query.from }),
            ...(req.query.date && { date: req.query.date })
        };

        const tickets = await TrainTicket.find(query);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
