import React from "react";
import "../styles/Popup.css"

function Popup(props) {
  return props.trigger ? (
    <div className="Popup">
      <div className="Popup-inner">
        
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          Close
        </button>
        
        {props.children}
      
      </div>
    </div>
  ) : null;
}

export default Popup;
