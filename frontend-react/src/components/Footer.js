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
    text = data["user-id"]
  } else {
    text = "";
  }

  return(
    <footer className="Footer">
      <h1>Livesort</h1>

      <h3>{text}</h3>

      <button onClick={(event) => setButtonTrigger(true)}>Instuctions</button>
      <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
        <Instructions />
      </Popup>

      <LogoutButton />
    </footer>
  );
}

export default Footer;
