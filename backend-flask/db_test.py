'''File to create test data for the database.'''
import sqlite3
from sqlite3 import Error
import os
from os import listdir

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

def employees(conn):
    cur = conn.cursor()
    sql = """SELECT user_id, firstname, lastname, username
            FROM Users WHERE is_trainer != 1;"""
    cur.execute(sql)
    ret = cur.fetchall()
    for x in ret:
        print(x[0], x[1], x[2], x[3])

def anemployee(conn, name):
    cur = conn.cursor()
    sql = """SELECT user_id, firstname, lastname FROM Users WHERE username = ?;"""
    #args = name
    cur.execute(sql,(name,))
    res = cur.fetchall()
    print(res[0][0], res[0][1], res[0][2])

def decisionDifferences(conn, num):
    cur = conn.cursor()
    sql = """SELECT P.firstname, image_id, part_type, date, emp_id, sys_verdict, emp_verdict, override 
            FROM Images, (SELECT firstname, user_id FROM Users) as P
            WHERE emp_id = ?
                AND P.user_id = emp_id;"""
    cur.execute(sql,(num,))
    res = cur.fetchall()
    for x in res:
        print(x)

def main():
    database = r'Bin_Sort_db.db'
    conn = openConnection(database)
    #return all employees
    employees(conn)
    #return one employee
    username = "lortiz"
    anemployee(conn, username)
    #return sys vs emp decision on image
    decisionDifferences(conn,4)

    closeConnection(conn, database)



if __name__ == '__main__':
    main()
