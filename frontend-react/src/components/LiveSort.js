import React from "react";

function LiveSort() {
  const request = "http://localhost:8080";

  return (
    <div className="LiveSort">
      <div className="livefeed">
        <img 
          src={request + "/api/livefeed"}
          alt="Video"
        />
      </div>

      <div className="sort-errors">
        <p>hello</p>
      </div>

      <div className="sort-btns">
        <button>Agree</button>
        <button>Disagree</button>
      </div>
    </div>
  );
}

export default LiveSort;