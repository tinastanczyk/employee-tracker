-- inserting departments into departments table
INSERT INTO departments (department)
VALUES ("Engineering"),("Sales"),("Marketing"),("Accounting"),("Human Resources");
-- inserting roles into roles table
INSERT INTO roles (title, department_id, salary)
VALUES ("Front-End Developer",1,50000),("Sales Associate",2,35000),("Social Media Director",3,50000),("Financer",4,80000),("HR Representative",5,60000);
-- inserting employees into employees table
INSERT INTO employees (first_name, last_name, manager, department_id, role_id)
VALUES ("Molly", "Callahan", "Josh Baxter", 3, 3),("Rebecca", "Labow", "Samurai Jack", 2, 2),("Noah", "Berry", "Fraiser", 1, 1),("Ryan", "Stanczyk", "Winston Churchill", 4, 4),("Ava", "Kane", "Wendy Kane", 5, 5);