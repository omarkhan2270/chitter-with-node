var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "acebook"
});

var sql_create_users_table = "CREATE TABLE users(user_id SERIAL PRIMARY KEY, name VARCHAR(60), email VARCHAR(60), password TEXT);"
var sql_create_posts_table = "CREATE TABLE posts(id SERIAL PRIMARY KEY, text VARCHAR(100), user_id INT, datetime TIMESTAMP, likes INT);"

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql_create_users_table, function (err, result) {
    if (err) throw err;
    console.log("Table USERS created");
  });
  con.query(sql_create_posts_table, function (err, result) {
    if (err) throw err;
    console.log("Table POSTS created");
    process.exit();
  });
});
