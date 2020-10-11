import React, { Component } from "react";
import { ClassRoom } from "../src/components/ClassRoom/classroom";
import Lobby from "../src/components/Lobby/lobbyClass";
import Login from "../src/components/Login/LoginPage";
import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getUserId } from "./Utils/Common";
import { history } from "./history";
import socketIOClient from "socket.io-client";
import { baseUrl } from "./constants";
const wsClient = new W3CWebSocket("ws://127.0.0.1:7777/");
const ENDPOINT = baseUrl;



class App extends Component {
  /*
  componentWillMount() {
    /*
    wsClient.onopen = () => {
      console.log("[Socket] WebSocket Client Connected", wsClient);
    };
    wsClient.onmessage = (message) => {
      console.log(message.data);
      console.log("[Socket] RECEIVED MESSAGE ", JSON.parse(message.data));
    };

   socket.on("FromAPI", data => {
     console.log(" Recieved message websocket", data)
   });
  }
  componentDidMount() {
    const socket = socketIOClient();
    console.log(" Socket connected : !",socket.connected)
    socket.emit("FromAPI")
    socket.on("FromAPI", data => {console.log(" on socket conenct : ", data)});
  }

  */
  render() {
    const userId = getUserId();
    var landing = null;
    if (userId) {
      landing = <Lobby />;
    } else {
      landing = <Login history={history}/>;
    }
    return (
      // <div className="App">
      //   <ClassRoom usertype="teacher"/>
      // </div>

      <div className="App">{landing}</div>
    );
  }
}

export default App;
