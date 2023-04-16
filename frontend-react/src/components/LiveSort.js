import React, { useState } from "react";
import SortFeed from "./SortFeed";

function LiveSort() {

  const [frame, setFrame] = useState("");

    fetch("/api/livefeed", {
      method: "GET", 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res=> res.json())
    .then(response => {
      setFrame(response);
    })

  return (
    <div className="LiveSort">
      <div className="livefeed">
        <img 
          src={frame}
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