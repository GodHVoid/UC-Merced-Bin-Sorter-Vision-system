import React, { useState, useEffect } from "react";
//acutal code
function Database() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status === 200) {
        setData(JSON.parse(this.responseText));
      }
    };
    xhttp.open("GET", "/api/data", true);
    xhttp.send();
  }, []);
  const filteredData = data.filter((row) =>
    row.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Data</th>
            <th>Image</th>
            <th>Errors</th>
            <th>System Verdict</th>
            <th>Worker Verdict</th>
            <th>Worker ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                <img
                  src={row.img}
                  alt="Image"
                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                  onClick={() => window.open(row.img, "_blank")}
                />
              </td>
              <td>{row.errors}</td>
              <td>{row.systemVerdict}</td>
              <td>{row.workerVerdict}</td>
              <td>{row.workerID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Database;

//local testing
/*function Database() {
  const [data, setData] = useState([
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1588771209601-b7b56efaf78b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      errors: "None",
      systemVerdict: "Passed",
      workerVerdict: "Rejected",
      workerID: "123",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1588771209601-b7b56efaf78b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      errors: "Missing data",
      systemVerdict: "Failed",
      workerVerdict: "Rejected",
      workerID: "456",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1588771209601-b7b56efaf78b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      errors: "Incorrect data",
      systemVerdict: "Failed",
      workerVerdict: "Approved",
      workerID: "789",
    },
  ]);
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Data</th>
          <th>Image</th>
          <th>Errors</th>
          <th>System Verdict</th>
          <th>Worker Verdict</th>
          <th>Worker ID</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>
              <a href={morningStarLogo} target="_blank">
                <img
                  src={morningStarLogo}
                  alt="Morning Star Logo"
                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                />
              </a>
            </td>
            <td>{row.errors}</td>
            <td>{row.systemVerdict}</td>
            <td>{row.workerVerdict}</td>
            <td>{row.workerID}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default Database;
*/