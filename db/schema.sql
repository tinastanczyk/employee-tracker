-- Drops the departments_db --
DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;
-- Uses the departments_db database --
USE departments_db;
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30),
  PRIMARY KEY(department_id)
);
CREATE TABLE roles (
  role_id INT NOT NULL AUTO_INCREMENT,
  department_id INT,
  title VARCHAR(30),
  salary INT NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES departments(department_id)
  ON DELETE SET NULL,
  PRIMARY KEY(role_id)
);
CREATE TABLE employees (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager VARCHAR(50),
  department_id INT,
  role_id INT,
  FOREIGN KEY (department_id)
  REFERENCES departments(department_id)
  ON DELETE SET NULL,
  FOREIGN KEY (role_id)
  REFERENCES roles(role_id)
  ON DELETE SET NULL,
  PRIMARY KEY(employee_id)
);
