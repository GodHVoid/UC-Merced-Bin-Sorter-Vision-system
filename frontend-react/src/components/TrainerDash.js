import React from "react";
import { Link } from "react-router-dom";
import "../styles/TrainerDash.css";

function TrainerDash() {
  return(
    <div className="TrainerDash">

      <div className="info-block">
        <h1>Select where you would like to go: </h1>
        <h2>
          Livesort: Will redirect to the livesorting page.
        </h2>
        <h2>
          Database: Will redirect to the database page to see recent entries from 
          the database and evaluations.
        </h2>
      </div>

      <div className="nav-btns">
        <Link to={"/livesort"}>
          <button className="dash-btns">Livesort</button>
        </Link>

        <Link to={"/data"}>
          <button className="dash-btns">Database</button>
        </Link>
      </div>

    </div>
  );
}

export default TrainerDash;