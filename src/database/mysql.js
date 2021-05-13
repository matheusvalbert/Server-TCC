const mysql = require('mysql');

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'tcc'
});

db.Promise = global.Promise;

module.exports = db;
