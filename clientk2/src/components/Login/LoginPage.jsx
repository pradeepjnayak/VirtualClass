import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../../Utils/Common";
import { baseUrl } from "../../constants";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios
      .post(baseUrl+"/api/users/signin", {
        username: username.value,
        password: password.value,
      })
      .then((response) => {
        console.log("Login response is :", response);
        setLoading(false);
        setUserSession(
          response.data.token,
          response.data.user,
          response.data.username,
          response.data.role
        );
        props.history.push("/lobby");
      })
      .catch((error) => {
        console.log("Error while logging in : ", error);
        setLoading(false);
        if (error.response.status === 401)
          setError(error.response.data.message);
        else setError("Something went wrong. Please try again later.");
      });
  };

  return (
    <div>
      Virtual Classrooms Login
      <br />
      <br />
      <div>
        Username
        <br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password
        <br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && (
        <p>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </p>
      )}
      <br />
      <input
        type="button"
        value={loading ? "Loading..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
      <br />
    </div>
  );
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default Login;
