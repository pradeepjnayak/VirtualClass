import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

class Reports extends Component {
    state = {
        reportsList : []
    }
    componentDidMount() {
        const passedState = this.props.history.location.state;
        console.log("[Reports]Recieved props", passedState);
        const classUrlPath = this.props.history.location.pathname;
        console.log("[Reports]Recieved Path is ", classUrlPath);
        const url = "http://0.0.0.0:8080/api/reports/".concat(
          passedState.classId
        );

        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                this.setState( prevState => {
                    const reportsList = prevState.reportsList.concat(result)
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