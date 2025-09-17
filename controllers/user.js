const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { errorHandler } = require("../middleware/errorHandler");

module.exports.registerUser = (req, res) => {

  if (!req.body.email.includes("@")) {
    return res.status(400).send({message: "Invalid email format"})
  }

  if (req.body.password.length < 8) {
    return res.status(400).send({message: "Password must be atleast 8 characters"})
  }

  
  return User.findOne({ email: req.body.email })
  .then(existingUser => {
    if (existingUser) {
      return res.status(409).send({message: "There is already a user registered with this email"});
    } else {
      let newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12)
      });
      
      return newUser.save()
      .then(savedUser => {
        return res.status(201).send({
          message: "Registered successfully",
        });
      })
      .catch(error => errorHandler(error, req, res));
    }
  })
  .catch(error => errorHandler(error, req, res));
};

module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    
    return User.findOne({ email: req.body.email })
    .then(result => {
      if (result == null) {
        return res.status(404).send({ message: "No email found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
        
        if (isPasswordCorrect) {
          return res.status(200).send({ 
            access: auth.createAccessToken(result) 
          });
        } else {
          return res.status(401).send({ message: "Incorrect email or password"});
        }
      }
    })
    .catch(error => errorHandler(error, req, res));
    
  } else {
    return res.send({message: "Invalid email format"})
  }
};

module.exports.getProfile = (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(400).send({ message: "Invalid request: Missing user ID" });
    }

    User.findById(req.user.id)
    .select("-password -isAdmin")
    .then(result => {
        if (!result) {
            return res.status(404).send({ message: "User not found" });
        } else {
            return res.status(200).send({
                user: result
            });
        }
    })
    .catch(error => errorHandler(error, req, res));
};