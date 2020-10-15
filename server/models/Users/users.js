const dB = require("../db");

// User Schema
const User = function (user) {
  this.id = user.id;
  this.username = user.username;
  this.password = user.password;
  // type of user : student/teacher/admin.
  this.role = user.role;
};

User.create = (newUser, result) => {
  const { username, password, role } = newUser;
  dB.query(
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
    [username, password, role],
    (error, res) => {
      if (error) {
        console.log("[UserCreate] [Error : ", error);
        result(err, null);
      } else {
        result(null, { id: res.id, ...newUser });
      }
    }
  );
};

User.findById = (UserId, result) => {
  dB.query(`SELECT * FROM Users WHERE id = ${UserId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.rows) {
      console.log("found User: ", res.rows[0]);
      result(null, res.rows[0]);
      return;
    }
    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

// Validate user on username password.
User.checkUsers = (userCred, result) => {
    dB.query("SELECT * FROM users WHERE username = $1 AND password = $2", [userCred.username, userCred.password], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
        if ( res.rows.length > 0) {
            var user_info = {
                // TODO calculate unique string for token.
                token : 'abc',
                user  : res.rows[0]['id'],
                username : res.rows[0]['username'],
                role  : res.rows[0]['role']
            }
            result(null, user_info);
            return;
        }
        result({ kind: "not_found" }, null);
      });
}

User.getAll = (result) => {
  dB.query("SELECT * FROM Users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res.rows);
    result(null, res.rows);
  });
};

User.updateById = (id, User, result) => {
  dB.query(
    "UPDATE Users SET email = ?, name = ?, active = ? WHERE id = ?",
    [User.email, User.name, User.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (!res.rows) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated User: ", { id: id, ...User });
      result(null, { id: id, ...User });
    }
  );
};

User.remove = (id, result) => {
  dB.query("DELETE FROM Users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (!res.rows) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
  });
};

module.exports = User;
