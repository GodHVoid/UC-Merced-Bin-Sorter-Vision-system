import React, { Fragment, useState, useEffect } from "react";

function SortFeed() {
  const [partName, setPartName] = useState("");
  const [systemVerdict, setSystemVerdict] = useState("");
  const [partID, setPartID] = useState("");
  const [systemErrors, setSystemErrors] = useState([]);
  const [verdictSubmitted, setVerdictSubmitted] = useState(false);

  //get part sorted information
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setPartName(data.partName);
        setSystemVerdict(data.systemVerdict);
        setPartID(data.partID);
        setSystemErrors(data.systemErrors);
      });
  }, []);

  //sends userverdict
  const handleUserverdict = (event, userVerdict) => {
    event.preventDefault();
    fetch("/api/userverdict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userVerdict }),
    })
      .then((response) => response.json())
      .then((data) => {
        //confirm submission
        setVerdictSubmitted(true);
      })
      .catch((error) => {
        console.error("Error sending user verdict to server:", error);
      });
  };

  return (
    //line 45-54 for sort information
    //line 56-67 for userverdict submission and confirmation
    <Fragment>
      <div className="systemVer">
        <h2>{partName}</h2>
        <h2>{systemVerdict}</h2>
        <h2>{partID}</h2>
        <ul>
          {systemErrors.map((error) => (
            <li>{error}</li>
          ))}
        </ul>
      </div>
      <div className="feedbackButton">
        <button class="btn btn-dark" onClick={() => handleUserverdict("agree")}>
          Agree
        </button>
        <button
          class="btn btn-dark"
          onClick={() => handleUserverdict("disagree")}
        >
          Disagree
        </button>
      </div>
      {verdictSubmitted && <h3>Feedback Submitted!</h3>}
    </Fragment>
  );
}

export default SortFeed;
/*
{
  "partName": "topcover", --<h2>
  "img": "", -- <img>
  "ID", --<h2>
  "decision": "agree", <h2></h2>
  "errors": [
    "Error 1",
    "Error 2",
    "Error 3"
  ] -- <ul>
}*/
