const express = require("express");
const path = require('path')
const http = require("http")
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
var ws = require('ws')
const webSocketPort = 7777
var WebSocketServer = require('ws').Server
wss = new WebSocketServer({ port: webSocketPort });

const app = express();



// Body parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var router = express.Router()
var port = process.env.PORT || 8080; 




// database config
const dbclassrooms = require('./models/classrooms');
const dbusers = require('./models/users');
const dbreports = require('./models/reports');

const url = 'mongodb://127.0.0.1:27017/campk2'
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection;

db.once('open', _ => {
    console.log("Database connected.");
})

db.on("error", err => {
    console.error("Db connection error : ", err);
})


app.use(express.static(path.join(__dirname, 'build')));

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

// middleware to use for all requests
router.use(function(req, res, next) {
    const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080','http://0.0.0.0:8080'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


router.get("/", function(req, res){
    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({"msg": "notificatoin"}));
      });
    res.json({"message": "Hi there! It works!"})
});

app.use('/api', router);


router.route("/classrooms")
    .post(
        function(req, res){
            var classRoom = new dbclassrooms();
            classRoom.name = req.body.name;
            classRoom.state= 'offline'
            classRoom.teachers = []
            classRoom.students = []

            classRoom.save(function (error, document) {
                console.log("creating new class!")
                if (error) 
                    res.json({"error" : "Class creation failed."});
                res.json({message: 'Classroom created'})
            });
    })
    .get(function(req, res){
        console.log(" in get function.")
        dbclassrooms.find(function(err, classes) {
            if (err)
                res.json({"error": err.message})
            console.log(" GET classes: ", classes)
            res.json(classes)
        })
    });

// Singe GET

router.route('/classrooms/:class_id')

    .get(function(req, res) {
        console.log(" individual class get : ", req.params.class_id)
        dbclassrooms.findById(req.params.class_id, function(err, info) {
            if (err)
                res.send(err);
            res.json(info);
        });
    })

    .put(function(req, res) {

        var update_data = {}
        var reports_update_data = {action: req.body.action, classId: req.params.class_id , time: new Date()}
        if (req.body.action === "start") {
            update_data["$set"] = { teachers : [req.body.teacher_id], state : 'active'}
            reports_update_data['message'] = 'Class was started.'
        }
        else if (req.body.action === "end") {
            update_data["$set"] = { teachers : [], state : 'offline', students: []}
            reports_update_data['message'] = 'Class was ended.'
        }
        else if (req.body.action === "enter") {
            update_data["$addToSet"] = {students: req.body.student_id}
            reports_update_data['message'] = `student ${req.body.student_id} entered`
        }  
        else if (req.body.action === "exit") {
            if (req.body.student_id){
                update_data["$pull"] = {students: req.body.student_id}
                reports_update_data['message'] = `student ${req.body.student_id} logged out from classroom`
            }
        }

        dbclassrooms.findByIdAndUpdate(req.params.class_id, update_data, function(error, doc){
            if (error) {
                res.status(500).send("Update failed")
            }
            /*
            dbclassrooms.findById(req.params.class_id, function(error, info){
                if (error){
                    res.status(500).json({"error": "Could not fetch doc."})
                }
            */

            dbclassrooms.findById(req.params.class_id, function (error, info){
                dbreports.create(reports_update_data, function(err, doc){
                    if (err) {
                        console.log(" error updating records.")
                    }
                    wss.clients.forEach(function each(client){
                        client.send(JSON.stringify({classId: req.params.class_id, status: 'update'}));
                    });
                    console.log(" doc after update : ", info)
                
                    res.status(201).json(info)  
                })
            })
            })

    });


//users:

router.route("/users")
    .post(function(req, res){
        newUser = new dbusers()
        newUser.username = req.body.username
        newUser.password = req.body.password
        newUser.role = req.body.role
        newUser.save(function (error, document) {
            console.log("creating new class!")
            if (error) 
                res.json({"error" : "User creation failed."});
            res.json({message: 'User created successfully'})
        });
    })
    .get(
        function(req, res) {
            dbusers.find(
                function(err, user_info){
                if (err)
                    res.json({})
                var result = {users: user_info, total_users: user_info.length}
                res.json(result)            
            })
        });


// user login.

router.route('/users/signin')
    .post(function(req, res){
        console.log(" user trying to login ", req.body.username)
        dbusers.findOne({ username: req.body.username, password: req.body.password},
            function(err, user_info){
                if (err) {
                    res.send(err)
                }
                console.log(" user details fetchedd : ", user_info)
                if (user_info == null) {
                    res.status(401).send("Not authorized")
                } else {
                var result = {}
                result["token"] = "abc"
                result['user'] = user_info._id
                result['username'] = user_info.username
                result['role'] = user_info.role
                console.log(" User sigin successfull")
                res.status(200).send(result) //.json({'success' : true, 'result': user_info})
            }})
});



// Reports edit.

router.route("/reports/:class_id")
    .post(
        function(req, res) {
            audit = new dbreports()
            audit.time = new Date();
            audit.action = req.body.action;
            var message = '';
            if (req.body.action === "entry") {
                message = `Student ${req.body.student_id} logged in to class`
            }
            else if (req.body.action === "exit") {
                message = `Student ${req.body.student_id} logged out.`
            }
            else if (req.body.action === "start") {
                message = `Teacher ${req.body.teacher_id} started class.`
            }
            else if (req.body.action === "end") {
                message = `Teacher ${req.body.teacher_id} ended class.`
            }
            audit.message = message;
            audit.classId = req.params.class_id
            audit.save(function (error, document) {
                console.log("creating new class!")
                if (error) 
                    res.json({"error" : "Error udpating reports log."});
                res.json({message: 'Report log inserted"'})
            });      }
    )
    .get(function(req, res) {
        dbreports.find({classId: req.params.class_id }, function(err, info) {
            if (err)
                res.send(err);
            res.json(info);
        });
    });


app.listen(port)

console.log(' Webservice started at ', port)

