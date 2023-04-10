import React, { useState } from "react";

function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    fetch("/login", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to login");
        }
      })
      .then((data) => {
        console.log(data);
        window.location.href = "/livefeed";
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to login");
      });
  };

  return (
    <form onSubmit={handleLogin} className="loginForm">
      <div class="form-group row">
        <label for="username" class="col-sm-2 col-form-label">
          Username:
        </label>
        <div class="col-sm-10">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            id="username"
            value={username}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>
      <div class="form-group row">
        <label for="password" class="col-sm-2 col-form-label">
          Password:
        </label>
        <div class="col-sm-10">
          <input
            type="password"
            class="form-control"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>
      <button class="btn btn-dark" type="submit">
        Login
      </button>
    </form>
  );
}
export default Login;
