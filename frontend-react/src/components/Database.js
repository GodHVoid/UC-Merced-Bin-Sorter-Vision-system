import React, { useState, useEffect, Fragment } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Popup from "./Popup";
import PartImage from "./PartImage";
import "../styles/Database.css"

function Database() {
  const [data, setData] = useState([]);
  const [searchWorker, setSearchWorker] = useState([]);
  const [buttonTrigger, setButtonTrigger] = useState("");
  const [ImgId, setImgId] = useState("");
  const [Type, setType] = useState("");
  const navigate = useNavigate();

  const req = 'http://localhost:8080';

  const setDecision = (input) => {
    return (input === 1) ? "Usable" : "Destroy";
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
      navigate("./sorter-eval", {state: searchWorker});
    } else {
      fetchData();
    }
  };

  return (
    <Fragment>
      <div className="toolbar">
        <Link to={"/trainer-dashboard"}>
          <button>Back</button>
        </Link>
        <h2>Database</h2>
        <input
          type="text"
          placeholder="Search by ID"
          value={searchWorker}
          onChange={(e) => setSearchWorker(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <Link to={"./model-eval"}>
          <button className="model-btn">Model</button>
        </Link>
      </div>

      <div className="table-div">
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
                    setImgId(item[0]);
                    setType(item[1]);
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
      </div>

      <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
        <PartImage img_id={ImgId} type={Type} />
      </Popup>
      
    </Fragment>
  );
}
export default Database;