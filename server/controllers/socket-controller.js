var socketIo = require('socket.io');
global.socket_io = {};

const listen = function(app){
    // this function expects a socket_io connection as argument
    socket_io = socketIo.listen(app);
    // now we can do whatever we want:
    socket_io.on('connection',function(notifyData){
        // as is proper, protocol logic like
        // this belongs in a controller:
        console.log("connected")
        //socket_io.broadcast.emit("update", JSON.stringify(notifyData));
    });
}

const emitSocket = function(msg, data) {
    console.log(" socket io object ", socket_io)
    socket_io.emit(msg, JSON.stringify(data))
}

console.log("[socketcontroller] called  in page")
module.exports = {
    socket_io,
    listen,
    emitSocket
}
/*
module.exports = function(app){
    // this function expects a socket_io connection as argument
    socket_io = socketIo.listen(app);
    // now we can do whatever we want:
    socket_io.on('connection',function(notifyData){
        // as is proper, protocol logic like
        // this belongs in a controller:
        console.log("connected")
        //socket_io.broadcast.emit("update", JSON.stringify(notifyData));
    });
}
*/