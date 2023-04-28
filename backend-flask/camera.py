'''Camera class'''

import cv2
import torch


model = torch.hub.load( 'yolov5','custom', path='best.pt',source='local',force_reload=True,device= 'cpu' )
model.conf = 0.4
model.iou = 0.45

class VideoCamera(object):
    def __init__(self):
        path = './imgs/sides08.mp4'
        self.video = cv2.VideoCapture(path)
        self.video.set(cv2.CAP_PROP_FPS, 60)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()


        if ret:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = model(frame, size=640)
            frame = result.render()[0]
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            result.print()
            ret, frame = cv2.imencode('.png', frame)
            return frame.tobytes()
        return None

def gen(camera):
    # Generates response to send to javascript.
    while True:
        frame = camera.get_frame()
        if frame is None:
            continue
        yield (b'--frame\r\n' b'Content-Type: image/png\r\n\r\n' + frame + b'\r\n\r\n')