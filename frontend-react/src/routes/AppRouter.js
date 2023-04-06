import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../components/Home";
import Login from "../components/Login";
import LiveSort from "../components/LiveSort";

function AppRouter() {
  return (
    <div className="AppRouter">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/livesort" element={<LiveSort />} />
          <Route path="/trainer-dashboard" />
          <Route path="/data" />
          <Route path="/data/sorter" />
          <Route path="/data/system" />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter;