import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function LogoutButton() {

  const req = "http://localhost:8080";
  const pathname = useLocation()["pathname"];

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
      <Navigate to="/" />
    })
  };

  return(
    <div className="LogoutButton">
      <button>
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
