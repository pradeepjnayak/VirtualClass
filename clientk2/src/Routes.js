import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Lobby from "./components/Lobby/lobbyClass";
import ClassRoom from "./components/ClassRoom/classRoomClass";
import ClassRoomSpecific from "./components/ClassRoom/classRoomSpecific";
// import Login from "./components/Lobby/lobbyClass";
import LoginPage from "./components/Login/LoginPage";
import Reports from "./components/Reports/reports"

import App from "./App";
import history from "./history";

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/lobby" component={Lobby} />
          <Route path="/classrooms" component={ClassRoomSpecific} />
          <Route path="/home" exact component={App} />
          <Route path="/login" component={LoginPage} />
          <Route path="/reports" component={Reports} />
          <Route path="/" exact component={App} />
          <Route path="" exact component={App} />
        </Switch>
      </Router>
    );
  }
}
