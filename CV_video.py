import cv2
import numpy as np
import torch
import os 
import yolov5
# Playing video from file:
cap = cv2.VideoCapture('video1.mp4')
cap.set(cv2.CAP_PROP_FPS, 30)

currentFrame = 0;
count =0;
model = torch.hub.load( 'yolov5','custom', path='yolov5s.pt',source='local',force_reload=True,device= 'cpu' )
model.conf = 0.4
model.iou = 0.45
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = model(frame, size=640)
    frame = result.render()[0]
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    result.print()

    cv2.imshow('test', frame)
    
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#loads image in BGR rather RGB
