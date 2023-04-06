import React from "react";

function Footer() {
  return (
    <div className="Footer">
      <nav>
        <img 
          id="liberty-logo" src={require("../assets/liberty-logo.jpg")} 
          alt="logo"
        />
        <button id="logout-btn" >Logout</button>
      </nav>
    </div>
  );
}

export default Footer;