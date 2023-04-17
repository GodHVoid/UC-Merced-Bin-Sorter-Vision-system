DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Overrides;
DROP TABLE IF EXISTS Part_Conditions;
DROP TABLE IF EXISTS DefectsList;

-- Creates Tables
CREATE TABLE Users (
    user_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname  STRING  NOT NULL,
    lastname   STRING  NOT NULL,
    username   STRING  UNIQUE
                       NOT NULL,
    password   STRING  NOT NULL,
    is_trainer BOOLEAN NOT NULL
);

CREATE TABLE Images (
    image_id    INTEGER  PRIMARY KEY AUTOINCREMENT,
    part_type   STRING   NOT NULL,
    date        DATETIME NOT NULL
                         DEFAULT (datetime('now', 'localtime') ),
    image_blob  BLOB     NOT NULL,
    emp_id      INTEGER  NOT NULL 
                         REFERENCES Users (user_id),
    sys_verdict STRING   NOT NULL,
    emp_verdict STRING   NOT NULL,
    override    BOOLEAN
);

CREATE TABLE Part_Conditions (
    p_image_id    INTEGER  REFERENCES Images (image_id) 
                           UNIQUE
                           NOT NULL,
    p_part_type   STRING   NOT NULL,
    date          DATETIME NOT NULL
                           DEFAULT (datetime('now', 'localtime') ),
    verdict       STRING   NOT NULL,
    Corner_damage INTEGER,
    Edge_damage   INTEGER,
    Logo_repair,
    Cleat_damage  INTEGER,
    Clear_repair
);

CREATE TABLE Overrides (
    override_id    INTEGER  PRIMARY KEY AUTOINCREMENT
                            NOT NULL,
    date           DATETIME NOT NULL
                            DEFAULT (datetime('now', 'localtime') ),
    o_image_id     INTEGER  NOT NULL,
    trainer_id     INTEGER  NOT NULL,
    new_condition  STRING   NOT NULL,
    prev_condition STRING   NOT NULL,
    Corner_damage  INTEGER,
    Edge_damage    INTEGER,
    Logo_repair    INTEGER,
    Cleat_damage   INTEGER,
    Clear_repair   INTEGER
);

CREATE TABLE DefectsList (
    value       INTEGER PRIMARY KEY AUTOINCREMENT,
    defect_type STRING  NOT NULL
                        UNIQUE
);

------------------------ Triggers --------------------------
-- After initial image is processed, inserts into Part_Conditions with more details on defects present
CREATE TRIGGER insert_to_Part_Conditions
         AFTER INSERT
            ON Images
BEGIN
    INSERT INTO Part_Conditions (
                                    p_image_id,
                                    p_part_type,
                                    verdict,
                                    Corner_damage,
                                    Edge_damage,
                                    Logo_repair,
                                    Cleat_damage,
                                    Clear_repair
                                )
                                VALUES (
                                    new.image_id,
                                    new.part_type,
                                    new.emp_verdict,
                                    1,
                                    1,
                                    1,
                                    1,
                                    1
                                );
END;
-- When verdict is changed, keeps history of the new verdict and defects
-- Also updates value in Images.override to 1, meaning the employee verdict has been overwritten
CREATE TRIGGER insert_into_overrides
         AFTER UPDATE OF emp_verdict
            ON Images
BEGIN
    INSERT INTO Overrides (
                              o_image_id,
                              trainer_id,
                              new_condition,
                              prev_condition,
                              Corner_damage,
                              Edge_damage,
                              Logo_repair,
                              Cleat_damage,
                              Clear_repair
                          )
                          VALUES (
                              new.image_id,
                              5,
                              new.emp_verdict,
                              old.emp_verdict,
                              0,
                              0,
                              0,
                              0,
                              0
                          );
    UPDATE Images
       SET override = 1
     WHERE image_id = new.image_id;
END;
-- Once an entry is made into the Overrides table, the conditions on an existing image need to be made
CREATE TRIGGER update_Part_Condtions
         AFTER INSERT
            ON Overrides
BEGIN
    UPDATE Part_Conditions
       SET verdict = new.new_condition,
           Corner_damage = new.Corner_damage,
           Edge_damage = new.Edge_damage,
           Logo_repair = new.Logo_repair,
           Cleat_damage = new.Cleat_damage,
           Clear_repair = new.Clear_repair
     WHERE p_image_id = new.o_image_id;
END;

------------------------------------------------------------

INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Lucas','Ortiz','lortiz', '123Ortiz', 0);
INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Tony', 'Doan', 'tdoan', '123Doan', 0);
INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Renato', 'Millan', 'rmillan', '123Renato', 0);
INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Rui', 'Pan', 'rpan', '123Rui', 0);
INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Justus', 'Sasses', 'jsasse', '234Justus', 1)

-- Test Queries to receive specific data ------------------
-- 1) Return employee info except for password
SELECT user_id, firstname, lastname, username FROM Users WHERE is_trainer != 1;

-- returns infor based on userlogin
SELECT user_id, firstname, lastname
FROM Users
WHERE username = 'lortiz' --can be changed to user input

-- 2) Returns sys vs emp decision on image
SELECT P.firstname, image_id, part_type, date, emp_id, sys_verdict, emp_verdict, override 
FROM Images, (SELECT firstname, user_id FROM Users) as P
WHERE emp_id = 3 -- can be changed to look up by name; or user input
    AND P.user_id = emp_id;

-- 3) Returns all the parts by employee
SELECT*
FROM Images
WHERE emp_id = 5; --value can change

-- 4) Return all images by specific part type
SELECT *
FROM Images
WHERE part_type = 'Base-pallet'; -- can change the string type

-- 5) for Database Page (trainer)
SELECT emp_id, Images.date as Date, 'image here', sys_verdict, emp_verdict, Corner_damage, Edge_damage, Logo_repair, Cleat_damage, Clear_repair
FROM Images, Part_Conditions
WHERE image_id = p_image_id

-------------------- Working with Overrides Table --------------
-- 6) Returns everything from table
SELECT * FROM Overrides;

-- 7) Return the last x-number of inputs to Override Tables
SELECT * FROM Overrides ORDER BY override_id DESC LIMIT 2;
-- Returns overrides made by a specific trainer
SELECT* FROM Overrides WHERE trainer_id = 5;