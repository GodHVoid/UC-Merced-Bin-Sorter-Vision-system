import cv2
import numpy as np
import torch
from roboflow import Roboflow

rf = Roboflow(api_key="BrNUqD8TsBHLUOV9OLz7")
project = rf.workspace("bin-detection").project("assembly-llgww")
dataset = project.version(4)

# Playing video from file:
cap = cv2.VideoCapture('video1.mp4')
cap.set(cv2.CAP_PROP_FPS, 30)


#model = torch.hub.load('ultralytics/yolov5', 'custom',path='./model', force_reload=True)
#model.conf = 0.4
model = project.version(dataset.version).model
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
   
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
    cv2.imshow('model', frame)
    
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#loads image in BGR rather RGB
