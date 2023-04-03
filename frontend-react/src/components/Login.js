import React from "react";

function Login() {
  return (
    <div className="Login">
      <form>
        <label htmlFor="sorter-id">ID</label>
        <input type="text" />
        <br />
        <label htmlFor="sorter-password">Password</label>
        <input type="password" />
        <br />
        <button>Log In</button>
      </form>
    </div>
  );
}

export default Login;