const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"]
    },
    name: {
        type: String,
        required: [true, "Workout name is required"]
    },
    duration: {
        type: String,
        required: [true, "Workout duration is required"]
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "pending"
    }
});

module.exports = mongoose.model("Workout", workoutSchema);