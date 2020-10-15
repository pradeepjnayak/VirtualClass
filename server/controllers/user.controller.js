// Import user model
const User = require("../models/Users/users");

// New User creation.
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a User
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    id: req.body.username,
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    else res.send(data);
  });
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.send(data);
  });
};

// Validate user login credentials.
exports.signIn = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a User
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  User.checkUsers(user, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(401).send({
          message: `Invalid username password.`,
        });
      } else {
        return res.status(500).send({
          message: err.message || "Some error occurred while retrieving users.",
        });
      }
    }
    res.send(data);
  });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.UserId , (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.customerId,
        });
      }
    } else res.send(data);
  });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  User.updateById(req.params.UserId, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer with id " + req.params.customerId,
        });
      }
    } else res.send(data);
  });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {};

// Delete all users from the database.
exports.deleteAll = (req, res) => {};
