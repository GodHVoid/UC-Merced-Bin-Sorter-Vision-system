import React from "react";

function LogoutButton() {

  const req = "http://localhost:8080";

  if (!window.localStorage.getItem("token")) {
    return null;
  }

  const handleLogout = () => {
    fetch(req+"/api/logout", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then( response => {
      localStorage.removeItem("token");
      window.location.href = "/";
    })
  };

  return(
    <div className="LogoutButton">
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
