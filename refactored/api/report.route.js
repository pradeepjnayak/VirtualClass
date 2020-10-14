module.exports = (app) => {
    const report = require("../controllers/report.controller");
  
    // Create a new report for class
    app.post("/reports/:class_id", report.create);

    // Retrieve all reports
    app.get("/reports", report.findAll);
  
    // Retrieve reports of a class
    app.get("/reports/:class_id", report.findOne);

    // Delete a Classrooom with classId
    app.delete("/reports/:class_id", report.delete);

  };
  