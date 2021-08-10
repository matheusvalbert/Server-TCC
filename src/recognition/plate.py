import cv2
import base64
import json
import numpy as np
from openalpr import Alpr

country = 'br'
configFile = '/usr/local/share/openalpr/config/openalpr.defaults.conf'
runtimeDir = '/usr/local/share/openalpr/runtime_data'

alpr = Alpr(country, configFile, runtimeDir)

if not alpr.is_loaded():
    print('Error loading OpenALPR')

def base64decode(img):
    imgData = base64.b64decode(img)
    bufArr = np.frombuffer(imgData, dtype=np.uint8)
    image = cv2.imdecode(bufArr, cv2.IMREAD_UNCHANGED)
    return image

def recognize(plate):
    result = alpr.recognize_ndarray(plate)
    if len(result['results']) > 0:
        predicted = result['results'][0]['candidates']
        return predicted[0]['plate']
    else:
        return False

def postProcessing(predicted):
    predict = list(predicted)
    for i in range(7):
        if predict[i] == '0' and i <= 2:
            predict[i] = 'O'
        if predict[i] == 'O' and i > 2:
            predict[i] = '0'
        if predict[i] == '1' and i <= 2:
            predict[i] = 'I'
        if predict[i] == 'I' and i > 2:
            predict[i] = '1'
        if predict[i] == '8' and i <= 2:
            predict[i] = 'B'
        if predict[i] == 'B' and i > 2:
            predict[i] = '8'
        if predict[i] == '5' and i <= 2:
            predict[i] = 'S'
        if predict[i] == 'S' and i > 2:
            predict[i] = '5'
    return ''.join(predict)

while True:
    jsonFile = input()
    image = json.loads(jsonFile)
    plate = image['plate']
    plate = base64decode(plate)
    predicted = recognize(plate)
    if predicted == False:
        print('false')
    else:
        predicted = postProcessing(predicted)
        print(predicted)
