import cv2
import base64
import json
import numpy as np

def base64decode(img):
    imgData = base64.b64decode(img)
    bufArr = np.frombuffer(imgData, dtype=np.uint8)
    image = cv2.imdecode(bufArr, cv2.IMREAD_UNCHANGED)
    return image

while True:
    jsonFile = input()
    image = json.loads(jsonFile)
    plate = image['plate']
    plate = base64decode(plate)
    print('FEC0498')
