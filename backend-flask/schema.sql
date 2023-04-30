DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Overrides;
DROP TABLE IF EXISTS Part_Conditions;
DROP TABLE IF EXISTS DefectsList;
DROP TABLE IF EXISTS Inventory;

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

CREATE TABLE Inventory (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    part_type STRING  UNIQUE
                      NOT NULL,
    count     INTEGER
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

-- INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Lucas','Ortiz','lortiz', '123Ortiz', 0);
-- INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Tony', 'Doan', 'tdoan', '123Doan', 0);
-- INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Renato', 'Millan', 'rmillan', '123Renato', 0);
-- INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Rui', 'Pan', 'rpan', '123Rui', 0);
-- INSERT INTO Users (firstname,lastname,username,password,is_trainer) VALUES ('Justus', 'Sasses', 'jsasse', '234Justus', 1)
