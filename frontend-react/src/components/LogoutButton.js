import React from "react";

function LogoutButton() {

  const req = "http://localhost:8080";

  const handleLogout = () => {
    fetch(req+"/logout", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(localStorage.removeItem("token"))
  };

  return(
    <div className="LogoutButton">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}