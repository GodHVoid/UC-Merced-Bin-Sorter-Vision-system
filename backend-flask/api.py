import config
from auth import token_required, gen_token, check_password
from camera import VideoCamera, gen
from flask import Flask
from flask import request, jsonify, Response
from flask_cors import CORS, cross_origin
from contextlib import closing
import sqlite3
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = config.secret_key
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

vc = VideoCamera()

@app.route('/api/login', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def login():
    auth = request.get_json()

    # Get the user id, password, and role from database.
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            user_data = cursor.execute(
                'SELECT username, password, is_trainer FROM Users WHERE username=?', 
                (auth['user-id'],)
            ).fetchall()

    # If query returns empty list or password is incorrect, return fail.
    if not user_data or not check_password(auth['user-password'], user_data[0][1]):
        return jsonify({'status': 'failed',
                        'code': 401, 
                        'data': None, 
                        'message': 'invalid login.'})
    
    token = gen_token({'user-id': auth['user-id'],
                       'is-trainer': user_data[0][2]}, config.secret_key)

    # Return successful login.
    return jsonify({'status': 'success', 
                    'code': 302, 
                    'data': {'token': token}, 
                    'message': 'successful login.'})

@app.route('/api/logout', methods=['GET'])
@token_required
def logout():
    config.token_blacklist.append(request.headers['x-access-token'])
    return jsonify({'status': 'success',
                    'code': 302,
                    'data': None, 
                    'message': 'successful logout.'})

@app.route('/api/data', methods=['GET'])
# @token_required
def get_data():
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT image_id, part_type, date, emp_id, sys_verdict, emp_verdict FROM Images \
                    ORDER BY image_id DESC LIMIT 100'
            ).fetchall()
    
    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': 'successfully retrieved data entries.'})

@app.route('/api/data', methods=['POST'])
# @token_required
def post_data():
    auth = request.get_json()
    damages = auth['damages']

    frame = vc.cur_frame
    vc.button_pressed = True

    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            id = cursor.execute(
                'SELECT user_id FROM Users WHERE username=?',
                (auth["emp-id"],)
            ).fetchall()
            c = cursor.execute(
                'INSERT INTO Images (part_type, image_blob, emp_id, sys_verdict, emp_verdict) \
                    VALUES (?, ?, ?, ?, ?)', 
                (auth['part'], frame, id[0][0], auth['sys'], auth['emp'])
            )
            cursor.execute(
                'INSERT INTO Damages (p_image_id, Corner_damage, Edge_damage, Logo_repair) \
                    VALUES (?,?,?,?)',
                (c.lastrowid, 
                 int(damages["Corner_damage"]), 
                 int(damages["Edge_damage"]), 
                 int(damages["Logo_repair"])
                )
            )
        conn.commit()

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': None,
                    'message': 'successfully posted to database.'})

@app.route('/api/data/image', methods=['GET'])
def get_image_data():
    image_id = request.args.get('id')
    print(image_id)
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT image_blob FROM Images Where image_id=?',
                (image_id,)
            ).fetchall()

    return data[0][0]

@app.route('/api/data/sorter', methods=['GET'])
def get_sorter_data():
    sorter_id = request.args.get('id')
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT image_id, part_type, date, emp_id, sys_verdict, emp_verdict FROM Images WHERE emp_id=? \
                    ORDER BY image_id DESC LIMIT 100',
                (sorter_id)
            ).fetchall()

            sorter = cursor.execute(
                'SELECT firstname, lastname, is_trainer FROM Users WHERE user_id=?',
                (sorter_id)
            ).fetchall()

    agree = 0
    for entry in data:
        if entry[4] == entry[5]:
            agree += 1

    agree_percentage = (agree/len(data)) * 100 

    t = "False"
    if sorter[0][2]: 
        t = "True"
    
    sorter_info = {"name": sorter[0][0]+' '+sorter[0][1], 
                   "trainer": t,
                   "agreement": '%.2f' % agree_percentage}

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': sorter_info})

@app.route('/api/detection', methods=['GET'])
def get_detection_data():

    data = vc.get_detection_info()
    # print('d', data)
    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': f'successfully retrieved last 100 entries for {id}'})

@app.route('/api/data/system', methods=['GET'])
# @token_required
def get_system_data():
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT * FROM Inventory'
            ).fetchall()

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': f'successfully retrieved inventory'})

@app.route('/api/livefeed', methods=['GET'])
@cross_origin()
# @token_required
def livefeed():
    return Response(gen(vc), mimetype='multipart/x-mixed-replace;boundary=frame')


if __name__ == '__main__':
    app.run(debug=True, port=8080)