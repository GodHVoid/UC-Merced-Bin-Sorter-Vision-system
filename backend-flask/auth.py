import config
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from contextlib import closing
import sqlite3
import hashlib

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({})
        
        try:
            data = jwt.decode(token, config.secret_key, algorithms='HS256')
            with closing(sqlite3.connect(config.database)) as conn:
                with closing(conn.cursor()) as cursor:
                    current_user = cursor.execute(
                        'SELECT user_id FROM User WHERE user_id=?',
                        (data['user-id'])
                    )
        except:
            return jsonify({})
        
        return f(current_user, *args, **kwargs)
    return decorated

def gen_token(payload, key):
    time_expire = datetime.utcnow() + timedelta(hours=4)
    payload['exp'] = time_expire
    encoded_token = jwt.encode(payload, key, algorithm="HS256")
    return encoded_token

def hash_password(pwd):
    pwd += config.salt
    return hashlib.sha256(pwd.encode()).hexdigest()

def check_password(pwd, stored_pwd):
    pwd += config.salt
    return hash_password(pwd) == stored_pwd