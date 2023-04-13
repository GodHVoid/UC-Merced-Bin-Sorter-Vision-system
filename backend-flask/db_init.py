'''Initialises database by executing all lines in schema.sql'''

# import config
# import sqlite3
# from contextlib import closing

# with closing(sqlite3.connect(config.database)) as conn:
#     with open('schema.sql') as f:
#         conn.execute(f.read())
#     conn.commit()
#--------------------------------------------------------------------------------------#
import sqlite3
from sqlite3 import Error

db = r"database.db" # Will connect to database or create one if not already created.
conn = None

try:
    with open('schema2.sql', 'r') as sql_schema:
        sql_commands = sql_schema.read()
    conn = sqlite3.connect(db)
    print("Connected to database.")
    cur = conn.cursor()
    cur.executescript(sql_commands) # Allows for multiple commands to be executed
    conn.commit()
except Error as e:
    print(e)

if conn:
    conn.close()
    print("Database connection ended.")
