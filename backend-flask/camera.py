'''Camera class'''

import cv2
import torch


# model = torch.hub.load('custom', 
                    #    path='best.pt',
                    #    source='local',
                    #    force_reload=True, 
                    #    device= 'cpu' )


class VideoCamera(object):
    def __init__(self):
        path = './sides09.mp4'
        self.video = cv2.VideoCapture(path)
        self.video.set(cv2.CAP_PROP_FPS, 30)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()
        # result = model(frame, size=640)
        # frame = result.render()[0]

        if ret:
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