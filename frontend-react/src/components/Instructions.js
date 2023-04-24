import React from "react";

function Instructions() {
  return (
    <div className="Instructions">
      <div className="LoginInstructions">
        Login: <br />
        Log in using your username (first initial and last name) and your password.
      </div>
      <br />
      <div className="LiveSortInstructions">
        LiveSort: <br />
        The stationary camera will detect the bin parts and determine whether it is 
        usable or to be destroyed. It will list the damages on the right side of the 
        screen and an image of the bin part on the left. <br />
        When an image is displayed, the sorter will then make their decision on whether 
        the part should be usable (green button) or destroyed (red button).
      </div>
    </div>
  );
}

export default Instructions;
