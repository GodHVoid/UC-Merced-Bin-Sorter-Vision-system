import cv2
import numpy as np
import torch
import os 
import yolov5
# Playing video from file:
cap = cv2.VideoCapture('video1.mp4')
cap.set(cv2.CAP_PROP_FPS, 15)

currentFrame = 0;
count =0;
model = torch.hub.load('yolov5', 'custom', path='yolov5s.pt',source='local',force_reload=True,device= 'cpu' )
#model = yolov5.load('best.pt')
#model = torch.hub.load('yolov5','yolov5s')
model.conf = 0.4
model.iou = 0.45
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    result = model(frame, size=640)
    frame = result.render()[0]
    
    result.print()
    #result.show()
    #cv2.imshow('model', result.render()[0]) 
    cv2.imshow('test', frame)
    
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#loads image in BGR rather RGB
