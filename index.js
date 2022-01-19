const inquirer = require("inquirer");
const db = require("./server");
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
      "Quit",
    ],
  },
];

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
  const depts = [];
  db.query(`Select departments.department FROM departments`, function (err, results) {
    for(let i=0; i<results.length; i++){
      depts.push(results[i].department);
    }
  });
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
      }
    ])
    .then((data) => {
      console.log(data.roleDept);
      db.query(`SELECT departments.department_id FROM departments WHERE department = ?`, data.roleDept, (err,results) => {
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
      });
    });
}

function init() {
  inquirer.prompt(questions).then((data) => {
    console.log(data.options);
    switch (data.options) {
      case "View all departments":
        viewDepts();
        break;
      case "Add a department":
        addDept();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Add a role":
        addRole();
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
