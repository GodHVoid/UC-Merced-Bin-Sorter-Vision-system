DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Damages;
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

CREATE TABLE Damages (
    p_image_id    INTEGER  REFERENCES Images (image_id) 
                           UNIQUE
                           NOT NULL,
    Corner_damage INTEGER,
    Edge_damage   INTEGER,
    Logo_repair   INTEGER,
    Cleat_damage  INTEGER
);

CREATE TABLE Inventory (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    part_type STRING  UNIQUE
                      NOT NULL,
    count     INTEGER
);


CREATE TRIGGER update_inventory
    AFTER INSERT
        On Images
BEGIN
    UPDATE Inventory
        SET count = count+1
            WHERE part_type = new.part_type;
END;
