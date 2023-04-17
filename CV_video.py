import cv2
import numpy as np
import torch


# Playing video from file:
cap = cv2.VideoCapture('video1.mp4')
cap.set(cv2.CAP_PROP_FPS, 30)

currentFrame = 0;
count =0;
model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt',force_reload=True, )

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    result = model(frame, size= 640)
    #result.print()
    cv2.imshow('model', np.squeeze(result.render())) 
    
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#loads image in BGR rather RGB
