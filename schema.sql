-- Drops the departments_db --
DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;
-- Uses the departments_db database --
USE departments_db;
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(30)
);

