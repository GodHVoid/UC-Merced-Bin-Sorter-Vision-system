import React, { useState, useEffect, Fragment } from "react";
function DataTable() {
  const [data, setData] = useState([]);
  const [searchWorker, setSearchWorker] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  //get data to populate table, change address
  const fetchData = () => {
    fetch("/api")
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
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchWorker}
          onChange={(e) => setSearchWorker(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Part ID</th>
            <th scope="col">Part Name</th>
            <th scope="col">Part Image</th>
            <th scope="col">Part Damages</th>
            <th scope="col">system Verdict</th>
            <th scope="col">Woker Verdict</th>
          </tr>
        </thead>
        <tbody>
          {data.map((part) => (
            <tr key={part.id}>
              <th scope="row">{part.id}</th>
              <td>{part.name}</td>
              <td>
                <a href={part.imageLink} target="_blank" rel="noreferrer">
                  <img src={part.imageLink} alt={part.name} />
                </a>
              </td>
              <td>
                <ul>
                  {part.damages.map((damage) => (
                    <li key={damage}>{damage}</li>
                  ))}
                </ul>
              </td>
              <td>{part.systemVerdict}</td>
              <td>{part.workerVerdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
}
export default DataTable;
