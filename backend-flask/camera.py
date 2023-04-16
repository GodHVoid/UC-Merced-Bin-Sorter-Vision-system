'''Camera class'''

import cv2
import numpy as np

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()

        # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # gray = 255-gray

        # # blur image
        # blur = cv2.GaussianBlur(gray, (19,19), 11)

        # # do adaptive threshold on gray image
        # thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 75, 2)
        # thresh = 255-thresh

        # # apply morphology
        # kernel = np.ones((27,27), np.uint8)
        # rect = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        # rect = cv2.morphologyEx(rect, cv2.MORPH_CLOSE, kernel)

        # # thin
        # kernel = np.ones((27,27), np.uint8)
        # rect = cv2.morphologyEx(rect, cv2.MORPH_ERODE, kernel)

        # #find edges
        # edges = cv2.Canny(rect,4,100)

        # # get largest contour
        # contours = cv2.findContours(rect, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        # contours = contours[0] if len(contours) == 2 else contours[1]
        # for c in contours:
        #     area_thresh = 0
        #     area = cv2.contourArea(c)
        #     if area > area_thresh:
        #         area = area_thresh
        #         big_contour = c

        # # get rotated rectangle from contour
        # rot_rect = cv2.minAreaRect(big_contour)
        # box = cv2.boxPoints(rot_rect)
        # box = np.int0(box)
        # for p in box:
        #     pt = (p[0],p[1])
        #     print(pt)

        # # draw rotated rectangle on copy of img
        # # rot_bbox = frame.copy()
        # cv2.drawContours(frame,[box],0,(0,0,255),2)

        # # write img with red rotated bounding box to disk
        # # cv2.imwrite("rectangle_thresh.png", thresh)
        # # cv2.imwrite("rectangle_outline.png", rect)
        # # cv2.imwrite("rectangle_bounds.png", rot_bbox)

        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
    
def gen(camera):
    # Generates response to send to javascript.
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')