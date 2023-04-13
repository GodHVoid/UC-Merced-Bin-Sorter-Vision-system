import config
from camera import VideoCamera, gen
from flask import Flask
from flask import request, jsonify, Response
from flask_cors import CORS, cross_origin
from contextlib import closing
import hashlib
import sqlite3
from sqlite3 import Error
from datetime import date
#from datetime import datetime 
import os
from os import listdir
#path to images for testing
#path = 'C:\Users\15598\OneDrive\Documents\UCM\Spring23\CSE120\Team_Project\UC-Merced-Bin-Sorter-Vision-system\backend-flask\images'
path = 'images/'

app = Flask(__name__)
app.config['SECRET_KEY'] = config.secret_key
cors = CORS(app)

def openConnection(_dbFile):
    try:
        conn = sqlite3.connect(_dbFile)
        print("Success opening database.")
    except Error as e:
        print(e)
    return conn

def closeConnection(_conn, _dbFile):
    print("Close Database: ", _dbFile)
    try:
        _conn.close()
        print("Success!")
    except Error as e:
        print(e)


def convertToBinary(filename):
    with open(filename, 'rb') as file:
        binarydata = file.read()
        binarydata = binarydata.decode('utf-16','ignore')
    return binarydata

def convertBinaryToFile(binarydata, filename):
    with open(filename, 'wb') as file:
        file.write(binarydata)

def insertToTable(conn, imgFile):
    cur = conn.cursor()
    sql = """INSERT INTO Images (image_blob,defects,sys_verdict,emp_verdict,emp_id)
    VALUES  (?,?,?,?,?);
    """
    args = [imgFile,1,'Good','Bad',1]
    cur.execute(sql,args)
    conn.commit()
    print("success inserting image")

def convertBack(conn,idNum):
    return 'work in progress'


def main():
    database = r'database.db'
    conn = openConnection(database)
    for images in os.listdir(path):
        if(images.endswith(".jpg")):
            print(path+images)
            newBlob = convertToBinary(path+images)
            insertToTable(conn, newBlob)
            print("image uploaded")
    imgid = 6
    convertBack(conn, 6)

    closeConnection(conn, database)



if __name__ == '__main__':
    main()
    #app.run(debug=True)