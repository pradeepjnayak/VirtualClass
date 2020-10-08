import { Navbar, Form, InputGroup, FormControl, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import React, { Component } from "react";

class NavBar extends Component {
  state = { username: "", userId: "", role: "" };
  componentDidMount() {
    const details = this.props.userDetails;
    this.setState({
      username: details.username,
      userId: details.userId,
      role: details.role,
    });
  }

  render() {
    return (
      <Row className={this.state.userId}>
        <Col>
          <Navbar className="bg-light">
            <p>
              {" "}
              Role : {this.state.role} {"      "}
              Logged in as {this.state.username}
            </p>
          </Navbar>
        </Col>
      </Row>
    );
  }
}

export default NavBar;
