import React from "react";
import { useState, useEffect } from "react";

function EvalModel() {
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [verdictDifference, setVerdictDifference] = useState("");

  useEffect(() => {
    fetch("api")
      .then((response) => response.json())
      .then((data) => {
        setConfidenceLevel(data.confidenceLevel);
        setVerdictDifference(data.verdictDifference);
      });
  }, []);

  return (
    <div>
      <h2>System Confidence Level: {confidenceLevel}</h2>
      <h2>System Verdict Difference: {verdictDifference}</h2>
    </div>
  );
}

export default EvalModel;
