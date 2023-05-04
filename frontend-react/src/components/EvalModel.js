import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function EvalModel() {
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [verdictDifference, setVerdictDifference] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch("api")
      .then((response) => response.json())
      .then((data) => {
        setConfidenceLevel(data.confidenceLevel);
        setVerdictDifference(data.verdictDifference);
      });
  }, []);

  const handleFileInput = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile === null) {
      alert("No file!")
    }
  }

  return (
    <div>

      <div className="toolbar">
        <Link to={"/data"}>
          <button className="back-btn">Back</button> 
        </Link>
        <h2>Model Evaluation</h2>
      </div>

      <div className="model-content">
        <h2>System Confidence Level: {confidenceLevel}</h2>
        <h2>System Verdict Difference: {verdictDifference}</h2>
      </div>

      <div className="file-upload">
        <h2>Upload new model weights: </h2> 
        <br />
        <input className="upload"  onChange={handleFileInput} type="file" />
        <br />
        <button onClick={handleUpload}>Upload</button>
      </div>

    </div>
  );
}

export default EvalModel;
