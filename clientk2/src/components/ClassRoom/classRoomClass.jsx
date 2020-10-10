import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import { Button } from "react-bootstrap";
import history from "../../history";
import {baseUrl} from "../../constants";
import axios from "axios";

class ClassRoom extends Component {
  state = {
    classId: "",
    classState: "offline",
    className: "ClassRoom",
    teachers: [],
    students: [],
    role: "",
    userId: "",
    updateComponent: false,
  };

  updateClassState() {}

  componentDidMount() {
    console.log(
      "[ClassRoom][componentDidMount] The class Component loaded. Gathering details from backend"
    );
    console.log(
      "[ClassRoom][componentDidMount] Class details Recieved is : ",
      this.props.classDetails
    );
    const details = this.props.classDetails;
    const role = this.props.userRole;
    const userId = this.props.userId;
    const updateComponent = this.props.updateComponent || false;
    // console.log(details);
    this.setState({
      classId: details.id,
      classState: details.state,
      className: details.name,
      teachers: details.teachers,
      students: details.students,
      role: role,
      userId: userId,
    });
  }

  buttonClickHandler = (classId) => {
    console.log("[buttonClickHandler] class id is ", classId);
    if (this.state.role === "STUDENT") {
      var url = baseUrl + "/api/classrooms/";
      const classroomUpdateUrl = url.concat(classId);
      console.log(
        "[handleClassEnd] ClassRoomUpdate Url is : ",
        classroomUpdateUrl
      );
      axios
        .put(classroomUpdateUrl, {
          action: "enter",
          student_id: this.state.userId,
        })
        .then((response) => {
          console.log("[handleClassEnd] Update response is :", response);
          this.setState({ students: response.data.students });
          const base = "/classrooms/";
          const url = base.concat(classId);
          console.log("[buttonClickHandler] Url to be sent to is : ", url);
          history.push(url, { classId: classId });
        })
        .catch((error) => {
          if (error.response.status === 401)
            console.log(error.response.data.message);
          else console.log("Something went wrong. Please try again later.");
        });
    } else {
      const base = "/classrooms/";
      const url = base.concat(classId);
      console.log("[buttonClickHandler] Url to be sent to is : ", url);
      history.push(url, { classId: classId });
    }
  };
  reportButtonClickHandler = (classId) => {
    if (this.state.role === "ADMIN") {
      const base = "/reports/";
      const url = base.concat(classId);
      console.log("[buttonClickHandler] Url to be sent to is : ", url);
      history.push(url, { classId: classId });
    }
  };

  componentDidUpdate() {
    console.log("[ClassRoom][render] Updated!");
    console.log(
      "[ClassRoom][componentDidUpdate] Updateing the component using the props."
    );
    const details = this.props.classDetails;
    const role = this.props.userRole;
    const userId = this.props.userId;
    // console.log(details);
    if (
      details.teachers !== this.state.teachers ||
      details.students !== this.state.students
    ) {
      this.setState({
        classId: details.id,
        classState: details.state,
        className: details.name,
        teachers: details.teachers,
        students: details.students,
      });
    }
  }

  render() {
    console.log("[ClassRoom][render] Class To be Rendered is : ", this.state);
    const classId = this.state.classId;
    const badge =
      this.state.classState === "active" ? (
        <Badge variant="primary">Active</Badge>
      ) : (
        <Badge variant="secondary">Offline</Badge>
      );
    const studentCount = this.state.students.length;
    const teachersCount = this.state.teachers.length;
    var entryButton = <Button variant="secondary"> Enter </Button>;
    var reportsButton = <Button variant="secondary"> Reports </Button>;
    if (this.state.role === "STUDENT") {
      if (this.state.classState === "active") {
        entryButton = (
          <Button
            variant="outline-primary"
            onClick={() => this.buttonClickHandler(classId)}
          >
            Enter
          </Button>
        );
      }
    } else if (this.state.role === "TEACHER") {
      if (
        this.state.classState === "offline" ||
        this.state.teachers.indexOf(this.state.userId) > -1
      ) {
        entryButton = (
          <Button
            variant="outline-primary"
            onClick={() => this.buttonClickHandler(classId)}
          >
            Enter
          </Button>
        );
      }
    }
    else if (this.state.role === "ADMIN") {
      reportsButton = (
        <Button
          variant="outline-primary"
          onClick={() => this.reportButtonClickHandler(classId)}
          >
            Reports
          </Button>
      )

      }
    return (
      <div className={this.state.classId}>
        <p>
          Classroom : <b>{this.state.className}</b>{" "}
        </p>
        <p>Students : {studentCount} </p>
        <p>Teachers : {teachersCount}</p>
        <p>
          {badge}
          {"   "}
          {this.state.role === "ADMIN" ? reportsButton : entryButton }
          </p>
      </div>
    );
  }
}

export default ClassRoom;
