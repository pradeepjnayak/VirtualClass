const express = require("express");
const path = require('path')
const http = require("http")
const bodyParser = require("body-parser");
var cors = require('cors');

const db = require('./queries')

const app = express();

const webSocketPort = 7777
var WebSocketServer = require('ws').Server
wss = new WebSocketServer({ port: webSocketPort });

app.use(cors());

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var router = express.Router()
var port = process.env.PORT || 8080; 


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
app.use('/api', router);

router.post('/users/signin', db.checkUsers)

router.get('/users', db.getUsers)

router.post("/users", db.createUser)

router.post("/classrooms", db.createClassrooms)

router.get("/classrooms", db.getClassrooms)

router.get("/classrooms/:class_id", db.getIndividualClassroom)

router.put("/classrooms/:class_id", db.updateClassrooms)

router.get("/reports/:class_id", db.getIndividualClassReport)

app.listen(port)

console.log(" Server listening at ", port)