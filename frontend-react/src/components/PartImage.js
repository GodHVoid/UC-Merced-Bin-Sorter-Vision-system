import React, { useEffect, useState } from "react";
import "../styles/Popup.css";

function PartImage(props) {

  const [img, setImg] = useState("");
  const req = "http://localhost:8080";

  useEffect(() => {
    fetch(req+"/api/data/image?id="+props.img_id, {
      method: "GET",
    })
    .then(res => res.arrayBuffer())
    .then(response => {
      const blob = new Blob([response]);
      const img_url = URL.createObjectURL(blob);
      setImg(img_url);
    })
  }, [])


  return(
    <div className="PartImage">
      <div>
        <img
          src={img}
          alt="image"
          className="part-img"
        />
      </div>

      <div className="part-info">
        <h1>Image id:</h1>
        <h2>{props.img_id}</h2>
        <h1>Part Type:</h1>
        <h2>{props.type}</h2>
        <h1>Damages:</h1>
      </div>

    </div>
  );
}

export default PartImage;