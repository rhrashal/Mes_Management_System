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
  var breakfast = checkNagative(req.body.breakfast);
  var lunch = checkNagative(req.body.lunch);
  var dinner = checkNagative(req.body.dinner);

  var month = req.body.month.split("-");
  var dat = getDaysInMonthUTC(month[1] - 1, month[0])
  //console.warn(dat);
  var count = 0;
  dat.forEach(function (item, index) {
    var sqlQuery = `select count(meal_id) dt from meal m where m.users_id = ? and meal_date = cast(? as date)`;
    var values = [req.body.user_id, item];
    //console.warn(values);
    db.query(sqlQuery, values, function (err, results, fields) {
       //console.warn(results,index);        
      if (results[0].dt == 0) {
        var sqlQueryinsert = `insert into meal(meal_id,users_id,meal_date,breakfast,launch,dinner,add_by,add_date,isdelete) 
                              values (null,?,?,?,?,?,?,?,0)  `;
        var values1 = [req.body.user_id, item, breakfast,lunch,dinner, req.session.fname, new Date()];
        db.query(sqlQueryinsert, values1, function (err, results1, fields) {
          //console.warn(results1.affectedRows);        
          if (results1.affectedRows == 1) {
            //console.warn(results1.affectedRows);  
            count = count + 1
          }      
        });
      }
    });
  });
//console.log( " total Rows "+ count);
  if (count > 0) {
    errors.push(count+" Rows Inserted.");
    next();
  } else {
    errors.push("Rows Inserted.");
    next();
  }  
  
  res.redirect('/user-process');
  return; 
});
router.post('/user-process', function (req, res, next) {
  res.statusCode = 401;
  res.render('user-process', {
    title: 'user-process ',
    messages: errors
  });
  errors = [];
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
  var values = [req.body.user_id, month[1], month[0]];
  console.warn(values); 
  db.query(sqlQueryDelete, values, function (err, results, fields) {
    console.warn(results); 

    if (results.affectedRows > 0) {
        // res.redirect('/user-process-clear');
        // return;
        errors.push(results.affectedRows+" Rows Deleted.");
        next();
      } else {
        errors.push(err.message);
        next();
      }         
  });
 // res.redirect('/user-process-clear');
  return;
});
router.post('/user-process-clear', function (req, res, next) {
  res.statusCode = 401;
  res.render('user-process-clear', {
    title: 'change-password ',
    messages: errors
  });
  errors = [];
});

router.get('/member-info/:member_id', function (req, res, next) {  

  var sqlQuery = ` select m.meal_id,m.meal_date,m.breakfast,m.launch,m.dinner,u.user_fname
                        ,(select sum(m1.breakfast)/2 from meal m1 where m1.users_id =  ? and month(m1.meal_date) =  month(curdate()) and year(m1.meal_date) =  year(curdate())  and meal_date <= CURDATE() ) as totalBreakfast
                        ,(select sum(m2.launch) from meal m2 where m2.users_id =  ? and month(m2.meal_date) =  month(curdate()) and year(m2.meal_date) =   year(curdate())  and meal_date <= CURDATE()) as totalLaunch
                        ,(select sum(m3.dinner) from meal m3 where m3.users_id =  ? and month(m3.meal_date) =  month(curdate()) and year(m3.meal_date) =   year(curdate())   and meal_date <= CURDATE())  as totalDinner 
                        ,(select (sum(m4.breakfast)/2)+sum(m4.launch)+sum(m4.dinner) from meal m4 where m4.users_id =  ? and month(m4.meal_date) =  month(curdate()) and year(m4.meal_date) =  year(curdate())  and meal_date <= CURDATE())  as totalMeal 
                        from meal m inner join users u on u.user_id  = m.users_id
                        where m.users_id =  ? and month(m.meal_date) =  month(curdate()) and year(m.meal_date) =   year(curdate())  ORDER BY m.meal_date 
  `;
  var value = [req.params.member_id,req.params.member_id,req.params.member_id,req.params.member_id,req.params.member_id]
  db.query(sqlQuery,value, function (err, results, fields) {
    console.log(results);
    res.render('member-info', {
      title: 'member-info - ',
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id,
      meals: results
    });
  });
});
// router.post('/edit-meal/:meal_Id', function (req, res, next) {  
//   var breakfast = checkNagative(req.body.breakfast);
//   var lunch = checkNagative(req.body.lunch);
//   var dinner = checkNagative(req.body.dinner);

//   var sqlQuery = ` update meal set breakfast = ? , launch = ? , dinner = ?, update_by = ?, update_date  = ?  where  meal_id = ?  `;
//   var value = [breakfast,lunch,dinner,req.session.fname, new Date(),req.body.meal_id]
//   db.query(sqlQuery,value, function (err, results, fields) {
//     //console.log(results);
//     if (results.affectedRows == 1) {
//       res.redirect('/user-status');
//       return;
//     } else {
//       errors.push(err.message);
//       next();
//     }    
//   });
// });
// router.post('/edit-meal', function (req, res, next) {
//   res.statusCode = 401;
//   res.render('edit-meal', {
//     title: 'edit-meal ',
//     messages: errors
//   });
//   errors = [];
// });

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

function checkNagative(num){
  if(num<0){
    return 0;
  }else{
    return num;
  }
}