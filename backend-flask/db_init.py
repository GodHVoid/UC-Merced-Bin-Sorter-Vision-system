'''Initialises database by executing all lines in schema.sql'''

import config
import sqlite3
from contextlib import closing

with closing(sqlite3.connect(config.database)) as conn:
    with open('schema.sql') as f:
        conn.execute(f.read())
    conn.commit()