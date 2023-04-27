import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "../components/Login";
import LiveSort from "../components/LiveSort";
import Database from "../components/Database";
import TrainerDash from "../components/TrainerDash";
import PrivateRoutes from "./PrivateRoutes";
import EvalModel from "../components/EvalModel";
import EvalSorter from "../components/EvalSorter";

function AppRouter() {
  return (
    <div className="AppRouter">
      <Routes>

        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}

        <Route element={<PrivateRoutes />}>
          <Route path="/livesort" element={<LiveSort />} />
          <Route path="/trainer-dashboard" element={<TrainerDash />} />
          <Route path="/data" element={<Database />} />
          <Route path="/data/sorter-eval" element={<EvalSorter />} />
          <Route path="/data/model-eval" element={<EvalModel />} />
        </Route>

      </Routes>
    </div>
  )
}

export default AppRouter;