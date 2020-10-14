const Report = require("../models/Reports/reports");

// Add action on a class.
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a User
  const report = new Report({
    action: req.body.action,
    message: "",
    class_id: req.params.class_id,
  });

  // Save User in the database
  User.create(report, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating Report.",
      });
    else res.send(data);
  });
};

// Retrieve all reports on a class.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving reports.",
      });
    else res.send(data);
  });
};

// Find a single report with a classId
exports.findOne = (req, res) => {};

// Delete a Classroom with the specified classId in the request
exports.delete = (req, res) => {};
