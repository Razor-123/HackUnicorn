from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import speech_recognition as sr
from os import path
import os
import json
import requests
import cv2
import numpy as np
import math
import base64
from threading import Thread

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# video = cv2.VideoCapture(0)  # WebCam

global main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4,isrecording,my_cnt,main_img,decreasing,counter,frameHeight,frameWidth,valid_frame_cnt,ans_list
ans_list=[]
frameWidth = 1280
frameHeight = 720
main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4 = -1,-1,-1,-1,-1,-1,-1,-1
valid_frame_cnt = 0
counter = 0
isrecording=0
main_img = np.ones((720, 1280), dtype = np.uint8)*255
my_cnt=0
decreasing = 0 # if content is getting erased

def correct(x1,y1,x2,y2,x3,y3,x4,y4):
    my_list = [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
    new_list = sorted(my_list , key=lambda k: [k[1], k[0]])
    new_x1,new_y1,new_x2,new_y2,new_x3,new_y3,new_x4,new_y4 = x1,y1,x2,y2,x3,y3,x4,y4
    if (new_list[0][0]<=new_list[1][0]):
        new_x1,new_y1 = new_list[0][0],new_list[0][1]
        new_x4,new_y4 = new_list[1][0],new_list[1][1]
    else:
        new_x4,new_y4 = new_list[0][0],new_list[0][1]
        new_x1,new_y1 = new_list[1][0],new_list[1][1]
        
    if (new_list[2][0] <= new_list[3][0]):
        new_x2,new_y2 = new_list[2][0],new_list[2][1]
        new_x3,new_y3 = new_list[3][0],new_list[3][1]
    else:
        new_x3,new_y3 = new_list[2][0],new_list[2][1]
        new_x2,new_y2 = new_list[3][0],new_list[3][1]
    return new_x1,new_y1,new_x2,new_y2,new_x3,new_y3,new_x4,new_y4

def consider(img,last_img):
    #print("root path ",app.root_path) #C:\my work\manthan\at_2\model
    global main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4,isrecording,my_cnt,main_img,decreasing,counter,ans_list
    ret,image = cv2.threshold(img,70,255,0)
    cnt = 0
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            if image[i][j]==0:
                cnt+=1
    diff = cnt - my_cnt
    if abs(diff)>2:
        if (diff<0):
            # erasing process
            print("erasing process")
            if decreasing==0:
                # save image
                decreasing=1
                print("saving image")
                #cv2.imwrite(str(counter)+'.jpeg',main_img)
                _, encoded_image = cv2.imencode('.jpg', main_img)
                encoded_string = base64.b64encode(encoded_image).decode('utf-8')
                ans_list.append(encoded_string)
                #print(base64.b64encode(main_img))
            else:
                # image already saved
                pass
            # update main image
            main_img = img
            my_cnt = cnt
        else:
            # data added
            print("data added")
            if decreasing==1:
                decreasing=0
            #update main image
            main_img = img
            my_cnt = cnt
            if (last_img):
                #cv2.imwrite(str(counter)+'.jpeg',main_img)
                _, encoded_image = cv2.imencode('.jpg', main_img)
                encoded_string = base64.b64encode(encoded_image).decode('utf-8')
                ans_list.append(encoded_string)
                #print(base64.b64encode(main_img))
                counter+=1

def preProcessing(image):
    imgGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Gray image
    imgBlur = cv2.GaussianBlur(imgGray, (1, 1), 1)  # Blur Image
    imgCanny = cv2.Canny(imgBlur, 100, 300)  # Canny Image
    kernel = np.ones((5, 5))
    imgDilate = cv2.dilate(imgCanny, kernel, iterations=2)
    imgErode = cv2.erode(imgDilate, kernel, iterations=1)

    return imgErode

def getContours(img):
    biggest = np.array([])
    maxArea = 0
    contours, hierarchy = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    '''
       RETR_EXTERNAL -> store the first external edge
       CHAIN_APPROX_NONE -> store all the boundary points
    '''
    for cnt in contours:
        area = cv2.contourArea(cnt)  # Calculates area of each shape detected
        if area > 5000:
            peri = cv2.arcLength(cnt, True)  # arcLength -> perimeter of the closed shape
            cornerPoints = cv2.approxPolyDP(cnt, 0.01*peri, True)
            if area > maxArea and len(cornerPoints) == 4:
                biggest = cornerPoints
                maxArea = area

    return biggest

def getWarp(image):
    global main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4,isrecording,my_cnt,main_img,decreasing,counter
    x1,y1,x2,y2,x3,y3,x4,y4 = correct(main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4)
    pts1 = np.float32([(x1,y1), (x4,y4), (x2,y2), (x3,y3)])
    pts2 = np.float32([[0, 0], [frameWidth, 0], [0, frameHeight], [frameWidth, frameHeight]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    image = cv2.warpPerspective(image, matrix, (frameWidth, frameHeight))
    return image

def normalize_kernel(kernel, k_width, k_height, scaling_factor = 1.0):
    '''Zero-summing normalize kernel'''
    K_EPS = 1.0e-12
    pos_range, neg_range = 0, 0
    pos_scale, neg_scale = pos_range, -neg_range
    if abs(pos_range) >= K_EPS:
        pos_scale = pos_range
    else:
        pos_sacle = 1.0
    if abs(neg_range) >= K_EPS:
        neg_scale = 1.0
    else:
        neg_scale = -neg_range
        
    pos_scale = scaling_factor / pos_scale
    neg_scale = scaling_factor / neg_scale
    for i in range(k_width * k_height):
        if (not np.nan == kernel[i]):
            kernel[i] *= pos_scale if kernel[i] >= 0 else neg_scale
            
    return kernel

def dog(img, k_size, sigma_1, sigma_2):
    '''Difference of Gaussian by subtracting kernel 1 and kernel 2 '''
    k_width = k_height = k_size
    x = y = (k_width - 1) // 2
    kernel = np.zeros(k_width * k_height)
    if sigma_1 > 0:
        co_1 = 1 / (2 * sigma_1 * sigma_1)
        co_2 = 1 / (2 * np.pi * sigma_1 * sigma_1)
        i = 0
        for v in range(-y, y + 1):
            for u in range(-x, x + 1):
                kernel[i] = np.exp(-(u*u + v*v) * co_1) * co_2
                i += 1
    else:
        kernel[x + y * k_width] = 1.0
    if sigma_2 > 0:
        co_1 = 1 / (2 * sigma_2 * sigma_2)
        co_2 = 1 / (2 * np.pi * sigma_2 * sigma_2)
        i = 0
        for v in range(-y, y + 1):
            for u in range(-x, x + 1):
                kernel[i] -= np.exp(-(u*u + v*v) * co_1) * co_2
                i += 1
    else:
        kernel[x + y * k_width] -= 1.0
    norm_kernel = normalize_kernel(kernel, k_width, k_height, scaling_factor = 1.0)
    return cv2.filter2D(img, -1, norm_kernel.reshape(k_width, k_height))

def negate(img):
    '''Negative of image'''
    return cv2.bitwise_not(img)

def customContrast(img):
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    (thresh, contrast_stretch_img) = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | 8)
    #print(contrast_stretch_img.shape)
    return contrast_stretch_img

def enhanceImage(img):
    dog_k_size, dog_sigma_1, dog_sigma_2 = 15, 100, 0
    cs_black_per, cs_white_per = 2, 99.5
    gauss_k_size, gauss_sigma = 3, 1
    gamma_value = 1.1
    cb_black_per, cb_white_per = 2, 1
    dog_img = dog(img, dog_k_size, dog_sigma_1, dog_sigma_2)
    negative_img = negate(dog_img)
    contrast_img = customContrast(negative_img)
    # contrast_stretch_img = contrast_stretch(negative_img, cs_black_per, cs_white_per)
    # blur_img = fast_gaussian_blur(contrast_stretch_img, gauss_k_size, gauss_sigma)
    # gamma_img = gamma(blur_img, gamma_value)
    # color_balanced_img = color_balance(gamma_img, cb_black_per, cb_white_per)
    return contrast_img

# def myformat(x1,y1,x2,y2,x3,y3,x4,y4):
#     return x1,y1,x2,y2,x3,y3,x4,y4

def record():
    global main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4,isrecording,my_cnt,main_img,decreasing,counter,frameHeight,frameWidth,video,valid_frame_cnt,ans_list,video,isrecording,result
    video=cv2.VideoCapture(1)
    video.set(3, frameWidth)
    video.set(4, frameHeight)
    video.set(100, 150)
    image = np.zeros([1280,720])
    while isrecording==1:
        # print("hello")
        success, img = video.read()
        if not success:
            result = {
                "photos":[],
                "error":"error recording video"
            }
            break
        imgContour = img.copy()
        imgPreprocessed = preProcessing(imgContour)
        coord_points = getContours(imgPreprocessed)
        if len(coord_points)==0:#print("Object intervention ")
            pass
        else:
            x1,y1,x2,y2,x3,y3,x4,y4 = coord_points[0][0][0],coord_points[0][0][1],coord_points[1][0][0],coord_points[1][0][1],coord_points[2][0][0],coord_points[2][0][1],coord_points[3][0][0],coord_points[3][0][1]
            if main_x1==-1:
                main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4 = x1,y1,x2,y2,x3,y3,x4,y4
                print( "main coordinates = ")
                print(main_x1,main_y1)
                print(main_x2,main_y2)
                print(main_x3,main_y3)
                print(main_x4,main_y4)
            
            dist1,dist2,dist3,dist4 = math.dist([main_x1,main_y1],[x1,y1]),math.dist([main_x2,main_y2],[x2,y2]),math.dist([main_x3,main_y3],[x3,y3]),math.dist([main_x4,main_y4],[x4,y4])
            total_dist = dist1+dist2+dist3+dist4
            if (total_dist<500.0):# valid image -> check valid_frame_count  ->wrap over main coordinates -> enhance -> consider for evaluation
                valid_frame_cnt += 1
                if valid_frame_cnt%30==0:
                    print("considering image")
                    imgWrap = getWarp(img)
                    image = enhanceImage(imgWrap)
                    consider(image,0)
            else:
                print("invalid detection")
                pass# not valid
        #cv2.imshow('video',img)
    consider(image,1)
    result={
        "message":"",
        "photos":ans_list
    }

@app.route('/startendrecord',methods = ['GET'])
@cross_origin()
def startendrecord():
    global main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4,isrecording,my_cnt,main_img,decreasing,counter,frameHeight,frameWidth,video,valid_frame_cnt,ans_list,thread,result
    if isrecording==1:
        isrecording=0
        video.release()
        cv2.destroyAllWindows()
        thread.join()
        main_x1,main_y1,main_x2,main_y2,main_x3,main_y3,main_x4,main_y4 = -1,-1,-1,-1,-1,-1,-1,-1
        valid_frame_cnt = 0
        counter = 0
        isrecording=0
        main_img = np.ones((720, 1280), dtype = np.uint8)*255
        my_cnt=0
        decreasing = 0 # if content is getting erased
        # send stored photos
        result={
            "message":"recording stopped",
            "photos":ans_list
        }
        ans_list=[]
        print("stop record called")
    else:
        isrecording=1
        thread = Thread(target = record)
        thread.start()
        result={
            "message":"recording started",
            "photos":ans_list
        }

    return jsonify(result)

@app.route('/endrecord',methods = ['GET'])
@cross_origin()
def endrecord():
    isrecording=0
    result = {
        "message":"ending recording"
    }
    return jsonify(result)

@app.route('/getframes',methods = ['GET'])
@cross_origin()
def getfames():
    result = {
        "message":"getting frames"
    }
    return jsonify(result)

if __name__ == '__main__':
   app.run(debug = True,port=5001)