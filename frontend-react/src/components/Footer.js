import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import Popup from "./Popup";

function Footer() {

  const [buttonTrigger, setButtonTrigger] = useState("");

  return(
    <footer className="Footer">
      <img 
        src={require("../assets/liberty-logo.jpg")} 
        alt="Logo"
        width="5%"
      />

      <button onClick={(event) => setButtonTrigger(true)}>Instuctions</button>

      <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
        <h1>HELLOS</h1>
      </Popup>

      <LogoutButton />
    </footer>
  );
}

export default Footer;
