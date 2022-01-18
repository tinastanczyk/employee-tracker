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
      "Quit"
    ],
  },
];

function addDept() {
  console.log("in addDept function");
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter department name: ",
        name: "newDept"
      }
    ])
    .then((data) => {
      db.query(`INSERT INTO departments (name)VALUES (?)`, data.newDept, function (err, results) {
        console.log(`${data.newDept} was successfully added to departments table`);
        init();
      });
    })
  
}

function init() {
  inquirer.prompt(questions).then((data) => {
    console.log(data.options);
    switch(data.options){
      case "View all departments":
        viewDepts();
        break;
      case "Add a department":
        addDept();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "Quit":
        break;
    }
  });
}

function viewDepts() {
  db.query("SELECT departments.department_id, departments.department_name FROM departments", function (err, results) {
    console.table(results);
    init();
  });
}

function viewRoles() {
  db.query(`SELECT roles.role_id, roles.role_name, departments.department_name, roles.role_salary FROM roles JOIN departments ON roles.department_id = departments.department_id`, function (err, results) {
    console.table(results);
    init();
  })
}

init();
