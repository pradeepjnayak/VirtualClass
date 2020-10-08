import React, { Component } from "react";
import { ClassRoom } from "../src/components/ClassRoom/classroom";
import Lobby from "../src/components/Lobby/lobbyClass";
import Login from "../src/components/Login/LoginPage";
import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getUserId } from "./Utils/Common";

const wsClient = new W3CWebSocket("ws://127.0.0.1:7777/");

class App extends Component {
  componentWillMount() {
    wsClient.onopen = () => {
      console.log("[Socket] WebSocket Client Connected", wsClient);
    };
    wsClient.onmessage = (message) => {
      console.log(message.data);
      console.log("[Socket] RECEIVED MESSAGE ", JSON.parse(message.data));
    };
  }

  render() {
    const userId = getUserId();
    var landing = null;
    if (userId) {
      landing = <Lobby />;
    } else {
      landing = <Login />;
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
