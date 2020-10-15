const routes = require("express").Router();
const path = require("path");
const users = require("../controllers/user.controller");
const classroom = require("../controllers/classroom.controller");
const report = require("../controllers/report.controller");

// Index route
routes.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/index.html"));
});

// Create a new User
routes.post("/users", users.create);

// Validate user login
routes.post("/users/signin", users.signIn);

// Retrieve all Users
routes.get("/users", users.findAll);

// Create a new Classrooom
routes.post("/classrooms", classroom.create);

// Retrieve all Classroooms
routes.get("/classrooms", classroom.findAll);

// Retrieve a single Classrooom with UserId
routes.get("/classrooms/:class_id", classroom.findOne);

// Update a Classrooom with classId
routes.put("/classrooms/:class_id", classroom.update);

// Delete a Classrooom with classId
routes.delete("/classrooms/:class_id", classroom.delete);

// Create a new report for class
routes.post("/reports/:class_id", report.create);

// Retrieve all reports
routes.get("/reports", report.findAll);

// Retrieve reports of a class
routes.get("/reports/:class_id", report.findOne);

// Delete a Classrooom with classId
routes.delete("/reports/:class_id", report.delete);

module.exports = routes;
