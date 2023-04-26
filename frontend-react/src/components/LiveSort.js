import React, { useState } from "react";
import SortFeed from "./SortFeed";

function LiveSort() {

  const req = "http://localhost:8080";

  return (
    <div className="LiveSort">
      <span className="livefeed">
        <img 
          src={req+"/api/livefeed"}
          alt="Video"
          height={500}
          width={900}
        />
      </span>

      <SortFeed />
    </div>
  );
}

export default LiveSort;