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
      },
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
        ],
      }
    ])
    .then((data) => {
      db.query(`INSERT INTO departments` (id, data.newDept), function (err, results) {
        console.log(results);
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
    }
  });
}

function viewDepts() {
  db.query("SELECT * FROM departments", function (err, results) {
    console.table(results);
  });
}

init();
