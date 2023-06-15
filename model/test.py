from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import speech_recognition as sr
from os import path
from threading import Thread
import cv2
import numpy as np

# img1 = cv2.imread('test1.jpeg')
# img2 = cv2.imread('test2.jpeg')
# img1 = cv2.resize(img1,(1280,720))
# img2 = cv2.resize(img2,(1280,720))



# def preProcessing(image):
#     imgGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Gray image
#     imgBlur = cv2.GaussianBlur(imgGray, (1, 1), 1)  # Blur Image
#     imgCanny = cv2.Canny(imgBlur, 100, 300)  # Canny Image
#     kernel = np.ones((5, 5))
#     imgDilate = cv2.dilate(imgCanny, kernel, iterations=2)
#     imgErode = cv2.erode(imgDilate, kernel, iterations=1)
#     return imgErode

# frameWidth = 1280
# frameHeight = 720
# def getContours(img):
#     image = preProcessing(img)
#     biggest = np.array([])
#     maxArea = 0
#     contours, hierarchy = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
#     for cnt in contours:
#         area = cv2.contourArea(cnt)  # Calculates area of each shape detected
#         if area > 5000:
#             peri = cv2.arcLength(cnt, True)  # arcLength -> perimeter of the closed shape
#             cornerPoints = cv2.approxPolyDP(cnt, 0.01*peri, True)
#             if area > maxArea and len(cornerPoints) == 4:
#                 biggest = cornerPoints
#                 maxArea = area
#     return biggest

# def getWarp(image):
#     coord_points = getContours(image)
#     x1,y1,x2,y2,x3,y3,x4,y4 = coord_points[0][0][0],coord_points[0][0][1],coord_points[1][0][0],coord_points[1][0][1],coord_points[2][0][0],coord_points[2][0][1],coord_points[3][0][0],coord_points[3][0][1]
#     print(x1,y1)
#     print(x2,y2)
#     print(x3,y3)
#     print(x4,y4)
#     print("")
#     x1,y1,x2,y2,x3,y3,x4,y4 = correct(x1,y1,x2,y2,x3,y3,x4,y4)
#     print(x1,y1)
#     print(x2,y2)
#     print(x3,y3)
#     print(x4,y4)
#     print("")
#     pts1 = np.float32([(x1,y1), (x4,y4), (x2,y2), (x3,y3)])
#     pts2 = np.float32([[0, 0], [frameWidth, 0], [0, frameHeight], [frameWidth, frameHeight]])
#     matrix = cv2.getPerspectiveTransform(pts1, pts2)
#     image = cv2.warpPerspective(image, matrix, (frameWidth, frameHeight))
#     return image

# res1 = getWarp(img1)
# res2 = getWarp(img2)

# cv2.imshow('image',res1)

# cv2.waitKey(0)
# # closing all open windows
# cv2.destroyAllWindows()


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/gettrans',methods = ['POST'])
@cross_origin()
def gettrans():
    return ""

if __name__ == '__main__':
   app.run(debug = True,port=5001)
   