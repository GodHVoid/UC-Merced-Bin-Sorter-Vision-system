import React from "react";
import "../styles/Popup.css";

function Instructions() {
  return (
    <div className="Instructions">
      <div className="LoginInstructions">
        <h1>
          Login: 
        </h1>
        <h2>
          Log in using your username (first initial and last name) and your password.
        </h2>
      </div>
      <br />
      <div className="LiveSortInstructions">
        <h1>
          LiveSort: 
        </h1>
        <h2>
        The stationary camera will detect the bin parts and determine whether it is 
        usable or to be destroyed. It will list the damages on the right side of the 
        screen and an image of the bin part on the left. <br />
        When an image is displayed, the sorter will then make their decision on whether 
        the part should be usable (green button) or destroyed (red button).          
        </h2>
      </div>
    </div>
  );
}

export default Instructions;
