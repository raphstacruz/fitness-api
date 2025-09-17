const Workout = require('../models/Workout');
const { errorHandler } = require("../middleware/errorHandler");

module.exports.addWorkout = (req, res) => {
    let newWorkout = new Workout({
        userId: req.user.id,
        name: req.body.name,
        duration: req.body.duration,
    })

    return newWorkout.save()
    .then(result => res.status(201).send(result))
    .catch(err => errorHandler(err, req, res));
}

module.exports.getMyWorkouts = (req, res) => {
    Workout.find({ userId : req.user.id })
    .then(workouts => {
        if (workouts.length){
            return res.status(200).send({ workouts : workouts });
        }
        else {
            return res.status(200).send({ message : 'No workouts found.' })
        }
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.getMyWorkouts = (req, res) => {
    Workout.find({})
    .then(workouts => {
        if (workouts.length){
            return res.status(200).send({ workouts : workouts });
        }
        else {
            return res.status(200).send({ message : 'No workouts found.' })
        }
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.updateWorkout = (req, res) => {
    return Workout.findByIdAndUpdate(req.params.workoutId, req.body, { new: true })
    .then(updatedWorkout => {
        if (updatedWorkout) {
            res.status(200).send({
                message: 'Workout updated successfully', 
                updatedWorkout: updatedWorkout 
            });
        } else {
            res.status(404).send({ message: 'Workout not found' });
        }
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.deleteWorkout = (req, res) => {
    return Workout.deleteOne({ _id: req.params.id})
        .then(deletedResult => {
    
            if (deletedResult < 1) {
    
                return res.status(400).send({ error: 'No workout deleted' });
    
            }
    
            return res.status(200).send({ 
                message: 'Workout deleted successfully'
            });
    
        })
        .catch(err => errorHandler(err, req, res));
}

module.exports.completeWorkoutStatus = (req, res) => {
    Workout.findById(req.params.workoutId)
    .then( workout => {
        if (!workout) {
            res.status(404).send({ message : 'Workout not found' });
            return null
        }
        
        if (workout.status === "completed") {
            res.status(200).send({
                message : "Workout already completed",
                updatedWorkout : workout
            });
            return null
        }
        workout.status = "completed";
        return workout.save();
    })
    .then(updatedWorkout => {
        if (updatedWorkout) {
            return res.status(200).send({
                message : 'Workout status updated successfully',
                updatedWorkout : updatedWorkout
            });
        }
    })
    .catch(err => errorHandler(err, req, res));
};