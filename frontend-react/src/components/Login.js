import React, { useState } from "react";

function Login() {
  const request = "http://localhost:8080";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    fetch(request + "/api/login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }, 
      body: JSON.stringify({"user-id": username, "user-password": password})
    })
    .then(res => res.json())
    .then( response => {
      var data = response["data"];
      if (data !== null && data["token"]) {
        window.location.href = "/livesort";
      } else {
        alert(response["message"]);
        setUsername("");
        setPassword("");
      }
    })
  };

  return (
    <form onSubmit={handleLogin} className="loginForm">
      <div className="form-group row">
        <label htmlFor="username" className="col-sm-2 col-form-label">
          Username:
        </label>
        <br />
        <div className="col-sm-10">
          <input
            type="text"
            name="username"
            aria-label="Username"
            className="form-control"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
      </div>
      <br />
      <div className="form-group row">
        <label htmlFor="password" className="col-sm-2 col-form-label">
          Password:
        </label>
        <br />
        <div className="col-sm-10">
          <input
            type="password"
            name="password"
            aria-label="Password"
            className="form-control"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>
      <br />
      <button className="btn btn-dark" type="submit">Login</button>
    </form>
  );
}

export default Login;