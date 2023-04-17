'''Camera class'''

import cv2
from roboflow import Roboflow
import os

rf = Roboflow(api_key="BrNUqD8TsBHLUOV9OLz7")
project = rf.workspace("bin-detection").project("assembly-llgww")
dataset = project.version(4)

model = project.version(dataset.version).model

class VideoCamera(object):
    def __init__(self):
        # path = os.path.abspath('./images/sides12.MP4')
        self.video = cv2.VideoCapture(0)
        self.video.set(cv2.CAP_PROP_FPS, 30)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()

        predictions = model.predict(frame, confidence=40, overlap=30)
        predictions_json = predictions.json()
        # printing all detection results from the image
        print(predictions_json)

        # accessing individual predicted boxes on each image
        for bounding_box in predictions:
            x0 = bounding_box['x'] - bounding_box['width'] / 2#start_column
            x1 = bounding_box['x'] + bounding_box['width'] / 2#end_column
            y0 = bounding_box['y'] - bounding_box['height'] / 2#start row
            y1 = bounding_box['y'] + bounding_box['height'] / 2#end_row
            start_point = (int(x0), int(y0))
            end_point = (int(x1), int(y1))
            cv2.rectangle(frame, start_point, end_point, color=(0,255,0), thickness=3)
    
            cv2.putText(
                frame,
                bounding_box["class"],
                (int(x0), int(y0) - 10),
                fontFace = cv2.FONT_HERSHEY_SIMPLEX,
                fontScale = 0.6,
                color = (255, 255, 255),
                thickness=2
            )

        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
    
def gen(camera):
    # Generates response to send to javascript.
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')