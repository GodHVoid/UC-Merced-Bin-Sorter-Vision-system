import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <Link to="/login">
        <button>Login</button>
      </Link>
      <br />
      <img src={require("../assets/liberty-logo.jpg")} />
    </div>
  );
}

export default Home;