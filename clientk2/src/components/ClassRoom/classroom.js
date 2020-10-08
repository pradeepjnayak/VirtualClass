import React, { useState } from "react";

import { Students } from "../Students/students";
import { Teachers } from "../Teachers/teachers";

export function ClassRoom(props) {
  const [classLiveState, setClassLiveState] = useState(false);
  const { usertype } = props;
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  return (
    <div>
      {usertype === "teacher" ? (
        <button onClick={() => setClassLiveState(!classLiveState)}>
          {classLiveState ? "End" : "Start"}
        </button>
      ) : (
        <div></div>
      )}
      <div className="row">
        <Students students={students} />
        <Teachers teachers={teachers} />
      </div>
    </div>
  );
}

export default ClassRoom;
