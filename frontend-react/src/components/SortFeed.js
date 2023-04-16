import React, { useState } from "react";

function SortFeed() {
  const [feedback, setFeedback] = useState("");

  function sendFeedback(feedbackType) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      setFeedback(xhttp.responseText);
    };
    xhttp.onerror = function () {
      console.error("Error sending feedback");
    };
    xhttp.open("POST", "/feedback");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({ feedback: feedbackType }));
  }

  return (
    <div className="feedbackButton">
      <p>{feedback}</p>
      <button className="btn btn-dark" onClick={() => sendFeedback("agree")}>
        Agree
      </button>
      <button className="btn btn-dark" onClick={() => sendFeedback("disagree")}>
        Disagree
      </button>
    </div>
  );
}

export default SortFeed;