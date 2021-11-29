var express = require('express');
var router = express.Router();
var db = require('../db');
var errors = [];

router.get('/user-process', function (req, res, next) {


  if (req.session.authorised) {
    var sqlQuery = `select user_id,user_email,user_fname from users u  where user_fname <> 'Admin'`;

    db.query(sqlQuery, function (err, results, fields) {
      //console.warn(results);
      res.render('user-process', {
        title: 'User Meal Process',
        authorised: req.session.authorised,
        fname: req.session.fname,
        user_id: req.session.user_id,
        users: results
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
router.post('/user-process', function (req, res, next) {
  var month = req.body.month.split("-");
  var dat = getDaysInMonthUTC(month[1] - 1, month[0])
  var cc = 0;
  //console.warn(dat);
  dat.forEach(function (item, index) {
    var sqlQuery = `select count(meal_id) dt from meal m where m.users_id = ? and meal_date = cast(? as date)`;
    var values = [req.session.user_id, item];
    db.query(sqlQuery, values, function (err, results, fields) {
      //console.warn(results[0].dt,index);        
      if (results[0].dt == 0) {
        var sqlQueryinsert = `insert into meal(meal_id,users_id,meal_date,breakfast,launch,dinner,add_by,add_date,isdelete) 
                              values (null,?,?,?,?,?,?,?,0)  `;
        var values = [req.body.user_id, item, req.body.breakfast, req.body.lunch, req.body.dinner, req.session.fname, new Date()];
        db.query(sqlQueryinsert, values, function (err, results1, fields) {
          //console.warn(results1.affectedRows);        
          if (results1.affectedRows > 0) {
            cc = cc + 1
          }
        });
      }
    });

  });
  //console.log(cc);
  res.redirect('/user-process');
  return;
  //console.log(cc.toString() + " rows inserted")
  // if (cc > 0) {
  //   res.redirect('/user-process');
  //   return;
  // } else {
  //   errors.push(err.message);
  //   next();
  // }  
});

router.get('/user-process-clear', function (req, res, next) {


  if (req.session.authorised) {
    var sqlQuery = `select user_id,user_email,user_fname from users u  where user_fname <> 'Admin'`;

    db.query(sqlQuery, function (err, results, fields) {
      //console.warn(results);
      res.render('user-process-clear', {
        title: 'User Meal Process',
        authorised: req.session.authorised,
        fname: req.session.fname,
        user_id: req.session.user_id,
        users: results
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
router.post('/user-process-clear', function (req, res, next) {
  var month = req.body.month.split("-");
  var sqlQueryDelete = `delete from meal where users_id = ? and month(meal_date) = ? and year(meal_date) = ? and cast(meal_date as date)>cast(CURDATE() as date) `;
  var values = [req.session.user_id, month[1], month[0]];
  db.query(sqlQueryDelete, values, function (err, results, fields) {
    //console.warn(results); 
       
  });
  res.redirect('/user-process-clear');
  return;
  // if (results.affectedRows == 1) {
  //   res.redirect('/user-process-clear');
  //   return;
  // } else {
  //   errors.push(err.message);
  //   next();
  // }    
  //console.log(cc.toString() + " rows inserted")
});




module.exports = router;



function getDaysInMonthUTC(month, year) {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
}