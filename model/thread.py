from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import numpy as np
import cv2
from threading import Thread
import base64

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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

def record():
    global video,isrecording
    video=cv2.VideoCapture(0)
    video.set(3, frameWidth)
    video.set(4, frameHeight)
    video.set(100, 150)
    while isrecording==1:
        success, img = video.read() 
        if (success):
            print(img.shape)
        else:
            pass

@app.route('/getbase',methods = ['GET'])
@cross_origin()
def getbase():
    img = cv2.imread('temp.jpg')
    _, encoded_image = cv2.imencode('.jpg', img)
    encoded_string = base64.b64encode(encoded_image).decode('utf-8')
    return jsonify({
        "photo":encoded_string
    })

@app.route('/startendrecord',methods = ['GET'])
@cross_origin()
def startendrecord():
    global video,isrecording,thread
    if isrecording==1:
        isrecording=0
        video.release()
        cv2.destroyAllWindows()
        # send stored photos
        result={
            "message":"recording stopped",
            "photos":ans_list
        }
        thread.join()
        return result
        print("stop record called")
    else:
        isrecording=1
        thread = Thread(target = record)
        thread.start()
        result={
            "message":"recording started",
            "photos":ans_list
        }
        return result
        

if __name__ == '__main__':
   app.run(debug = True,port=5001)
