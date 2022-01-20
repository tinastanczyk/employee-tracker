const inquirer = require("inquirer");
const db = require("./db");
const depts = [];
const roles = [];
const managers = [];
const employees = [];
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

function getRoles() {
  db.query(`SELECT roles.title FROM roles`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].title);
    }
  });
}

function getManagers() {
  db.query(`SELECT employees.manager FROM employees`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
      managers.push(results[i].manager);
    }
  });
}

function addDept() {
  console.log("in addDept function");
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
          console.log(
            `${data.newDept} was successfully added to departments table`
          );
          init();
        }
      );
    });
}

function addRole() {
  console.log("in addRole function");
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
      console.log(data.roleDept);
      db.query(
        `SELECT departments.department_id FROM departments WHERE department = ?`,
        data.roleDept,
        (err, results) => {
          const roleDeptID = results[0].department_id;
          db.query(
            `INSERT INTO roles (title, department_id, salary)VALUES (?,?,?)`,
            [data.newRole, roleDeptID, data.newSalary],
            function (err, results) {
              console.log(
                `${data.newRole} with a ${data.newSalary} was successfully added to roles table`
              );
              init();
            }
          );
        }
      );
    });
}

function addEmployee() {
  console.log("in addEmployee function");
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
                  console.log(
                    `${data.firstName} ${data.lastName} was successfully added to employees table`
                  );
                  init();
                }
              );
            }
          );
        }
      );
    });
}

function updateRole() {
  console.log("in updateRole function");
  getRoles();
  db.query(
    `SELECT employees.first_name, employees.last_name FROM employees`,
    function (err, results) {
      for (let i = 0; i < results.length; i++) {
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
          const empFirst = data.employee.split(" ")[0];
          const empLast = data.employee.split(" ")[1];
          db.query(
            `SELECT role_id, department_id FROM roles WHERE title = ?`,
            data.role,
            function (err, results) {
              const roleID = results[0].role_id;
              const deptID = results[0].department_id;
              db.query(
                `SELECT employees.employee_id FROM employees WHERE employees.first_name = ? AND employees.last_name = ?`,
                [empFirst, empLast],
                function (err, results) {
                  const empID = results[0].employee_id;
                  console.log(`Employee ID: ${empID}`);
                  db.query(
                    `UPDATE employees SET employees.role_id = ?, employees.department_id = ? WHERE employees.employee_id = ?`,
                    [roleID, deptID, empID],
                    function (err, results) {
                      console.log(
                        `Employee, ${data.employee}, has been successfully updated to ${data.role} role.`
                      );
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

function updateManager() {
  console.log("in updateManager function");
  getManagers();
  db.query(
    `SELECT employees.first_name, employees.last_name FROM employees`,
    function (err, results) {
      for (let i = 0; i < results.length; i++) {
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
          const empFirst = data.employee.split(" ")[0];
          const empLast = data.employee.split(" ")[1];
          db.query(
            `SELECT employees.employee_id FROM employees WHERE employees.first_name = ? AND employees.last_name = ?`,
            [empFirst, empLast],
            function (err, results) {
              const empID = results[0].employee_id;
              db.query(
                `UPDATE employees SET employees.manager = ? WHERE employees.employee_id = ?`,
                [data.manager, empID],
                function (err, results) {
                  console.log(
                    `Employee, ${data.employee}, has been successfully updated to have ${data.manager} as Manager.`
                  );
                  init();
                }
              );
            }
          );
        });
    }
  );
}
function init() {
  inquirer.prompt(questions).then((data) => {
    console.log(data.options);
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
      case "Quit":
        break;
    }
  });
}

function viewDepts() {
  db.query(
    "SELECT departments.department_id, departments.department FROM departments",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewRoles() {
  db.query(
    `SELECT roles.role_id, roles.title, departments.department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.department_id`,
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewEmployees() {
  db.query(
    `SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees JOIN roles ON employees.role_id = roles.role_id JOIN departments ON employees.department_id = departments.department_id`,
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

init();
