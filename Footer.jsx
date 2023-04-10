import React, { useState } from "react";
import Livefeed from "./Livefeed";
import History from "./History";
import morningStarLogo from "./assets/morning_star_logo.jpg";
import "./App.css";

function Footer() {
  const [showLivefeed, setShowLivefeed] = useState(true);

  const handleLivefeedClick = () => {
    setShowLivefeed(true);
  };

  const handleHistoryClick = () => {
    setShowLivefeed(false);
  };

  return (
    <div className="footer">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <img id="liberty-logo" src={morningStarLogo} alt="logo" />
        <button class="btn btn-dark" onClick={handleLivefeedClick}>
          Livefeed
        </button>
        <button class="btn btn-dark" onClick={handleHistoryClick}>
          sorthistory
        </button>
      </nav>
      {showLivefeed ? <Livefeed /> : <History />}
    </div>
  );
}

export default Footer;
