import config
from camera import VideoCamera
from flask import Flask
from flask import request, jsonify, Response
from contextlib import closing
import hashlib
import sqlite3
from datetime import datetime 
import cv2

app = Flask(__name__)
app.config['SECRET_KEY'] = config.secret_key

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        id = request.json['username']
        password = request.json['password']

        # Get the user id, password, and role from database.
        with closing(sqlite3.connect(config.database)) as conn:
            with closing(conn.cursor()) as cursor:
                user_data = cursor.execute(
                    'SELECT Id, UserPassword, IsTrainer FROM Users WHERE Id=?', 
                    (id)
                )

        # If query returns empty list or password is incorrect, return fail.
        if len(user_data) < 1 or not check_password(password, user_data[0][1]):
            return jsonify({'status': 'failed',
                            'code': 401, 
                            'data': None, 
                            'message': 'invalid login.'})
        
        # Return successful login.
        return jsonify({'status': 'success', 
                        'code': 302, 
                        'data': {'is_trainer': user_data[0][2]}, 
                        'message': 'successful login.'})
        
    return jsonify({'status': 'success',
                    'code': 200,
                    'data': None, 
                    'message': None})

@app.route('/api/logout', methods=['GET'])
def logout():
    return jsonify({'status': 'success',
                    'code': 302,
                    'data': None, 
                    'message': 'successful logout.'})

def hash_password(pwd):
    pwd += config.salt
    return hashlib.sha256(pwd.encode()).hexdigest()

def check_password(pwd, stored_pwd):
    pwd += config.salt
    return hash_password(pwd) == stored_pwd

@app.route('/api/data', methods=['GET'])
def get_data():
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT TOP 100 * FROM BinSortData'
            )
    
    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': 'successfully retrieved last 100 data entries.'})

@app.route('/api/data', methods=['POST'])
def post_data():
    date = datetime.now()
    part_img = 0
    damages = []
    system_decision = 0
    sorter_decision = 0
    sorter_id = 0

    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                'INSERT INTO BinSortData (Date, PartImage, Damages, SystemSecision, SorterDecision, SorterId) VALUES (?, ?, ?, ?, ?, ?)', 
                (date, part_img, damages, system_decision, sorter_decision, sorter_id)
            )

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': None,
                    'message': 'successfully posted to database.'})

@app.route('/api/livefeed', methods=['GET'])
def livefeed():
    return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace;boundary=frame')

def gen(camera):
    while True:
        frame = camera.get_frame()
        # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

if __name__ == '__main__':
    app.run(debug=True, port=5000)