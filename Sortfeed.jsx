import React, { useState, useEffect } from "react";

function Sortfeed() {
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmiteStatus] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const [userId, setUserId] = useState("");
  useEffect(() => {
    fetch("/user")
      .then((response) => response.json())
      .then((data) => setUserId(data.user_id));
  }, []);

  //handle input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle options
  const handleButtonClick = (event) => {
    const { id } = event.target;
    setSelectedOption(id);
    const requestOption = {
      method: "POST",
      header: { "content-Type": "application/json" },
      body: JSON.stringify({ ...formData, option: id, userId }),
    };
    fetch("/submit_data", requestOption)
      .then((response) => response.json())
      .then((data) => setSubmiteStatus(data.message));
  };
  return (
    <div nameSpace="Corrections">
      <label>
        Note:
        <input
          class="form-control"
          type="text"
          name="note"
          onChange={handleInputChange}
        />
      </label>
      <div>
        <button class="btn btn-dark" onClick={() => handleButtonClick("reuse")}>
          Reuse
        </button>
        <button
          class="btn btn-dark"
          onClick={() => handleButtonClick("discard")}
        >
          Discard
        </button>
        <button
          class="btn btn-dark"
          onClick={() => handleButtonClick("salvage")}
        >
          Salvage
        </button>
      </div>

      {submitStatus && <p>{submitStatus}</p>}
      <p>Selected option: {selectedOption}</p>
    </div>
  );
}

export default Sortfeed;
