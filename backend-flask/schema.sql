-- DROP TABLE IF EXISTS Users BinSortData
-- DROP TABLE IF EXISTS Users; 
-- DROP TABLE IF EXISTS BinSortData;

-- CREATE TABLE Users (
--     Id INTEGER PRIMARY KEY,
--     FirstName VARCHAR(64) NOT NULL, 
--     LastName VARCHAR(64) NOT NULL,
--     UserPassword VARCHAR(255) NOT NULL,
--     IsTrainer BOOLEAN NOT NULL
-- );

-- CREATE TABLE BinSortData (
--     Date TIMESTAMP NOT NULL,
--     PartImage VARCHAR(255) NOT NULL, 
--     Damages VARCHAR(255) NOT NULL,
--     SystemDecision BOOLEAN NOT NULL,
--     SorterDecision BOOLEAN NOT NULL,
--     SorterId INTEGER REFERENCES Users(Id) 
-- );

CREATE TABLE images (
    imageID       INTEGER  PRIMARY KEY AUTOINCREMENT,
    ImageBlob     BLOB     NOT NULL,
    dateProcessed DATETIME NOT NULL
                           DEFAULT (datetime('now', 'localtime') ),
    Condition     INTEGER  NOT NULL,
    EmpID         INTEGER  REFERENCES Employees (EmpID) 
                           NOT NULL,
    overrideNum   INTEGER
);

CREATE TABLE Overrides (
    overrideNum      INTEGER  PRIMARY KEY AUTOINCREMENT
                              NOT NULL,
    imageID          INTEGER  REFERENCES images (imageID),
    TrainerID        INTEGER  REFERENCES Trainer (TrainerID) 
                              NOT NULL,
    dateOverrided    DATETIME NOT NULL
                              DEFAULT (datetime('now', 'localtime') ),
    updatedCondition INTEGER  NOT NULL,
    oldCondition     INTEGER
);

CREATE TABLE Trainer (
    TrainerID        INTEGER PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    AuthorizationNum INTEGER UNIQUE
                             NOT NULL
);

CREATE TABLE Employees (
    EmpID            INTEGER PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    AuthorizationNum INTEGER UNIQUE
                             NOT NULL,
    overridePerc     DOUBLE
);

CREATE TABLE Conditions (
    value       INTEGER UNIQUE
                        NOT NULL
                        PRIMARY KEY AUTOINCREMENT,
    Description STRING  NOT NULL
);
-----------------------------------------------------------------------
-- Triggers that will fill the Overrides table when an images condtion is changed
-- in images table

-- Attributes for Override Table
CREATE TRIGGER img_condition_override
         AFTER UPDATE OF Condition
            ON images
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
                                  SELECT TrainerID
                                    FROM Trainer
                                   WHERE TrainerID == 1
                              ),
                              new.Condition,
                              old.Condition
                          );
END;

-- Updated value in images.overrideNum from NULL to 1; Could be changed to a different value later
CREATE TRIGGER update_override_status
         AFTER UPDATE OF Condition
            ON images
      FOR EACH ROW
BEGIN
    UPDATE images
       SET overrideNum = 1;
END;