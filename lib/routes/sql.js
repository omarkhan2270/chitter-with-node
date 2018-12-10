const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:password@127.0.0.1:3306/acebook');
// const sequelize = new Sequelize('acebook', 'root', 'password', {
//   host: 'localhost',
//   dialect: 'mysql',
//   operatorsAliases: false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
// });
sequelize.authenticate().then(() => {
  console.log('Connection established');
}).catch (err => {
  console.error('Unable to connect: ', err);
});
const Users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});
const Posts = sequelize.define('posts', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
    type: Sequelize.INTEGER
  },
  text: {
    type: Sequelize.STRING
  },
  likes: {
    type: Sequelize.INTEGER
  }
});
const Comments = sequelize.define('comments', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postID: {
    type: Sequelize.INTEGER
  },
  text: {
    type: Sequelize.STRING
  }
});
//force: true will drop the table if it already exists
// Users.sync({force: false}).then(() => {
//   return Users.create({
//     name: 'Omar',
//     email: 'omar@acebook.com'
//   });
// });
Users.sync();
Posts.sync();
Comments.sync();
//Users.hasMany(Posts, {as: 'userId'});
//Posts.hasMany(Comments, {as: 'postId'}); //One post can have many comments
// Users.create({
//   name: 'Rhydian',
//   email: 'rhydian@acebook.com',
//   password: 'RhydiansPassword'
// });

// Posts.findAll().then(posts => {
//   console.log(posts[0].dataValues.text);
// });

// Users.findOne({
//   where: {
//     email: 'testuser@email.com'
//   }
// }).then(users => {
//   console.log(users.name);
// });

exports.register = function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  Users.create({
    name: name,
    email: email,
    password: password
  });
  res.redirect('/login');
};
exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  Users.findOne({
    where: {email: email}
  }).then(users => {
    if (users == null) {
      //Represents if email address not found
      res.send({
        "code":204,
        "fail":"Email address not found"
      });
    }
    else if (password == users.password){
      //Represents a sucessfull login
      req.session.email = users.email;
      req.session.name = users.name;
      req.session.userID = users.id;
      console.log('User ' + req.session.email + ' logged in, id: ' + req.session.userID);
      res.redirect('/post');
    }
    else {
      //Represents matching email but incorrect password
      res.send({
        "code":204,
        "fail":"Email and password does not match"
      });
    }
  });
};
exports.post = function (req, res) {
  var post = req.body.post;
  Posts.create({
    userid: req.session.userID,
    text: post,
    likes: 0
  });
  res.redirect('/post');
};
exports.getPosts = function (req, res) {
  Posts.findAll().then(posts => {
    res.render('home.ejs', { data: posts});
    //return posts[0].dataValues.text;
  });
};
