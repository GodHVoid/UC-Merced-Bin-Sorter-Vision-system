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
                'SELECT image_id, part_type, date, emp_id, sys_verdict, emp_verdict FROM Images'
            ).fetchall()
    
    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': 'successfully retrieved data entries.'})

@app.route('/api/data', methods=['POST'])
@token_required
def post_data():
    auth = request.get_json()

    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                'INSERT INTO Images part_type, image_blob, emp_id, sys_verdict, emp_verdict VALUES (?, ?, ?, ?, ?,)', 
                (auth[''], auth[''], auth[''], auth[''], auth[''],)
            )

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': None,
                    'message': 'successfully posted to database.'})

@app.route('/api/data/image', methods=['GET'])
def get_image_data():
    image_id = request.args.get('id')
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT image_blob FROM Images Where image_id=?',
                (image_id,)
            ).fetchall()

    # img = base64.b64encode(data[0][0]).decode()

    return data[0][0]

    # return jsonify({'status': 'success',
    #                 'code': 200,
    #                 'data': img,
    #                 'message': 'successfully retrieved data entries.'})

@app.route('/api/data/<int:id>', methods=['GET'])
@token_required
def get_sorter_data(id):
    with closing(sqlite3.connect(config.database)) as conn:
        with closing(conn.cursor()) as cursor:
            data = cursor.execute(
                'SELECT TOP 100 * FROM Images WHERE emp_id=?',
                (id)
            )

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': data,
                    'message': f'successfully retrieved last 100 entries for {id}'})

@app.route('/api/detection', methods=['GET'])
def get_detection_data():

    test_data = {"part": "tops", 
                 "img": None, 
                 "id": 208, 
                 "decision": "destroy", 
                 "errors": {"Corner_damage": 2,
                            "Edge_damage": 0, 
                            "Logo_repair": 1,
                            "Cleat_damage": 2,
                            "Cleat_repair": 0}}

    return jsonify({'status': 'success',
                    'code': 200,
                    'data': test_data,
                    'message': f'successfully retrieved last 100 entries for {id}'})

@app.route('/api/data/system', methods=['GET'])
@token_required
def get_system_data():
    '''Get model's metrics. Ask Renato'''
    pass

@app.route('/api/livefeed', methods=['GET'])
@cross_origin()
# @token_required
def livefeed():
    return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace;boundary=frame')


if __name__ == '__main__':
    app.run(debug=True, port=8080)