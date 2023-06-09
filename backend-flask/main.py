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


def insertBinaryToTable(conn,filename,empid):
    cur = conn.cursor()
    with open(filename, 'rb') as file:
        blob = file.read()
        #print(blob)
    sql = """INSERT INTO Images (image_blob, emp_id, sys_verdict, emp_verdict)
            VALUES (?,?,?,?);"""
    args = [blob, empid,'Good','Good']
    cur.execute(sql,args)
    conn.commit()
    

def outputImage(conn, imgID):
    cur = conn.cursor()
    sql = """SELECT * FROM Images WHERE image_id = ?"""
    cur.execute(sql,(imgID,))
    res = cur.fetchone()[2]  # stores the third element returned(BLOB number)
    #print(res)
    path = 'images/test{0}.png'.format(imgID) # Location where the image will be returned to
    with open(path, 'wb') as file:
        file.write(res)
        file.close()


def main():
    database = r'Bin_Sort_db.db'
    conn = openConnection(database)
    empid=0
    #---- Trying New Method to store/retrieve images ------------
    for images in os.listdir(path):
        if (images.endswith(".PNG")):
            if empid < 5:
                empid = empid + 1
            insertBinaryToTable(conn,path + images, empid)
            print('image added')
    
    #outputImage(conn,5)

    closeConnection(conn, database)



if __name__ == '__main__':
    main()
    #app.run(debug=True)