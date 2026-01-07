
/*****************************************

SCHEMA OF MY SIMULATOR - WEB-BASED SIMULATOR FOR SORTING ALGORITHMS
BY
JAVED ULLAH - BC210405541

USER CAN...
* Create a database on their system
* Create a table inside that database with various columns
* Create a table inside the database for feedback - For now not being used
* Create a table inside the database for help - For now not being used


******************************************/


CREATE DATABASE simulatorDB;

USE simulatorDB;

-- Log table
CREATE TABLE log (
    resultID INT AUTO_INCREMENT PRIMARY KEY,
    algorithmUsed VARCHAR(50) NOT NULL,
    inputArray TEXT NOT NULL,
    sortedArray TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    executionTime FLOAT NOT NULL
);

-- Feedback table
CREATE TABLE feedback (
    feedbackID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contactNo VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    feedback TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Help table
CREATE TABLE help (
    helpID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    issue TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('open', 'in-progress', 'resolved') DEFAULT 'open'
);