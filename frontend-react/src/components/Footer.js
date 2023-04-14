// import React from "react";

// function Footer() {
//   return (
//     <footer className="Footer">
//       <nav>
//         <img 
//           id="liberty-logo" src={require("../assets/liberty-logo.jpg")} 
//           alt="logo"
//         />
//         <button id="logout-btn" >Logout</button>
//       </nav>
//     </footer>
//   );
// }

// export default Footer;
import React, { useState } from "react";
import LiveSort from "./LiveSort";
import Database from "./Database";

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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="d-flex align-items-center">
          <img id="liberty-logo" src={"../assets/liberty-logo.jpg"} alt="logo" />
        </div>
        <button className="btn btn-dark" onClick={handleLivefeedClick}>
          Livefeed
        </button>
        <button className="btn btn-dark" onClick={handleHistoryClick}>
          sort History
        </button>
        <button className="btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      {showLivefeed ? <LiveSort /> : <Database />}
    </div>
  );
}

export default Footer;