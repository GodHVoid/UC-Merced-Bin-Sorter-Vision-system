import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function EvalSorter(props) {
  const [inputValue, setInputValue] = useState("");
  const [agreePercentage, setAgreePercentage] = useState(0);
  const [disagreePercentage, setDisagreePercentage] = useState(0);
  const location = useLocation()

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
      <p>{location.state}</p>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Search</button>
      <div>
        <h2>Agree Percentage: {agreePercentage}</h2>
        <h2>Disagree Percentage: {disagreePercentage}</h2>
      </div>
    </div>
  );
}

export default EvalSorter;
