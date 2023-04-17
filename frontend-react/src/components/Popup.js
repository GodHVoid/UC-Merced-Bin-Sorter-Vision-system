import React from "react";

function Popup(props) {
  return props.trigger ? (
    <div className="Popup">
      <div className="Popup=inner">
        <button>Close</button>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default Popup;
