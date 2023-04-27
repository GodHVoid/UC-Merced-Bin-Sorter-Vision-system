import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "./Popup";
import PartImage from "./PartImage";
import "../styles/Database.css"

function Database() {
  const [data, setData] = useState([]);
  const [searchWorker, setSearchWorker] = useState([]);
  const [buttonTrigger, setButtonTrigger] = useState("");
  const [ImgId, setImgId] = useState("");

  const req = 'http://localhost:8080';

  const setDecision = (input) => {
    return (input === "true") ? "Agree" : "Disagree";
  }

  useEffect(() => {
    fetchData();
  }, []);

  //get data to populate table, change address
  const fetchData = () => {
    fetch(req+"/api/data", {
      method: "GET", 
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem["token"]
      }
    })
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  //search by worker
  const handleSearch = () => {
    if (searchWorker !== "") {
      fetch("/api?search=${searchWorker}")
        .then((response) => response.json())
        .then((data) => setData(data));
    } else {
      fetchData();
    }
  };

  return (
    <Fragment>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchWorker}
          onChange={(e) => setSearchWorker(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <Link to={"/model-eval"}>
          <button className="model-btn">Model</button>          
        </Link>
      </div>

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
              <th >
                <Link to={"./sorter-eval"} state={item[3]}>
                  {item[3]}
                </Link>
              </th>
              <th >{setDecision(item[4])}</th>
              <th >{setDecision(item[5])}</th>
            </tr>
            )
          })}
        </tbody>
      </table>

      <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
        <PartImage img_id={ImgId} />
      </Popup>
      
    </Fragment>
  );
}
export default Database;