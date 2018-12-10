var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

var sql_create_db = "CREATE DATABASE acebook;";

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql_create_db, function (err, result) {
    if (err) throw err;
    console.log("Database Created");
    process.exit();
  });
});
