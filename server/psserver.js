const express = require("express");
const path = require('path')
const bodyParser = require("body-parser");
var cors = require('cors');

const db = require('./queries')

const app = express();

app.use(cors());

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var router = express.Router()
var port = process.env.PORT || 8080; 

var server = app.listen(port)

const socketIo = require("socket.io");
const io = socketIo.listen(server);


io.on("connection", (socket) => {
    console.log("Connected with new client ", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    });

/*
wss = new WebSocketServer({ server: app })

wss.on('connection', (ws) => {
    console.log(" Client Connected !", ws)
});
*/
// middleware to use for all requests
router.use(function(req, res, next) {
    const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080','http://0.0.0.0:8080',
                            'http://127.0.0.1:3000'];
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

router.post("/classrooms", (req, res)=> {
    db.createClassrooms(req,res, socket)
})

router.get("/classrooms", db.getClassrooms)

router.get("/classrooms/:class_id", db.getIndividualClassroom)

router.put("/classrooms/:class_id", (req, res)=> {
    db.updateClassrooms(req,res, io)
}
);

router.get("/reports/:class_id", db.getIndividualClassReport)

console.log(" Server listening at ", port)