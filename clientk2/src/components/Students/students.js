import React from "react";

export function Students(props) {
  const { students } = props;
  //const students = [1,2,3];
  return (
    <div className="table  table-responsive col-md-6">
      <table>
        <thead>
          <tr>Students</tr>
        </thead>
        <tbody>
          {students.map((rows, index) => {
            return (
              <tr key={index}>
                {" "}
                <td> {rows} </td>{" "}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Students;
