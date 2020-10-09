const { request, response } = require('express')

const Pool = require('pg').Pool

const dbName="virtual_class"

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: dbName,
  password: 'password',
  port: 5432,
})

/*
const createUserTable = () => {
    pool.query(`CREATE TABLE users (
        

    ) `)

}
*/

pool.query(' CREATE TABLE [IF NOT EXISTS] users (_id serial PRIMARY KEY , username VARCHAR(50)  UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, role VARCHAR NOT NULL);', (err, res) => {
    if (err) {
        console.log(" Error creating users table!")
    }
    console.log(" table users created!")
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        console.log("getUsers -error ", error)
        response.status(500).json({"eror": `users get ${error}`})
      } else {
          console.log("GET : ", results)
      response.status(200).json(results.rows)
      }
    })
  }


const createUser = (request, response) => {
    const { username, password, role } = request.body
  
    pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, password, role], (error, result) => {
      if (error) {
        console.log(" Error while creating users.", error)
      }else {
        console.log("user created with id: ", result )
        response.status(201).send(`User added with ID: ${result.insertId}`)
      }
    })
  }

const checkUsers = (request, response) => {
    pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [request.body.username, request.body.password], (error, results) => {
        if (error) {
          console.log("checkUsers -error ", error)
          response.status(500).json({"eror": `users get ${error}`})
        } else {
        if (results.rows) {
            var user_info = results.rows[0]
            var result = {}
            result["token"] = "abc"
            result['user'] = user_info['id']
            result['username'] = user_info['username']
            result['role'] = user_info['role']
            response.status(200).json(result)
        }else {
        response.status(401).json('Not authorized.')
        }
        }
      })
}

const createClassrooms = (request, response) => {
    const { name} = request.body
    pool.query('INSERT INTO classrooms (name,state, students, teachers) VALUES ($1, $2, $3, $4)', [name, 'offline', [], []], (error, result) => {
      if (error) {
        console.log(" Error while creating classrooms.", error)
      }else {
        response.status(201).send(`User added with ID: ${result.id}`)
      }
    })
  }

  const getClassrooms = (request, response) => {
    pool.query('SELECT * FROM classrooms ORDER BY id ASC', (error, results) => {
      if (error) {
        console.log("getClassrooms -error ", error)
        response.status(500).json({"eror": `getClassrooms ${error}`})
      } else {
      response.status(200).json(results.rows)
      }
    })
  }

const getIndividualClassroom = (request, response) => {
    console.log(" request.params.class_id ", request.params.class_id)
    pool.query(`SELECT * FROM classrooms WHERE id = ${request.params.class_id} ORDER BY id ASC`, (error, results) => {
      if (error) {
        console.log("getClassrooms -error ", error)
        response.status(500).json({"eror": `getClassrooms ${error}`})
      } else {
          response.status(200).json(results.rows[0])
      }
    })
}


const updateClassrooms = (request, response) => {
    const id = parseInt(request.params.class_id)
    const { action } = request.body
    var query = ""
    var values = []
    var reports_update_data = {action: request.body.action, classId: request.params.class_id , time: new Date()}
    if (action === "start") {
        query += "UPDATE classrooms SET state = $1, teachers = array_append(teachers, $2) WHERE id = $3"
        values  = ["active", request.body.teacher_id, id]
        reports_update_data['message'] = 'Class was started.'
    } else if (action === "end") {
        query += "UPDATE classrooms SET state = $1, teachers = $2, students = $3 WHERE id = $4"
        values  = ["offline" , [], [], id]   
        reports_update_data['message'] = 'Class was ended.'
    } else if (action === "enter") {
        if (request.body.teacher_id) {
            reports_update_data['message'] = `Teacher ${request.body.teacher_id} entered`
            query += "UPDATE classrooms SET teachers =array_append(teachers, $1) WHERE id = $2"
            values  = [request.body.teacher_id, id]
        } else {
            reports_update_data['message'] = `student ${request.body.student_id} entered`
            query += "UPDATE classrooms SET students =array_append(students, $1) WHERE id = $2"
            values  = [request.body.student_id, id] 
        }
    } else if (action == "exit") {
        if (request.body.teacher_id) {
            reports_update_data['message'] = `Teacher ${request.body.teacher_id} exited`
            query += "UPDATE classrooms SET teachers =array_remove(teachers, $1) WHERE id = $2"
            values  = [request.body.teacher_id, id]
        } else {
            reports_update_data['message'] = `student ${request.body.student_id} exited .`
            query += "UPDATE classrooms SET students =array_remove(students, $1) WHERE id = $2"
            values  = [request.body.student_id, id]
        }
    }

    pool.query(
        query,
        values,
      (error, results) => {
        if (error) {
            response.status(500).send(`Error updating classrooms`)
        }

        pool.query('INSERT INTO reports (action, message, classId, time) VALUES ($1, $2, $3, $4)', [reports_update_data['action'], reports_update_data['message'], id, reports_update_data['time'] ], (error, result) => {
            console.log(" Reports update data in put : ",reports_update_data )
            if (error){
                console.log(" Error while inserting reports: ", error)
            }
            pool.query(`SELECT * FROM classrooms WHERE id = ${request.params.class_id} ORDER BY id ASC`, (error, results) => {
                if (error) {
                  console.log("getClassrooms -error ", error)
                  response.status(500).json({"eror": `getClassrooms ${error}`})
                } else {
                    wss.clients.forEach(function each(client){
                        client.send(JSON.stringify({classId: request.params.class_id, status: 'update'}));
                    });
                    response.status(200).json(results.rows[0])
                }
            }
        )
      }
    )
  }
    )
}

const getIndividualClassReport =  (request, response) => {
    console.log(" request.params.class_id ", typeof request.params.class_id)
    pool.query(`SELECT * FROM reports WHERE classId = '${request.params.class_id}' ORDER BY id ASC`, (error, results) => {
      if (error) {
        console.log("getIndividualClassReport -error ", error)
        response.status(500).json({"eror": `getIndividualClassReport ${error}`})
      } else {
          response.status(200).json(results.rows)
      }
    })
}

module.exports = {
    getUsers,
    createUser,
    createClassrooms,
    getClassrooms,
    getIndividualClassroom,
    updateClassrooms,
    checkUsers,
    getIndividualClassReport
  }