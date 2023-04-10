import React, { useState, useEffect } from "react";
function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Time</th>
          <th>Image</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.time}</td>
            <td>
              <img src={row.img} alt="Image" />
            </td>
            <td>{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default History;
