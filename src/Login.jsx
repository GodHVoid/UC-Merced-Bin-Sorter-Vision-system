import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(this.responseText);
        window.location.href = "/livefeed";
      } else if (this.readyState === 4) {
        console.error("Failed to login");
        setErrorMessage("Failed to login");
      }
    };
    xhttp.open("POST", "/login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ username, password }));
  };

  return (
    <form onSubmit={handleLogin} className="loginForm">
      <div className="form-group row">
        <label htmlFor="username" className="col-sm-2 col-form-label">
          Username:
        </label>
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
      <div className="form-group row">
        <label htmlFor="password" className="col-sm-2 col-form-label">
          Password:
        </label>
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
      <button className="btn btn-dark" type="submit">
        Login
      </button>
    </form>
  );
}

export default Login;
