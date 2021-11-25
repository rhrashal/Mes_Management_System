var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function (req, res, next) {

  var sqlQuery = `SELECT * FROM users`;

  db.query(sqlQuery, function (err, results, fields) {

    res.render('index', {
      title: 'Register - Login',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id,
      users: results
    });

  });

});

router.get('/user-status', function (req, res, next) {


  if(req.session.authorised){
    var sqlQuery = `select * from meal m where m.users_id = ? and month(m.meal_date) = ?`;
    const d = new Date();
    var values = [req.session.user_id,d.getMonth()+1];
    db.query(sqlQuery,values, function (err, results, fields) {  
      //console.warn(results);
      res.render('user-status', {
        title: 'User Meal Status',
        authorised: req.session.authorised,
        fname: req.session.fname,
        user_id: req.session.user_id,
        meals: results
      });  
    });
  }else{
    res.render('index', {
      title: 'Unauthorized',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id
    });
  }
  

});

router.get('/user-process', function (req, res, next) {


  if(req.session.authorised){
    var sqlQuery = `select user_id,user_email,user_fname from users u  where user_fname <> 'Admin'`;

    db.query(sqlQuery,function (err, results, fields) {  
      //console.warn(results);
      res.render('user-process', {
        title: 'User Meal Process',
        authorised: req.session.authorised,
        fname: req.session.fname,
        user_id: req.session.user_id,
        users: results
      });  
    });
  }else{
    res.render('index', {
      title: 'Unauthorized',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id
    });
  }
  

});
router.post('/user-process', function (req, res, next) {
  console.warn(req.body)
  next();
});

module.exports = router;