const dB = require("../db");

// ClasssRoom Schema
const ClasssRoom = function (ClasssRoom) {
    // name of classroom
  this.name = ClasssRoom.name;
  // class state - active / offline
  this.state = ClasssRoom.state;
  // list of student ids present.
  this.students = ClasssRoom.students;
  // list of teachers present.
  this.teachers = ClasssRoom.teachers;
};

ClasssRoom.create = (newClasssRoom, result) => {
  const { name } = newClasssRoom;
  dB.query('INSERT INTO classrooms (name,state, students, teachers) VALUES ($1, $2, $3, $4)', [name, 'offline', [], []],
    (error, res) => {
      if (error) {
        console.log("[ClasssRoomCreate] [Error : ", error);
        result(err, null);
      } else {
        result(null, { id: res.id, ...newClasssRoom });
      }
    }
  );
};

ClasssRoom.findById = (ClasssRoomId, result) => {
  dB.query(`SELECT * FROM ClasssRooms WHERE id = ${ClasssRoomId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.rows) {
      console.log("found ClasssRoom: ", res.rows[0]);
      result(null, res.rows[0]);
      return;
    }
    // not found ClasssRoom with the id
    result({ kind: "not_found" }, null);
  });
};

ClasssRoom.getAll = (result) => {
  dB.query("SELECT * FROM ClasssRooms", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("ClasssRooms: ", res);
    result(null, res);
  });
};

ClasssRoom.updateById = (id, action, student_id=null, teacher_id=null, result) => {
  var query = ""
  var values = []
  var reports_update_data = {action: action, classId: id , time: new Date()}
  if (action === "start") {
      query += "UPDATE classrooms SET state = $1, teachers = array_append(teachers, $2) WHERE id = $3"
      values  = ["active", teacher_id]
      reports_update_data['message'] = 'Class was started.'
  } else if (action === "end") {
      query += "UPDATE classrooms SET state = $1, teachers = $2, students = $3 WHERE id = $4"
      values  = ["offline" , [], [], id]   
      reports_update_data['message'] = 'Class was ended.'
  } else if (action === "enter") {
      if (teacher_id) {
          reports_update_data['message'] = `Teacher ${teacher_id} entered`
          query += "UPDATE classrooms SET teachers =array_append(teachers, $1) WHERE id = $2"
          values  = [teacher_id, id]
      } else {
          reports_update_data['message'] = `student ${student_id} entered`
          query += "UPDATE classrooms SET students =array_append(students, $1) WHERE id = $2"
          values  = [student_id, id] 
      }
  } else if (action == "exit") {
      if (teacher_id) {
          reports_update_data['message'] = `Teacher ${teacher_id} exited`
          query += "UPDATE classrooms SET teachers =array_remove(teachers, $1) WHERE id = $2"
          values  = [teacher_id, id]
      } else {
          reports_update_data['message'] = `student ${student_id} exited .`
          query += "UPDATE classrooms SET students =array_remove(students, $1) WHERE id = $2"
          values  = [student_id, id]
      }
  }

  dB.query(query, values,
            (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
                }
          
                if (res.rows == 0) {
                  // not found ClasssRoom with the id
                  result({ kind: "not_found" }, null);
                  return;
                }
          
                console.log("updated ClasssRoom: ", { id: id, ...ClasssRoom });
                result(null, { id: id, ...ClasssRoom });
              }
            );
};

ClasssRoom.remove = (id, result) => {
  dB.query("DELETE FROM ClasssRooms WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found ClasssRoom with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted ClasssRoom with id: ", id);
    result(null, res);
  });
};

module.exports = ClasssRoom;
