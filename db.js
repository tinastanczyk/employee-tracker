// requiring mysql2 package
const mysql = require("mysql2");
// creating connection to departments_db database
const db = mysql.createConnection({
  host: 'localhost',
  // mysql user
  user: 'root',
  // mysql password
  password: 'tinaroot',
  database: 'departments_db',
});
// exporting db
module.exports = db;