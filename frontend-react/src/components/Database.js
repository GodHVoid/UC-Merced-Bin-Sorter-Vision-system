import React, { useState, useEffect } from "react";

function Database() {
  const req = "http://localhost:8080";

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(req+"/api/data", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
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
