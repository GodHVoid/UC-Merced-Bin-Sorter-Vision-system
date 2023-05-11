import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function EvalModel() {
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [inventory, setInventory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const req = 'http://localhost:8080';

  useEffect(() => {
    fetch(req+"/api/data/system")
      .then((response) => response.json())
      .then((data) => {
        setConfidenceLevel(data.confidenceLevel);
        setInventory(data.data)
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
        {/* <div> */}
          {/* <h2>System Accuracy: {confidenceLevel}</h2> */}
        {/* </div> */}

        <div>
          <h2>Inventory</h2> <br /> <br/>
        {inventory && (
        <ul>
        {Object.entries(inventory).map(([key, value]) => (
          <li key={key}>
            <h2>{value[1]}: {"\t"+value[2]}</h2>
          </li>
        ))}
        </ul>
        )}
        </div>
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
