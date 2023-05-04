import yolov5, torch
from yolov5.utils.general import (check_img_size, non_max_suppression, 
                                  check_imshow, xyxy2xywh, increment_path)
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
part = ''
#damage
        
corner = 1
edge = 1
logo= 1
cleat_d= 1
#vertict
decision = False
# Playing video from file:
cap = cv2.VideoCapture('D:\DATA_CV\Multi-class_Yolov5_DeepSort_Pytorch-master\Multi-class_Yolov5_DeepSort_Pytorch-master\sides-nonmetaldamage01.MP4')
cap.set(cv2.CAP_PROP_FPS, 30)

currentFrame = 0;
count =0;
model = torch.hub.load( 'yolov5','custom', path='best_2.pt',source='local',force_reload=True,device= 'cpu' )

device = select_device('cpu') # 0 for gpu, '' for cpu
# initialize deepsort
cfg = get_config()
cfg.merge_from_file('deep_sort/configs/deep_sort.yaml')
deepsort = DeepSort('deep_sort/deep_sort/deep/checkpoint/ckpt.t7',
                        max_dist=cfg.DEEPSORT.MAX_DIST, min_confidence=cfg.DEEPSORT.MIN_CONFIDENCE, 
                        nms_max_overlap=cfg.DEEPSORT.NMS_MAX_OVERLAP, max_iou_distance=cfg.DEEPSORT.MAX_IOU_DISTANCE, 
                        max_age=cfg.DEEPSORT.MAX_AGE, n_init=cfg.DEEPSORT.N_INIT, nn_budget=cfg.DEEPSORT.NN_BUDGET, use_cuda=True)
# Get names and colors
names = model.names if hasattr(model, 'module') else model.names
model.iou = 0.45
print('names',names)
id =1
fps = 0;

palette = (2 ** 11 - 1, 2 ** 15 - 1, 2 ** 20 - 1) 

def bbox_rel(image_width, image_height,  *xyxy):
    """" Calculates the relative bounding box from absolute pixel values. """
    bbox_left = min([xyxy[0].item(), xyxy[2].item()])
    bbox_top = min([xyxy[1].item(), xyxy[3].item()])
    bbox_w = abs(xyxy[0].item() - xyxy[2].item())
    bbox_h = abs(xyxy[1].item() - xyxy[3].item())
    x_c = (bbox_left + bbox_w / 2)
    y_c = (bbox_top + bbox_h / 2)
    w = bbox_w
    h = bbox_h
    return x_c, y_c, w, h

def compute_color_for_labels(label):
    """
    Simple function that adds fixed color depending on the class
    """
    color = [int((p * (label ** 2 - label + 1)) % 255) for p in palette]
    return tuple(color)

def draw_boxes(img, bbox, cls_names, scores, identities=None, offset=(0,0)):
    for i, box in enumerate(bbox):
        x1, y1, x2, y2 = [int(i) for i in box]
        x1 += offset[0]
        x2 += offset[0]
        y1 += offset[1]
        y2 += offset[1]
        # box text and bar
        id = int(identities[i]) if identities is not None else 0    
        color = compute_color_for_labels(id)
        label = '%s %d' % (cls_names[i], scores[i])
        label += '%'
        t_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_PLAIN, 2 , 2)[0]
        cv2.rectangle(img, (x1, y1),(x2,y2), color, 3)
        cv2.rectangle(img, (x1, y1), (x1 + t_size[0] + 3, y1 + t_size[1] + 4), color, -1)
        cv2.putText(img, label, (x1, y1 + t_size[1] + 4), cv2.FONT_HERSHEY_PLAIN, 2, [255, 255, 255], 2)

damages = {'Corner_damage': corner,
                'Edge_damage': edge,
                'Logo_repair':logo, 
                'Cleat_damage':cleat_d,
                }

def get_detection_info():
    damages = {'Corner_damage': corner,
                'Edge_damage': edge,
                'Logo_repair':logo, 
                'Cleat_damage':cleat_d,
                }
        
    info = {'part':part,
            'damages': damages,
            'decision': decision}
    restart()
    return info

def restart():
    part = ''
    corner = 0
    edge = 0 
    logo = 0
    cleat_d = 0
    decision = False


def update(class_obj):
    if len(class_obj) > 1:
        decision = False
    else:
        decision = True
    print('decision:', decision)
    for i in range(len(class_obj)):
        if class_obj[i]>=4:
            part = names[class_obj[i]]
            print('part:', part)
        if names[class_obj[i]]== 'Corner_damage':
            corner =+ 1
        elif names[class_obj[i]] == 'Edge_damage':
            edge =+ 1
        elif names[class_obj[i]] == 'Logo_repair':
            logo =+ 1
        elif names[class_obj[i]] == 'Cleat_damage':
            cleat_d =+ 1
    stuff = get_detection_info()
    print(stuff)




while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if ret:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        if(fps % 30 == 0):
            results = model(frame, augment=True)

        for i, det in enumerate((results.pred)):
            if det is not None and len(det):
                for c in det[:, -1].unique():
                     n = (det[:, -1] == c).sum()  # detections per class   
                bbox_xywh = []
                confs = []
                clses = []
                for *xyxy, conf, cls in det:
                    
                    img_h, img_w, _ = frame.shape  # get image shape
                    
                    x_c, y_c, bbox_w, bbox_h = bbox_rel(img_w, img_h, *xyxy)
                    obj = [x_c, y_c, bbox_w, bbox_h]
                    bbox_xywh.append(obj)
                    confs.append([conf.item()])
                    clses.append([cls.item()])
                    
                xywhs = torch.Tensor(bbox_xywh)
                #print('box', xywhs)
                confss = torch.Tensor(confs)
                clss = torch.Tensor(clses)
                #update(clses)
                    #button_pressed = False
    
                #print('clss',clses)
                #print('tensor', len(clses))
                #print('conf', confss)
                outputs = deepsort.update(xywhs, confss ,clss, frame)
                if len(outputs) > 0:
                    bbox_tlwh = []
                    bbox_xyxy = outputs[:, :4]
                    identities = outputs[:, 4]
                    #print('identities:', identities)
                    clses = outputs[:, 5]
                    #print('class:', clses )
                    update(clses)
                    #print('part:',part)
                    #print('Corner:', corner)
                    scores = outputs[:, 6]
                    stays = outputs[:, 7]
                    #update()
                    draw_boxes(frame, bbox_xyxy, [names[i] for i in clses], scores, identities)
                
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        cv2.imshow('test', frame)
        fps +=1

    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
#loads image in BGR rather RGB
