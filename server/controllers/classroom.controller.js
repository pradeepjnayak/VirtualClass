const Classroom = require("../models/Classrooms/classrooms");

// New Classroom creation.
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Classroom
  const classroom = new Classroom({
    name: req.body.name,
    state: req.body.name,
    students: [],
    teachers: [],
  });

  // Save Classroom in the database
  Classroom.create(classroom, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Classroom.",
      });
    else res.send(data);
  });
};

// Retrieve all Classrooms from the database.
exports.findAll = (req, res) => {
  Classroom.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving classrooms.",
      });
    else res.send(data);
  });
};

// Find a single Classroom with a classId
exports.findOne = (req, res) => {
  Classroom.findById(req.params.class_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found class with id ${req.params.class_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving class with id " + req.params.class_id,
        });
      }
    } else res.send(data);
  });
};

// Update a Classroom identified by the classId in the request
exports.update = ( req, res, socket) => {
  // Validate Request
  console.log(" req :::: ", req.io)
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  //console.log(" res ::: ", res)
  //console.log(" socket -->",socket)
    // Create a Classroom
    const classroom = new Classroom({
      name: req.body.name,
      state: req.body.name,
      action: req.body.action,
      student_id: req.body.student_id,
      teacher_id: req.body.teacher_id
    });
  Classroom.updateById(
    req.params.class_id,
    req.body,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Class with id ${req.params.class_id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Class with id " + req.params.class_id,
          });
        }
      } else {
        req.io.emit(
          "update",
          JSON.stringify({
            classId: req.params.class_id,
            status: "update",
          }));
      res.send(data);
      }
    }
  );
};

// Delete a Classroom with the specified classId in the request
exports.delete = (req, res) => {};
