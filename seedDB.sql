DROP DATABASE IF EXISTS employeeTrackerDB;
CREATE DATABASE employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  departmentName VARCHAR(45) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NULL,
  salary INTEGER NULL,
  department_id INTEGER NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(45) NULL,
  lastName VARCHAR(45) NULL,
  roleID INTEGER NULL,
  managerID INTEGER, 
  PRIMARY KEY (id)
);



INSERT INTO departement (departmentName) values ("accounting");
INSERT INTO departement (departmentName) values ("development");
INSERT INTO role (title, salary,department_id) values ('accountant', 60000 ,1);
INSERT INTO role (title, salary,department_id) values ('codemonkey', 90000 ,2);
INSERT INTO role (title, salary,department_id) values ('manager', 90000 ,1);

INSERT INTO employee (firstName, lastName, roleID, managerID ) values ('John', 'johnson', 1 , 3);
INSERT INTO employee (firstName, lastName, roleID, managerID ) values ('jenny', 'jenson', 2 , NULL);