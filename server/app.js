require("dotenv").config();
const app = require("express")();
const routes = require("./api/routes");
var bodyParser = require("body-parser");

var server = app.listen(process.env.SERVICE_PORT || 3000, () => {
  console.log(" Starting web service : ", process.env.SERVICE_PORT);
});

const socketIo = require("socket.io");
let io = socketIo.listen(server);

io.on("connection", (socket) => {
  console.log("Connected with new client ", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

var cors = require("cors");

//
app.use(cors());

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// using middle ware to pass socket io object in req.
app.use(function (req, res, next) {
  req.io = io;
  next();
});
//  Connect all our routes to our application
app.use("/api", routes);
