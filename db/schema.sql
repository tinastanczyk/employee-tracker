-- Drops the departments_db --
DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;
-- Uses the departments_db database --
USE departments_db;
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY(id)
);

