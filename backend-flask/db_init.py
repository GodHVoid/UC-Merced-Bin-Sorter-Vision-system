'''Initialises database by executing all lines in schema.sql'''

from auth import hash_password
import sqlite3
from sqlite3 import Error
import random

def dummy_data(cur):
    part_name = ['Plains', 'Metals', 'Tops', 'Bases']
    decisions = ['false', 'true']
    for i in range(1,51):
        with open('./imgs/'+str((i%10))+'.png', 'rb') as f:
            img = f.read()

        cur.execute(
            'INSERT INTO Images (part_type, image_blob, emp_id, sys_verdict, emp_verdict) \
                VALUES (?,?,?,?,?)',
            (random.choice(part_name), img, random.randint(1,6), random.choice(decisions), random.choice(decisions))
        )
    print('Successfully inserted images into Images table.')

    return 'Successfully pushed all dummy data.'


if __name__ == '__main__':
    db = r"database.db" # Will connect to database or create one if not already created.
    conn = None

    try:
        with open('schema.sql', 'r') as sql_schema:
            sql_commands = sql_schema.read()
        conn = sqlite3.connect(db)

        print("Connected to database.\n")

        cur = conn.cursor()
        cur.executescript(sql_commands) # Allows for multiple commands to be executed
        conn.commit()
        print('Tables created')

        users = [
            ('Tony', 'Doan', 'tdoan', '123Doan', 0),
            ('Renato', 'Millan', 'rmillan', '123Millan', 0),
            ('Lucas', 'Ortiz-Gonzales', 'lortizgonzales', '123Ortizgonzales', 0),
            ('Rui', 'Pan', 'rpan', '123Pan', 0),
            ('Justus', 'Sasse', 'jsasse', '123Justus', 1),
            ('Bruce', 'Bates', 'bbates', '123Bruce', 1)
        ]
    
        for user in users:
            cur.execute(
                'INSERT INTO Users (firstname, lastname, username, password, is_trainer) \
                    VALUES (?, ?, ?, ?, ?)',
                (user[0], user[1], user[2], hash_password(user[3]), user[4],)
            )
        print('Successfully inserted users into Users table.')

        inventory = [('Plains', 0), ('Tops', 0), ('Metals', 0), ('Bases', 0)]
        for i in inventory:
            cur.execute(
            'INSERT INTO Inventory (part_type, count) VALUES (?,?)',
            (i)
        )

        # print(dummy_data(cur))
        conn.commit()

    except Error as e:
        print(e)

    if conn:
        conn.close()
        print("\nDatabase connection ended.")
