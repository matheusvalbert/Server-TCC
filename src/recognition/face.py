import face_recognition
import cv2
import os
import base64
import json
import numpy as np

knownEncodings = []
knownNames = []

def base64decode(img):
    imgData = base64.b64decode(img)
    bufArr = np.frombuffer(imgData, dtype=np.uint8)
    image = cv2.imdecode(bufArr, cv2.IMREAD_UNCHANGED)
    return image

def removeFace(file):
    try:
        deleteFace = file
        index = knownNames.index(deleteFace)
        knownEncodings.pop(index)
        knownNames.pop(index)
    except:
        pass

def addFace(file):
    img = cv2.imread('./src/img/' + file)
    try:
        img_enc = face_recognition.face_encodings(img)[0]
        knownEncodings.append(img_enc)
        knownNames.append(file)
    except:
        pass

for file in os.listdir('./src/img'):
    if not file.startswith('.'):
        try:
            img = cv2.imread('./src/img/' + file)
            img_enc = face_recognition.face_encodings(img)[0]
            knownEncodings.append(img_enc)
            knownNames.append(file)
        except:
            pass

while True:
    jsonFile = input()
    image = json.loads(jsonFile)
    face = image['face']
    newFace = image['new']
    deleteFace = image['delete']
    if face != 'false':
        if len(knownNames) > 0:
            face = base64decode(face)
            face = face[:, :, ::-1]
            name = 'false'

            faceLocations = face_recognition.face_locations(face)
            faceEncodings = face_recognition.face_encodings(face, faceLocations)

            for faceEncoding in faceEncodings:

                matches = face_recognition.compare_faces(knownEncodings, faceEncoding)

                faceDistances = face_recognition.face_distance(knownEncodings, faceEncoding)
                bestMatchIndex = np.argmin(faceDistances)
                if matches[bestMatchIndex]:
                    name = knownNames[bestMatchIndex]
            print(name)

    elif newFace != 'false':
        try:
            addFace(newFace)
        except:
            pass
    else:
        try:
            removeFace(deleteFace)
        except:
            pass
