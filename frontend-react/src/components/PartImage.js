import React, { useEffect, useState } from "react";

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
      <img
        src={img}
        alt="image"
        width={500}
      />
    </div>
  );
}

export default PartImage;