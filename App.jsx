import { useState } from "react";
import "./App.css";
import Login from "./Login.jsx";
import Footer from "./footer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Footer />
    </div>
  );
}

export default App;
