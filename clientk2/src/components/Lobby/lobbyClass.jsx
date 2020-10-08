import React, { Component } from "react";
import { classroomsListing } from "../../services/classrooms";
import ClassRoom from "../ClassRoom/classRoomClass";
import { Container, Row, Col } from "react-bootstrap";
import { getRole, getUserId, getUserName } from "../../Utils/Common";
import NavBar from "../NavBar/NavBar";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const wsClient = new W3CWebSocket("ws://127.0.0.1:7777/");

class Loby extends Component {
  state = { classrooms: [], classroomIds: [] };

  fetchClassRoomsData() {
    console.log("[fetchClassRoomsData] Fetching the classroom details");
    fetch("http://0.0.0.0:8080/api/classrooms")
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(
            "[fetchClassRoomsData] Response from the backend is : ",
            result
          );
          var temp = [];
          for (let i = 0; i < result.length; i++) {
            temp.push(result[i]._id);
          }
          this.setState({
            classrooms: result,
            classroomIds: temp,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  }

  componentDidMount() {
    // console.log("The lobby componenet has been mounted, Fetching details from backend");
    // const classroomListing = classroomsListing;

    this.fetchClassRoomsData();
    console.log(
      "[Loby]Total Number of classrooms available are : ",
      this.state.classrooms.length
    );

    wsClient.onopen = () => {
      console.log("[Loby][Socket] WebSocket Client Connected", wsClient);
    };
    wsClient.onmessage = (message) => {
      console.log(message.data);
      const updatedData = JSON.parse(message.data);
      console.log("[Loby][Socket] Classroom ids ", this.state.classroomIds);
      console.log("[Loby][Socket] RECEIVED MESSAGE ", updatedData);

      if (this.state.classroomIds.indexOf(updatedData.classId) > -1) {
        this.fetchClassRoomsData();
        console.log(
          "[Loby][Socket]Updated the classroom data based on the notification"
        );
      }
    };
  }

  render() {
    const userDetails = {
      userId: getUserId(),
      username: getUserName(),
      role: getRole(),
    };
    const classrooms = this.state.classrooms;
    console.log("[Loby][Render] Rendering the classes : ", classrooms);
    return (
      <div className="ClassRoomLobby">
        <Container fluid>
          <Row>
            <NavBar userDetails={userDetails} />
          </Row>
          <Row>
            {classrooms.map((classroom) => (
              <Col key={classroom._id}>
                <ClassRoom
                  updateComponent={this.state.updateComponent}
                  classDetails={classroom}
                  userRole={getRole()}
                  userId={getUserId()}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }
}

export default Loby;
