import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { baseUrl } from "../../constants";

import socketIOClient from "socket.io-client";
var socket;


class Reports extends Component {
    constructor(){
        super();
        this.state = {
            reportsList : []
        }
        socket = socketIOClient(baseUrl)
    }
    componentDidMount() {

        socket.on("update", data => {
            const passedState = this.props.history.location.state;
            const updatedData = JSON.parse(data);
            const url = baseUrl + "/api/reports/".concat(
                passedState.classId
              );
            if (passedState.classId == updatedData.classId) {
                fetch(url)
                .then((res) => res.json())
                .then((result) => {
                    this.setState( prevState => {
                        const reportsList = result;
                        return {
                            reportsList,
                        };
                    })
                })}
            })
        const passedState = this.props.history.location.state;
        const url = baseUrl + "/api/reports/".concat(
          passedState.classId
        );

        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                this.setState( prevState => {
                    const reportsList = result
                    return {
                        reportsList,
                    };
                })
            })
        
        
    }
    render() {
        return (
            <div>
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Action</th>
                            <th scope="col">Message</th>
                            <th scope="col">Time</th>
                        </tr>
                    </thead>
                    <tbody>

                    {this.state.reportsList.map( (log, index) => (
                            <tr key={index}>
                            <td> {index}</td>
                            <td> {log.action}</td>
                            <td> {log.message} </td>
                            <td> {log.time} </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        )
    }
}

export default Reports;