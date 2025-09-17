const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

require('dotenv').config();

const app = express();
app.use(express.json());

const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");
const { errorHandler } = require('./middleware/errorHandler');

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_STRING);
let db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error"));
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};