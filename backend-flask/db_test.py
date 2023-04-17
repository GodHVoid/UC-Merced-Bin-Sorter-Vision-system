'''File to create test data for the database.'''
import sqlite3
from sqlite3 import Error
import os
from os import listdir
import hashlib
import config


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

def hash_password(pwd):
    pwd += config.salt
    return hashlib.sha256(pwd.encode()).hexdigest()

def insertUser(conn, newUser):
    cur = conn.cursor()
    hashed = hash_password(newUser[3])
    sql = """INSERT INTO Users (firstname,lastname,username,password,is_trainer)
            VALUES (?,?,?,?,?)"""
    args = [newUser[0], newUser[1], newUser[2], hashed, newUser[4]]
    cur.execute(sql,args)
    conn.commit()
    print("Added new user %s" %newUser[0])

def employees(conn):
    cur = conn.cursor()
    sql = """SELECT user_id, firstname, lastname, username
            FROM Users WHERE is_trainer != 1;"""
    cur.execute(sql)
    ret = cur.fetchall()
    print("Employees:")
    for x in ret:
        print(x[0], x[1], x[2], x[3])
    return ret

def anemployee(conn, name):
    cur = conn.cursor()
    sql = """SELECT user_id, firstname, lastname FROM Users WHERE username = ?;"""
    #args = name
    cur.execute(sql,(name,))
    res = cur.fetchall()
    print("\nEmployee:")
    print(res[0][0], res[0][1], res[0][2])
    return res

def decisionDifferences(conn, num):
    cur = conn.cursor()
    sql = """SELECT P.firstname, image_id, part_type, date, emp_id, sys_verdict, emp_verdict, override 
            FROM Images, (SELECT firstname, user_id FROM Users) as P
            WHERE emp_id = ?
                AND P.user_id = emp_id;"""
    cur.execute(sql,(num,))
    res = cur.fetchall()
    print("\nsys and emp decision differences")
    for x in res:
        print(x)
    return res

def partsByEmp(conn, num):
    cur = conn.cursor()
    sql = """SELECT image_id, part_type, date, sys_verdict, emp_verdict, override FROM Images WHERE emp_id = ?"""
    cur.execute(sql,(num,))
    res = cur.fetchall()
    print("\nparts by employee ", num)
    for x in res:
        print(x)
    return res

def partType(conn, part):
    cur = conn.cursor()
    sql = """SELECT image_id, part_type, date, emp_id, sys_verdict, emp_verdict, override
            FROM Images
            WHERE part_type = ?"""
    cur.execute(sql, (part,))
    res = cur.fetchall()
    print("\nBy part type:")
    for x in res:
        print(x)
    return res

def dataBase(conn):
    cur = conn.cursor()
    sql = """SELECT emp_id, Images.date as Date, 'image here', sys_verdict, emp_verdict, Corner_damage, Edge_damage, Logo_repair, Cleat_damage, Clear_repair
        FROM Images, Part_Conditions
        WHERE image_id = p_image_id"""
    cur.execute(sql)
    res = cur.fetchall()
    print("\nDatabase Page")
    for x in res:
        print(x)
    return res

def overrides(conn):
    cur = conn.cursor()
    sql = """SELECT * FROM Overrides;"""
    cur.execute(sql)
    res = cur.fetchall()
    print("\nOverrides Table: ")
    for x in res:
        print(x)
    return res

def latestEntries(conn):
    cur = conn.cursor()
    # will display the last two entries in the table
    sql = """SELECT * FROM Overrides ORDER BY override_id DESC LIMIT 2;"""
    cur.execute(sql)
    res = cur.fetchall()
    print("\nLatest Entries to Overrides:")
    for x in res:
        print(x)
    return res

def trainerOverrides(conn, num):
    cur = conn.cursor()
    sql = """SELECT* FROM Overrides WHERE trainer_id = ?;"""
    cur.execute(sql,(num,))
    res = cur.fetchall()
    print("\noverrides made by trainer %d :" %num)
    for x in res:
        print(x)
    return res

def main():
    database = r'Bin_Sort_db.db'
    conn = openConnection(database)
    # Insert Users with hashed password
    users = [('Jason', 'Momoa', 'jmomoa', '123Momoa', 0),
             ('Michael', 'Jackson', 'mjackson', '123Jackson', 0),
             ('Michelle', 'Smith', 'msmith', '123Smith', 0)
             ]
    for user in users:
        insertUser(conn,user)

    #return all employees
    returns = employees(conn)
    # if returns:
    #     print("returns is not empty!!!")
    #return one employee
    username = "lortiz"
    returns2 = anemployee(conn, username)
    #return sys vs emp decision on image
    returns3 = decisionDifferences(conn,4)
    # Parts by an employee
    returns4 = partsByEmp(conn, 3)
    # Return parts by part_type
    returns5 = partType(conn, 'Plain')
    # For Database Page(Trainer)
    returns6 = dataBase(conn)
    # Return all entries in Overrides TAble
    returns7 = overrides(conn)
    # Return the last x-number of inputs in Overrides Table
    returns8 = latestEntries(conn)
    # REturns overrides by specific trainer
    returns9 = trainerOverrides(conn, 5)
    

    closeConnection(conn, database)



if __name__ == '__main__':
    main()
