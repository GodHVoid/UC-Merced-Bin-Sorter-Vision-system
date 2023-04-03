import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import LiveSort from "./components/LiveSort";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/livesort" element={<LiveSort />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
