// includes inquirer package, db folder and console.table package
const inquirer = require("inquirer");
const db = require("./db");
const cTable = require("console.table");
// globally scoped arrays for respective strings
const depts = [];
const roles = [];
const managers = [];
const employees = [];
// user prompts when app is initialized
const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "options",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Update employee's manager",
      "Quit",
    ],
  },
];
// query function to put department names in array depts
function getDepts() {
  db.query(
    `SELECT departments.department FROM departments`,
    function (err, results) {
      for (let i = 0; i < results.length; i++) {
        depts.push(results[i].department);
      }
    }
  );
}
// query function to put role names in array roles
function getRoles() {
  db.query(`SELECT roles.title FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].title);
    }
  });
}
// query function to put manager names in array managers
function getManagers() {
  db.query(`SELECT employees.manager FROM employees`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      managers.push(results[i].manager);
    }
  });
}
// function to add a department to departments table
function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "newDept",
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO departments (department)VALUES (?)`,
        data.newDept,
        function (err, results) {
          init();
        }
      );
    });
}
// function to add role to roles table
function addRole() {
  // calling getDepts to create array, depts
  getDepts();
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "newRole",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "newSalary",
      },
      {
        type: "list",
        message: "Which department does the role belong to?",
        name: "roleDept",
        choices: depts,
      },
    ])
    .then((data) => {
      db.query(
        `SELECT departments.department_id FROM departments WHERE department = ?`,
        data.roleDept,
        (err, results) => {
          const roleDeptID = results[0].department_id;
          db.query(
            `INSERT INTO roles (title, department_id, salary)VALUES (?,?,?)`,
            [data.newRole, roleDeptID, data.newSalary],
            function (err, results) {
              init();
            }
          );
        }
      );
    });
}
//  function to add employee to employees table
function addEmployee() {
  // calling getRoles and getManagers to create roles and managers arrays
  getRoles();
  getManagers();
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "empRole",
        choices: roles,
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: managers,
      },
    ])
    .then((data) => {
      db.query(
        `SELECT roles.role_id FROM roles WHERE title = ?`,
        data.empRole,
        (err, results) => {
          const roleID = results[0].role_id;
          db.query(
            `SELECT roles.department_id FROM roles WHERE role_id = ?`,
            roleID,
            (err, results) => {
              const deptID = results[0].department_id;
              db.query(
                `INSERT INTO employees (first_name, last_name, manager, department_id, role_id) VALUES (?,?,?,?,?)`,
                [data.firstName, data.lastName, data.manager, roleID, deptID],
                (err, results) => {
                  init();
                }
              );
            }
          );
        }
      );
    });
}
// function to update an employee's role in the employees table
function updateRole() {
  // Calling getRoles to create roles array
  getRoles();
  // query to create employees array
  db.query(
    `SELECT employees.first_name, employees.last_name FROM employees`,
    function (err, results) {
      for (let i = 0; i < results.length; i++) {
        // pushing first and last name of employee into a single index of employees array
        employees.push(results[i].first_name + " " + results[i].last_name);
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "employee",
            choices: employees,
          },
          {
            type: "list",
            message: "Which role do you want to assign the selected employee?",
            name: "role",
            choices: roles,
          },
        ])
        .then((data) => {
          // separating first and last name from employee selected
          const empFirst = data.employee.split(" ")[0];
          const empLast = data.employee.split(" ")[1];
          // query to get role_id and department_id from role selected
          db.query(
            `SELECT role_id, department_id FROM roles WHERE title = ?`,
            data.role,
            function (err, results) {
              const roleID = results[0].role_id;
              const deptID = results[0].department_id;
              // query to get employee_id from employee selected
              db.query(
                `SELECT employees.employee_id FROM employees WHERE employees.first_name = ? AND employees.last_name = ?`,
                [empFirst, empLast],
                function (err, results) {
                  const empID = results[0].employee_id;
                  // query to update employee role_id and department id in employees table
                  db.query(
                    `UPDATE employees SET employees.role_id = ?, employees.department_id = ? WHERE employees.employee_id = ?`,
                    [roleID, deptID, empID],
                    function (err, results) {
                      init();
                    }
                  );
                }
              );
            }
          );
        });
    }
  );
}
// function to update employee's manager in the employees table
function updateManager() {
  // calling getManagers to create managers array
  getManagers();
  // query to create employees array
  db.query(
    `SELECT employees.first_name, employees.last_name FROM employees`,
    function (err, results) {
      for (let i = 0; i < results.length; i++) {
        // pushing the first and last name into same index of employees array
        employees.push(results[i].first_name + " " + results[i].last_name);
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's manager do you want to update?",
            name: "employee",
            choices: employees,
          },
          {
            type: "list",
            message:
              "Which manager do you want to assign the selected employee?",
            name: "manager",
            choices: managers,
          },
        ])
        .then((data) => {
          // separating first and last name from employee selected
          const empFirst = data.employee.split(" ")[0];
          const empLast = data.employee.split(" ")[1];
          // query to get employee_id from employee selected
          db.query(
            `SELECT employees.employee_id FROM employees WHERE employees.first_name = ? AND employees.last_name = ?`,
            [empFirst, empLast],
            function (err, results) {
              const empID = results[0].employee_id;
              // query to update manager for employee selected in employees table
              db.query(
                `UPDATE employees SET employees.manager = ? WHERE employees.employee_id = ?`,
                [data.manager, empID],
                function (err, results) {
                  init();
                }
              );
            }
          );
        });
    }
  );
}
// function to initialize the app
function init() {
  inquirer.prompt(questions).then((data) => {
    // calls respective functions when user clicks option
    switch (data.options) {
      case "View all departments":
        viewDepts();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Add a department":
        addDept();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateRole();
        break;
      case "Update employee's manager":
        updateManager();
        break;
      // quits application
      case "Quit":
        process.exit(1);
    }
  });
}
// query function to display table of all departments
function viewDepts() {
  db.query(
    "SELECT departments.department_id, departments.department FROM departments",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}
// query function to display table of all roles
function viewRoles() {
  db.query(
    `SELECT roles.role_id, roles.title, departments.department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.department_id`,
    function (err, results) {
      console.table(results);
      init();
    }
  );
}
// query function to display table of all employees
function viewEmployees() {
  getManagers();
  db.query(
    `SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees JOIN roles ON employees.role_id = roles.role_id JOIN departments ON employees.department_id = departments.department_id`,
    function (err, results) {
      console.table(results);
      init();
    }
  );
}
// calling init function to run application
init();
