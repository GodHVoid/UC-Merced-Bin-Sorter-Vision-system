'''Camera class'''

import cv2
import numpy as np
import torch

model = torch.hub.load('ultralytics/yolov5', 'yolov5s')


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.video.set(cv2.CAP_PROP_FPS, 2)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()
        result = model(frame,size=640)
        image = np.squeeze(result.render())
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()
    
def gen(camera):
    # Generates response to send to javascript.
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')