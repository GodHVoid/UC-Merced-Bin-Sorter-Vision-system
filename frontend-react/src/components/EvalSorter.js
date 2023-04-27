import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Popup from "./Popup";
import PartImage from "./PartImage";
import "../styles/Eval.css";

function EvalSorter(props) {
  const [inputValue, setInputValue] = useState("");
  const location = useLocation()
  const [data, setData] = useState([]);
  const [buttonTrigger, setButtonTrigger] = useState("");
  const [ImgId, setImgId] = useState("");

  const req = 'http://localhost:8080';

  const setDecision = (input) => {
    return (input === "true") ? "Agree" : "Disagree";
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const id = parseInt(location.state);
    fetch(req+"/api/data/sorter?id="+id, {
      method: "GET", 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem["token"]
      }
    })
      .then((response) => response.json())
      .then((data) => setData(data))
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    fetch(`api/search?query=${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        setAgreePercentage(data.agreePercentage);
        setDisagreePercentage(data.disagreePercentage);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Link to={"/data"}>
        <button className="back-btn">Back</button> 
      </Link>

      <div className="eval-content">

        <div>
          <h1>Sorter details:</h1>
          <h2>id: {location.state}</h2>
          <h2>Full name: {data.message?.name}</h2>
          <h2>Trainer: {data.message?.trainer}</h2>
        </div>

        <div>
          <h1>Agreement with system: </h1>
          <h2>
            How many times this sorter has agreed with the system based 
            on their most recent entries (max 100):
          </h2>
          <h2>{data.message?.agreement} %</h2>
        </div>

      </div>
      
      <div className="entries">
        <table className="datatable">
          <thead>
            <tr>
              <th>Id</th>
              <th>Type</th>
              <th>Date</th>
              <th>Image</th>
              <th>Sorter Id</th>
              <th>System Decision</th>
              <th>Employee Decision</th>
            </tr>
          </thead>
          <tbody>
            {data.data?.map((item, i) => {
              return(
              <tr>
                <th >{item[0]}</th>
                <th >{item[1]}</th>
                <th >{item[2]}</th>
                <th key={i+1}>
                  <button onClick={(event) => {
                    setButtonTrigger(true)
                    setImgId(i+1);
                    }}>
                    View
                  </button>
                </th>
                <th >{item[3]}</th>
                <th >{setDecision(item[4])}</th>
                <th >{setDecision(item[5])}</th>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
        <PartImage img_id={ImgId} />
      </Popup>

    </div>
  );
}

export default EvalSorter;
