import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../components/Login";
import LiveSort from "../components/LiveSort";
import Database from "../components/Database";
import TrainerDash from "../components/TrainerDash";

function AppRouter() {
  return (
    <div className="AppRouter">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/livesort" element={<LiveSort />} />
          <Route path="/trainer-dashboard" element={<TrainerDash />} />
          <Route path="/data" element={<Database />} />
          <Route path="/data/sorter" />
          <Route path="/data/system" />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter;