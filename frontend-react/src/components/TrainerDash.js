import React from "react";
import { Link } from "react-router-dom";

function TrainerDash() {
  return(
    <div className="TrainerDash">
      <Link to={"/livesort"}>
        <button>LiveSort</button>
      </Link>

      <Link to={"/data"}>
        <button>Database</button>
      </Link>
    </div>
  );
}

export default TrainerDash;