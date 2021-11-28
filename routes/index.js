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


  if (req.session.authorised) {
    var sqlQuery = `select * from meal m where m.users_id = ? and month(m.meal_date) = ?`;
    const d = new Date();
    var values = [req.session.user_id, d.getMonth() + 1];
    db.query(sqlQuery, values, function (err, results, fields) {
      //console.warn(results);
      res.render('user-status', {
        title: 'User Meal Status',
        authorised: req.session.authorised,
        fname: req.session.fname,
        user_id: req.session.user_id,
        meals: results
      });
    });
  } else {
    res.render('index', {
      title: 'Unauthorized',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id
    });
  }


});

router.get('/edit-meal/:meal_Id', function (req, res, next) {  
  var sqlQuery = `select * from meal where meal_id = ? `;
  var value = [req.params.meal_Id]
  db.query(sqlQuery,value, function (err, results, fields) {
    console.log(results);
    res.render('edit-meal', {
      title: 'Register - Login',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id,
      meal: results[0]
    });
  });
});

router.post('/edit-meal/:meal_Id', function (req, res, next) {  
  var sqlQuery = ` update meal set breakfast = ? , launch = ? , dinner = ?, update_by = ?, update_date  = ?  where  meal_id = ?  `;
  var value = [req.body.breakfast,req.body.lunch,req.body.dinner,req.session.fname, new Date(),req.body.meal_id]
  db.query(sqlQuery,value, function (err, results, fields) {
    console.log(results);
    res.render('edit-meal', {
      title: 'user status',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id,
      meal: results[0]
    });
  });
});


module.exports = router;

