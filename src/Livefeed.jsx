import { Fragment, useRef, useEffect } from "react";
import Sortfeed from "./Sortfeed";

function Livefeed() {
  const videoRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  }, []);
  return (
    <Fragment>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <video
            ref={videoRef}
            style={{ height: "36vh", width: "64vh", borderRadius: "5px" }}
            autoPlay
          />
        </div>
        <Sortfeed />
      </div>
    </Fragment>
  );
}
export default Livefeed;
