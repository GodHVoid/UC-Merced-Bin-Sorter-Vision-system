import { useState } from "react";
import decode from "../routes/Auth";
import LogoutButton from "./LogoutButton";
import Popup from "./Popup";
import Instructions from "./Instructions";
import "../styles/Footer.css"

function Footer() {

  const [buttonTrigger, setButtonTrigger] = useState("");
  var text = "";

  if (window.localStorage.getItem("token")) {
    const data = decode(window.localStorage.getItem("token"));
    text = "User: " + data["user-id"]
  } else {
    text = "";
  }

  return(
    <footer className="Footer">

      <div>
        <h1 className="title">Livesort</h1> 
        <h3 className="User">{text}</h3>
      </div>
      
      <div>
        <button className="Footer-btns" onClick={(event) => setButtonTrigger(true)}>Instuctions</button>
        <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
          <Instructions />
        </Popup>
      </div>

      <div>
        <LogoutButton />
      </div>

    </footer>
  );
}

export default Footer;
