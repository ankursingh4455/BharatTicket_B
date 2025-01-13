const mongoose = require('mongoose');

const trainTicketSchema = new mongoose.Schema({
    trainName: { type: String, required: true },
    trainNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    currentStatus: { type: String, required: true },
    confirmChance: { type: Number, required: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isSold: { type: Boolean, default: false },
    dateAdded: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
    pnrNumber: { type: String, required: true }
});

module.exports = mongoose.model('TrainTicket', trainTicketSchema);
