const mysql = require("mysql2");
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tinaroot',
  database: 'departments_db',
},
console.log(`Connected to departments_db database.`)
);

module.exports = db;