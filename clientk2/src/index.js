import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import Routes from "./Routes";

const routing = (
  <Router>
    <div className="App">
      <Routes />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
