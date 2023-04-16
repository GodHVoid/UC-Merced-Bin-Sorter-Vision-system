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
-- Return employee info except for password
SELECT user_id, firstname, lastname, username FROM Users WHERE is_trainer != 1;
    -- returns infor based on userlogin
    SELECT user_id, firstname, lastname
    FROM Users
    WHERE username = lortiz --can be changed to user input

-- Returns images processed by an employee
SELECT *, Some.Corner_damage
FROM Images, 
 ( SELECT Corner_damage, Edge_damage, Logo_repair, Cleat_damage, Clear_repair
   FROM Part_Conditions
   Where Images.emp_id = Part_Conditions.p_image_id;
 ) as Some
 WHERE emp_id = 4 -- can be changed to look up by name; or user input
    AND image_id = Some.p_image_id;

-- Returns sys vs emp decision on image
SELECT P.firstname, * 
FROM Images, (SELECT firstname, user_id FROM Users) as P
WHERE emp_id = 3 -- can be changed to look up by name; or user input
    AND P.user_id = emp_id;


-- -- DROP TABLE User;
-- -- DROP TABLE Images;
-- -- DROP TABLE Overrides;
-- -- DROP TABLE Conditions;

-- -- Creating tables
-- CREATE TABLE User (
--     user_id         INTEGER PRIMARY KEY AUTOINCREMENT
--                                         NOT NULL,
--     username        STRING UNIQUE NOT NULL,
--     password        STRING NOT NULL,
--     authorization INTEGER NOT NULL
-- );

-- CREATE TABLE Images (
--     image_id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
--     data            DATETIME NOT NULL
--                            DEFAULT (datetime('now', 'localtime') ),
--     image_blob       BLOB NOT NULL,
--     defects         INTEGER NOT NULL,
--     sys_verdict     STRING NOT NULL,
--     emp_verdict     STRING NOT NULL,
--     emp_id          INTEGER NOT NULL,
--     override        INTEGER
-- );

-- CREATE TABLE Overrides (
--     override_id      INTEGER  PRIMARY KEY AUTOINCREMENT
--                               NOT NULL,
--     imageID          INTEGER  REFERENCES images (image_id),
--     TrainerID        INTEGER  REFERENCES Trainer (user_id) 
--                               NOT NULL,
--     dateOverrided    DATETIME NOT NULL
--                               DEFAULT (datetime('now', 'localtime') ),
--     updatedCondition INTEGER  NOT NULL,
--     oldCondition     INTEGER
-- );

-- CREATE TABLE Conditions (
--     value       INTEGER UNIQUE
--                         NOT NULL
--                         PRIMARY KEY AUTOINCREMENT,
--     Description STRING  NOT NULL
-- );
-- --------------------------------------------------------
-- -- Triggers that will fill the Overrides table when an images condtion is changed
-- -- in images table

-- -- Attributes for Override Table
-- CREATE TRIGGER img_condition_override
--          AFTER UPDATE OF defects
--             ON Images
--       FOR EACH ROW
-- BEGIN
--     INSERT INTO Overrides (
--                               imageID,
--                               TrainerID,
--                               updatedCondition,
--                               oldCondition
--                           )
--                           VALUES (
--                               old.imageID,
--                               (
--                                   SELECT user_id
--                                     FROM User
--                                    WHERE user_id == 6
--                               ),
--                               new.defects,
--                               old.defects
--                           );
-- END;

-- -- Updated value in images.overrideNum from NULL to 1; Could be changed to a different value later
-- CREATE TRIGGER update_override_status
--          AFTER UPDATE OF defects
--             ON Images
--       FOR EACH ROW
-- BEGIN
--     UPDATE Images
--        SET override = 1;
-- END;

-- -----------------------------------------------------
-- -- Populate some tables for texting
-- INSERT INTO Conditions (description) VALUES ('Warped');
-- INSERT INTO Conditions (description) VALUES ('Chipped Corners');
-- INSERT INTO Conditions (description) VALUES ('Cracks');
-- INSERT INTO Conditions (description) VALUES ('Bent Metal');
-- INSERT INTO Conditions (description)VALUES ('Missing Boards');
-- INSERT INTO Conditions (description) VALUES ('Mold');
-- INSERT INTO Conditions (description) VALUES ('Cracks');

-- INSERT INTO User (username, password, authorization) VALUES ('John', '123john', 0);
-- INSERT INTO User (username, password, authorization) VALUES ('Jim', '123jim', 1);
-- INSERT INTO User (username, password, authorization) VALUES ('David', '123david', 0);