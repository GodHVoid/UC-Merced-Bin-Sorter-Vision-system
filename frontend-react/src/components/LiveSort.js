import React from "react";
import SortFeed from "./SortFeed";

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

      <SortFeed />
    </div>
  );
}

export default LiveSort;