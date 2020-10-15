module.exports = (app) => {
    const classroom = require("../controllers/classroom.controller");
  
    // Create a new Classrooom
    app.post("/classrooms", classroom.create);

    // Retrieve all Classroooms
    app.get("/classrooms", classroom.findAll);
  
    // Retrieve a single Classrooom with UserId
    app.get("/classrooms/:class_id", classroom.findOne);
  
    // Update a Classrooom with classId
    app.put("/classrooms/:class_id", classroom.update);
  
    // Delete a Classrooom with classId
    app.delete("/classrooms/:class_id", classroom.delete);

  };
  