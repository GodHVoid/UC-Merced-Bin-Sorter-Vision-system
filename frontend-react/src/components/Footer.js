import { useEffect, useState } from "react";
import decode from "../routes/Auth";
import LogoutButton from "./LogoutButton";
import Popup from "./Popup";

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
      <img 
        src={require("../assets/liberty-logo.jpg")} 
        alt="Logo"
        width="5%"
      />

      <h3>{text}</h3>

      <button onClick={(event) => setButtonTrigger(true)}>Instuctions</button>
      <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
        <h1>HELLOS</h1>
      </Popup>

      <LogoutButton />
    </footer>
  );
}

export default Footer;
