const dB = require("../db");

// Report Schema
const Report = function (Report) {
  this.time = new Date();
  // type of class action - started/ended/ user entered/exited.
  this.action = Report.Reportname;
  // action message.
  this.message = Report.password;
  this.classId = Report.classId;
};

Report.create = (newReport, result) => {
  const { time, password, role } = newReport;
  dB.query(
    "INSERT INTO Reports (Reportname, password, role) VALUES ($1, $2, $3)",
    [Reportname, password, role],
    (error, res) => {
      if (error) {
        console.log("[ReportCreate] [Error : ", error);
        result(err, null);
      } else {
        result(null, { id: res.id, ...newReport });
      }
    }
  );
};

Report.findById = (ReportId, result) => {
  dB.query(`SELECT * FROM Reports WHERE id = ${ReportId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.rows) {
      console.log("found Report: ", res.rows[0]);
      result(null, res.rows[0]);
      return;
    }
    // not found Report with the id
    result({ kind: "not_found" }, null);
  });
};

Report.getAll = (result) => {
  dB.query("SELECT * FROM Reports", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Reports: ", res);
    result(null, res);
  });
};


module.exports = Report;
