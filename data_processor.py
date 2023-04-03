import cv2
import numpy as np
import os

# Playing video from file:
cap = cv2.VideoCapture('021.MP4')
length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(length)
try:
    if not os.path.exists('data'):
        os.makedirs('data')
except OSError:
    print ('Error: Creating directory of data')

currentFrame = 0
count =0;
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if length >= count and count % 150  == 0:
        # To stop duplicate images
        #if count % 10 == 0:
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, frame)

        img_90 = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_90)

        img_180 = cv2.rotate(frame, cv2.ROTATE_180)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_180)

        img_270 = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_270)
        
        kernel = np.ones((5,5), np.uint8)

        img_erosion = cv2.erode(frame, kernel, iterations = 1)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_erosion)

        img_dilation = cv2.dilate(frame, kernel, iterations = 1)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_dilation)

        img_opening = cv2.morphologyEx(frame, cv2.MORPH_OPEN, kernel)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_opening)

        img_closing = cv2.morphologyEx(frame, cv2.MORPH_CLOSE, kernel)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_closing)

        img_gradient = cv2.morphologyEx(frame, cv2.MORPH_GRADIENT, kernel)
        currentFrame +=1
        name = './data/frame' + str(currentFrame) + '.png'
        print ('Creating...' + name)
        cv2.imwrite(name, img_gradient)

        currentFrame +=1

    count += 1
    if cv2.waitKey(1) == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()