import React, { useState, useEffect, Fragment } from "react";
import Popup from "./Popup";
import PartImage from "./PartImage";
function Database() {
  const [data, setData] = useState([]);
  const [searchWorker, setSearchWorker] = useState([]);
  const [buttonTrigger, setButtonTrigger] = useState("");
  const [ImgId, setImgId] = useState("");

  const req = 'http://localhost:8080';

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
      .then((data) => { console.log(data)
        setData(data)});
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
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchWorker}
          onChange={(e) => setSearchWorker(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table className="table table-hover">
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
              <th >{item[4]}</th>
              <th >{item[5]}</th>
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