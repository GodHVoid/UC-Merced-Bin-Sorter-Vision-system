import React, { useState, useEffect } from "react";
//acutal code
function Database() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const request = "http://localhost:8080";

  useEffect(() => {
    fetch(request+"/api/data", {
      method: "GET"
    })
    .then(res => res.json())
    .then(response => console.log(response))
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
