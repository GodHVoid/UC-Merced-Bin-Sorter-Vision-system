import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <Link to="/login">
        <button>Login Here</button>
      </Link>
      <br />
    </div>
  );
}

export default Home;