import React, { useState } from "react";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    fetch("/api", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Handle response here
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
