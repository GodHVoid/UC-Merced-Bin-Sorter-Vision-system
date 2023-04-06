import React from "react";

import Footer from "./Footer";

function LiveSort() {
  const request = "http://localhost:5000";

  return (
    <div className="LiveSort">
      <img 
        src={request + "/api/livefeed"}
        alt="Video"
      />
      <Footer />
    </div>
  );
}

export default LiveSort;