import React, { useState } from "react";
import SortFeed from "./SortFeed";

function LiveSort() {

  const req = "http://localhost:8080";

  return (
    <div className="LiveSort">
      <div className="livefeed">
        <img 
          src={req+"/api/livefeed"}
          alt="Video"
        />
      </div>

      {/* <SortFeed /> */}
    </div>
  );
}

export default LiveSort;