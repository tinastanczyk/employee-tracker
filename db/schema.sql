-- Drops the departments_db --
DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;
-- Uses the departments_db database --
USE departments_db;
-- creates a departments table with a department_id and department keys
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30),
  PRIMARY KEY(department_id)
);
-- creates a roles table with role_id, department_id, title and salary keys
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
-- creates an employees table with employee_id, first_name, last_name, manager, department_id and role_id keys
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
