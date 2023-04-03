import React from "react";

function LiveSort() {
  const request = "http://localhost:5000";

  return (
    <div className="LiveSort">
      <img 
        src={request + "/api/livefeed"}
        alt="Video"
      />
    </div>
  );
}

export default LiveSort;