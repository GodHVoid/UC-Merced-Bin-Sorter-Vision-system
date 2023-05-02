import React, { useState, useEffect } from "react";
import decode from "../routes/Auth"; 

function SortFeed() {

  const req = "http://localhost:8080";

  const [partName, setPartName] = useState("");
  const [systemVerdict, setSystemVerdict] = useState("");
  const [displaySystemVerdict, setDisplaySystemVerdict] = useState("");
  const [systemErrors, setSystemErrors] = useState([]);
  const [submitMsg, setSubmitMsg] = useState("Sorter input:");

  var decoded = decode(window.localStorage.getItem("token"));

  //get part sorted information from Renato to dislpay
  useEffect(() => {
    fetch(req+"/api/detection", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        setPartName(data.data.part);
        setSystemVerdict(data.data.decision)
        setDisplaySystemVerdict((data.data.decision == 0) ? "Destroyed" : "Usable");
        (data.data.decision == 0) ? document.body.style.background = "rgb(220, 0, 20, 1)" : 
                                    document.body.style.background = "rgb(0, 220, 20, 1)";
        setSystemErrors(data.data.damages);
        
      })
      .catch((error) => {
        console.error("Error fetching data from server:", error);
      });
  }, []);

  //sends userverdict
  const handleUserverdict = (event, userVerdict) => {
    // event.preventDefault();
    fetch(req+"/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "part": partName, "emp-id": decoded["user-id"],
                             "sys": systemVerdict, "emp": userVerdict,
                             "damages": systemErrors}),
    })
      .then((response) => response.json())
      .then((data) => {
        //confirm submission
        setSubmitMsg("Successful input!")
        setTimeout(() => {
          setSubmitMsg("Sorter input:")
        }, 3000);
      })
      .catch((error) => {
        console.error("Error sending user verdict to server:", error);
      });
  };

  return (
    //line 45-54 for sort information
    //line 56-67 for userverdict submission and confirmation
    <div className="SortFeed">
      <div className="systemVerdict">
        <h2><u>Model Decision:</u> {displaySystemVerdict}</h2> <br />
        <h2><u>Part identified:</u> {partName}</h2> <br /> <br />
        <h2><u>Detected damages:</u></h2> 

        {systemErrors && (
        <ul>
        {Object.entries(systemErrors).map(([key, value]) => (
          <li key={key}>
            {key}: {"\t"+value}
          </li>
        ))}
        </ul>
        )}

      </div>
      <br />
      <div className="feedbackButton">
        <h2>{submitMsg}</h2>
        <button className="g-btn" onClick={(event) => handleUserverdict(event, true)}>
          Good
        </button>
        <br />
        <button className="b-btn" onClick={(event) => handleUserverdict(event, false)}>
          Bad
        </button>
      </div>
    </div>
  );
}

export default SortFeed;
