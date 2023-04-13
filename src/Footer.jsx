import React, { useState } from "react";
import Livefeed from "./Livefeed";
import Database from "./Database";
import morningStarLogo from "./assets/morning_star_logo.jpg";
import "./App.css";

function Footer() {
  const handleLogout = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        window.location.replace("/login");
      }
    };
    xhttp.open("POST", "logout.php", true);
    xhttp.send();
  };
  //to change page
  const [showLivefeed, setShowLivefeed] = useState(true);

  const handleLivefeedClick = () => {
    setShowLivefeed(true);
  };

  const handleHistoryClick = () => {
    setShowLivefeed(false);
  };
  return (
    //top nav bar
    <div className="footer">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div className="d-flex align-items-center">
          <img id="liberty-logo" src={morningStarLogo} alt="logo" />
        </div>
        <button class="btn btn-dark" onClick={handleLivefeedClick}>
          Livefeed
        </button>
        <button class="btn btn-dark" onClick={handleHistoryClick}>
          sort History
        </button>
        <button class="btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      {showLivefeed ? <Livefeed /> : <Database />}
    </div>
  );
}

export default Footer;
