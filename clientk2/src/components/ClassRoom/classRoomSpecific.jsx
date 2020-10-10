import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { getRole, getUserId, getUserName } from "../../Utils/Common";
import NavBar from "../NavBar/NavBar";
import { baseUrl } from "../../constants";
import socketIOClient from "socket.io-client";
//import { socket } from "../Lobby/lobbyClass";
// const client = new W3CWebSocket("ws://127.0.0.1:7777/");

var socket;

class ClassRoomSpecific extends Component {
  constructor() {
    super();
  this.state = {
    classId: "",
    className: "",
    classState: "offline",
    teachers: [],
    students: [],
  };
  socket = socketIOClient(baseUrl)
}
  fetchAndUpdateClassDetails(url) {
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          const classDetails = result;
          this.setState({
            classId: classDetails.id,
            className: classDetails.name,
            classState: classDetails.state,
            teachers: classDetails.teachers,
            students: classDetails.students,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    const passedState = this.props.history.location.state;
    console.log("[ClassRoomSpecific]Recieved props", passedState);
    const classUrlPath = this.props.history.location.pathname;
    console.log("[ClassRoomSpecific]Recieved Path is ", classUrlPath);
    const url = baseUrl + "/api/classrooms/" + passedState.classId;
    this.fetchAndUpdateClassDetails(url);

    socket.on("update", message => {
      const updatedData = JSON.parse(message);
      console.log("[ClassRoomSpecific][Socket] RECEIVED MESSAGE ", updatedData.classId);
      if (updatedData.classId == this.state.classId) {
        this.fetchAndUpdateClassDetails(url);
      }
    });

    socket.on('connect', message => {
      console.log(" [ClassRoomSpecific][Socket] connected !")
    });
    /*
    client.onopen = () => {
      console.log(
        "[ClassRoomSpecific][Socket] WebSocket Client Connected",
        client
      );
    };
    client.onmessage = (message) => {
      console.log(message.data);
      const updatedData = JSON.parse(message.data);
      console.log("[ClassRoomSpecific][Socket] RECEIVED MESSAGE ", updatedData);
      if (updatedData.classId === this.state.classId) {
        this.fetchAndUpdateClassDetails(url);
      }
    };
    */
  }

  handleClassStart = (userId) => {
    if (this.state.classId !== null && userId !== null) {
      var url = baseUrl + "/api/classrooms/";
      const classroomUpdateUrl = url.concat(this.state.classId);
      console.log(
        "[handleClassStart] ClassRoomUpdate Url is : ",
        classroomUpdateUrl
      );
      axios
        .put(classroomUpdateUrl, { action: "start", teacher_id: userId })
        .then((response) => {
          console.log("[handleClassStart] Update response is :", response);
          this.setState({
            teachers: response.data.teachers,
            students: response.data.students,
            classState: response.data.state,
          });
          // setLoading(false);
          // setUserSession(response.data.token, response.data.user, response.data.username, response.data.role);
          // props.history.push('/lobby');
        })
        .catch((error) => {
          //setLoading(false);
          if (error.response.status === 401)
            console.log(error.response.data.message);
          else console.log("Something went wrong. Please try again later.");
        });
    }
  };

  handleClassEnd = (userId) => {
    if (this.state.classId !== null && userId !== null) {
      var url = baseUrl + "/api/classrooms/";
      const classroomUpdateUrl = url.concat(this.state.classId);
      console.log(
        "[handleClassEnd] ClassRoomUpdate Url is : ",
        classroomUpdateUrl
      );
      axios
        .put(classroomUpdateUrl, { action: "end", teacher_id: userId })
        .then((response) => {
          console.log("[handleClassEnd] Update response is :", response);
          this.setState({
            teachers: response.data.teachers,
            students: response.data.students,
            classState: response.data.state,
          });
          })
        .catch((error) => {
          if (error.response.status === 401)
            console.log(error.response.data.message);
          else console.log("Something went wrong. Please try again later.");
        });
    }
  };

  render() {
    const studentCount = this.state.students.length;
    const teachersCount = this.state.teachers.length;
    const badge =
      this.state.classState == "active" ? (
        <Badge variant="primary">Active</Badge>
      ) : (
        <Badge variant="secondary">Offline</Badge>
      );
    var startClass = null;
    var stopClass = null;
    const userRole = getRole();
    const userId = getUserId();

    if (getRole() == "TEACHER") {
      startClass = (
        <Button variant="secondary" onClick={() => {}}>
          {" "}
          Start Class{" "}
        </Button>
      );
      stopClass = (
        <Button variant="secondary" onClick={() => {}}>
          {" "}
          End Class{" "}
        </Button>
      );
    }
    if (this.state.classState == "offline" && getRole() == "TEACHER") {
      startClass = (
        <Button
          variant="outline-primary"
          onClick={() => this.handleClassStart(userId)}
        >
          {" "}
          Start Class{" "}
        </Button>
      );
      console.log("Startclass Option is enabled");
    }
    if (this.state.classState == "active" && getRole() == "TEACHER") {
      if (this.state.teachers.indexOf(userId) > -1) {
        stopClass = (
          <Button
            variant="outline-primary"
            onClick={() => this.handleClassEnd(userId)}
          >
            {" "}
            End Class{" "}
          </Button>
        );
        console.log("StopClass Option is enabled");
      }
    }
    var classId = "ClassRoomSpecific".concat(this.state.classId);
    return (
      <Container>
        <Row>
          <Col>
            <NavBar
              userDetails={{
                username: getUserName(),
                userId: getUserId(),
                role: getRole(),
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={classId}>
              <p>
                Speicific Classroom : <b> {this.state.className} </b>
              </p>
              <p> {badge} </p>
              <p>
                {" "}
                {startClass} {stopClass}
              </p>

              <Container fluid>
                <Row>
                  <Col>
                    <p> Students : {studentCount} </p>
                  </Col>
                  <Col>
                    <p> Teachers : {teachersCount}</p>
                  </Col>
                </Row>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default ClassRoomSpecific;
