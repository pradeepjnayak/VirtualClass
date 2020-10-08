import React from "react";

export function Teachers(props) {
  const { teachers } = props;
  return (
    <div className="table table-responsive col-md-6">
      <table>
        <thead>
          <tr>Teachers</tr>
        </thead>
        <tbody>
          {teachers.map((rows, index) => {
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

export default Teachers;
