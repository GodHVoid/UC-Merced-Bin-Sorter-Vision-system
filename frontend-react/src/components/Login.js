import React, { useState } from "react";
import decode from "../routes/Auth";
import "../styles/Login.css";

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

      if (data !== null) {
        var decoded = decode(data["token"]);
        var is_trainer = decoded["is-trainer"];
        var user = decoded["user-id"];
        
        localStorage.setItem("token", data["token"]);
        is_trainer ? window.location.href = "./trainer-dashboard" : window.location.href = "./livesort";
      } else {
        alert(response["message"]);
        setUsername("");
        setPassword("");
      }
    })
  };

  return (
    <div className="Login">
      
      <div className="Login-logo">
        <img 
          src={require("../assets/morning-star-logo.jpg")}
          alt="MorningStarLogo"
        />
        <br />
        <img 
          src={require("../assets/liberty-logo.jpg")}
          alt="LibertyPackingCoLogo"
        />
      </div>

      <div className="Login-form">
        <form onSubmit={handleLogin}>
          <h1>Livesort Login</h1>
          <br />
          <div>
            <label htmlFor="username">
              Username:
            </label>
            <br />
            <div>
              <input
                type="text"
                name="username"
                aria-label="Username"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
          <br />
          <div>
            <label htmlFor="password">
              Password:
            </label>
            <br />
            <div>
              <input
                type="password"
                name="password"
                aria-label="Password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          <br />
          <button className="submit-btn" type="submit">Login</button>
        </form>
      </div>

    </div>
  );
}

export default Login;