DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Overrides;
DROP TABLE IF EXISTS Conditions;

-- DROP TABLE User;
-- DROP TABLE Images;
-- DROP TABLE Overrides;
-- DROP TABLE Conditions;

-- Creating tables
CREATE TABLE User (
    user_id         INTEGER PRIMARY KEY AUTOINCREMENT
                                        NOT NULL,
    username        STRING UNIQUE NOT NULL,
    password        STRING NOT NULL,
    authorization INTEGER NOT NULL
);

CREATE TABLE Images (
    image_id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    data            DATETIME NOT NULL
                           DEFAULT (datetime('now', 'localtime') ),
    image_blob       BLOB NOT NULL,
    defects         INTEGER NOT NULL,
    sys_verdict     STRING NOT NULL,
    emp_verdict     STRING NOT NULL,
    emp_id          INTEGER NOT NULL,
    override        INTEGER
);

CREATE TABLE Overrides (
    override_id      INTEGER  PRIMARY KEY AUTOINCREMENT
                              NOT NULL,
    imageID          INTEGER  REFERENCES images (image_id),
    TrainerID        INTEGER  REFERENCES Trainer (user_id) 
                              NOT NULL,
    dateOverrided    DATETIME NOT NULL
                              DEFAULT (datetime('now', 'localtime') ),
    updatedCondition INTEGER  NOT NULL,
    oldCondition     INTEGER
);

CREATE TABLE Conditions (
    value       INTEGER UNIQUE
                        NOT NULL
                        PRIMARY KEY AUTOINCREMENT,
    Description STRING  NOT NULL
);
--------------------------------------------------------
-- Triggers that will fill the Overrides table when an images condtion is changed
-- in images table

-- Attributes for Override Table
CREATE TRIGGER img_condition_override
         AFTER UPDATE OF defects
            ON Images
      FOR EACH ROW
BEGIN
    INSERT INTO Overrides (
                              imageID,
                              TrainerID,
                              updatedCondition,
                              oldCondition
                          )
                          VALUES (
                              old.imageID,
                              (
                                  SELECT user_id
                                    FROM User
                                   WHERE user_id == 6
                              ),
                              new.defects,
                              old.defects
                          );
END;

-- Updated value in images.overrideNum from NULL to 1; Could be changed to a different value later
CREATE TRIGGER update_override_status
         AFTER UPDATE OF defects
            ON Images
      FOR EACH ROW
BEGIN
    UPDATE Images
       SET override = 1;
END;

-----------------------------------------------------
-- Populate some tables for texting
INSERT INTO Conditions (description) VALUES ('Warped');
INSERT INTO Conditions (description) VALUES ('Chipped Corners');
INSERT INTO Conditions (description) VALUES ('Cracks');
INSERT INTO Conditions (description) VALUES ('Bent Metal');
INSERT INTO Conditions (description)VALUES ('Missing Boards');
INSERT INTO Conditions (description) VALUES ('Mold');
INSERT INTO Conditions (description) VALUES ('Cracks');

INSERT INTO User (username, password, authorization) VALUES ('John', '123john', 0);
INSERT INTO User (username, password, authorization) VALUES ('Jim', '123jim', 1);
INSERT INTO User (username, password, authorization) VALUES ('David', '123david', 0);