'''Camera class'''

import yolov5, torch
from yolov5.utils.general import check_img_size, non_max_suppression, check_imshow, xyxy2xywh, increment_path
from yolov5.utils.torch_utils import select_device, time_sync
from yolov5.utils.plots import Annotator, colors
from deep_sort.utils.parser import get_config
from deep_sort.deep_sort import DeepSort
from deep_sort.deep_sort.deep.feature_extractor import Extractor
from deep_sort.deep_sort.sort.nn_matching import NearestNeighborDistanceMetric as nn_matching
from deep_sort.deep_sort.sort.preprocessing import non_max_suppression
from deep_sort.deep_sort.sort.detection import Detection
from deep_sort.deep_sort.sort.tracker import Tracker
import cv2
from PIL import Image as im
import yaml
import random

#parts
part='Tops'
#damages
corner = 0
edge = 0
logo=0
cleat_d=0
#vertict
decision = True
#model
model = torch.hub.load( 'yolov5','custom', path='best.pt',source='local',force_reload=True,device= 'cpu' )
model.conf = 0.4
model.iou = 0.45

cfg = get_config()
cfg.merge_from_file('./deep_sort/configs/deep_sort.yaml')
names = model.module.names if hasattr(model, 'module') else model.names

deepsort =  DeepSort('./deep_sort/deep_sort/deep/checkpoint/ckpt.t7',
                        max_dist=cfg.DEEPSORT.MAX_DIST, min_confidence=cfg.DEEPSORT.MIN_CONFIDENCE, 
                        nms_max_overlap=cfg.DEEPSORT.NMS_MAX_OVERLAP, max_iou_distance=cfg.DEEPSORT.MAX_IOU_DISTANCE, 
                        max_age=cfg.DEEPSORT.MAX_AGE, n_init=cfg.DEEPSORT.N_INIT, nn_budget=cfg.DEEPSORT.NN_BUDGET, use_cuda=False)

def get_detection_info():
    damages = {'Corner_damage': corner,
                'Edge_damage': edge,
                'Logo_repair':logo, 
                'Cleat_damage':cleat_d,
                }
        
    info = {'part':part,
            'damages': damages,
            'decision': decision}
        
    return info

class VideoCamera(object):
    def __init__(self):
        path = './imgs/sides09.mp4'
        self.cur_frame = None
        self.video = cv2.VideoCapture(path)
        self.video.set(cv2.CAP_PROP_FPS, 10)
        self.id = 1
        self.button_pressed = False

    def __del__(self):
        self.video.release()

    def set_frame(self, f):
        self.cur_frame = None
        self.cur_frame = f

    def get_frame(self):
        ret, frame = self.video.read()


        if ret:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = model(frame, augment=True)
            annotator = Annotator(frame, line_width=2, pil=not ascii) 
            det = results.pred[0]

            if self.button_pressed:
                self.id +=1
                self.button_pressed = False

            for i, det in enumerate((results.pred)):
                if det is not None and len(det):   
                    xywhs = xyxy2xywh(det[:, 0:4])
                    confs = det[:, 4]
                    clss = det[:, 5]
                    outputs = deepsort.update(xywhs.cpu(), confs.cpu(), clss.cpu(), frame)
                    #t3 = time_synchronized()
                    if len(outputs) > 0:
                        for j, (output, conf) in enumerate(zip(outputs, confs)):

                            bboxes = output[0:4]
                            cls = output[5]

                            c = int(cls)  # integer class
                            label = f'{self.id} {names[c]} {conf:.2f}'
                            annotator.box_label(bboxes, label, color=colors(c, True))
                    
                else:
                   self.id +=1

            frame = annotator.result()    
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            '''
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = model(frame, size=640)
            frame = results.render()[0]
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            '''

            ret, frame = cv2.imencode('.png', frame)
            return frame.tobytes()
        return None

def gen(camera):
    # Generates response to send to javascript.
    while True:
        frame = camera.get_frame()
        camera.set_frame(frame)
        if frame is None:
            continue
        yield (b'--frame\r\n' b'Content-Type: image/png\r\n\r\n' + frame + b'\r\n\r\n')