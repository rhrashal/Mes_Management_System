var express = require('express');
var router = express.Router();
var db = require('../db');
var errors = [];

router.get('/', function (req, res, next) {

  var sqlQuery = `SELECT * FROM users where user_fname<>'Admin' order by user_fname `;

  db.query(sqlQuery, function (err, results, fields) {

    res.render('index', {
      title: "Mes Management System- ",
      authorised: req.session.authorised,
      fname: req.session.fname,
      user_id: req.session.user_id,
      users: results
    });

  });

});

router.get('/user-status', function (req, res, next) {

  if (req.session.authorised) {
    
    var sqlQuery = ` set @userID := ?, @monthId := ? , @yearId := ? ;  `;
    const d = new Date();
    var values = [req.session.user_id, d.getMonth() + 1, d.getFullYear()];
    db.query(sqlQuery, values, function (err, results, fields) {
      //console.warn(results.serverStatus);
      if(results.serverStatus==2){
        var sqlQuery1 = ` select m.meal_id,m.meal_date,m.breakfast,m.launch,m.dinner
                        ,(select sum(m1.breakfast)/2 from meal m1 where m1.users_id =  @userID and month(m1.meal_date) =  @monthId and year(m1.meal_date) =  @yearId   and meal_date <= CURDATE() ) as totalBreakfast
                        ,(select sum(m2.launch) from meal m2 where m2.users_id =  @userID and month(m2.meal_date) =  @monthId and year(m2.meal_date) =  @yearId   and meal_date <= CURDATE()) as totalLaunch
                        ,(select sum(m3.dinner) from meal m3 where m3.users_id =  @userID and month(m3.meal_date) =  @monthId and year(m3.meal_date) =  @yearId   and meal_date <= CURDATE())  as totalDinner 
                        ,(select (sum(m4.breakfast)/2)+sum(m4.launch)+sum(m4.dinner) from meal m4 where m4.users_id =  @userID and month(m4.meal_date) =  @monthId and year(m4.meal_date) =  @yearId   and meal_date <= CURDATE())  as totalMeal 
                        from meal m where m.users_id =  @userID and month(m.meal_date) =  @monthId and year(m.meal_date) =  @yearId  `;
        db.query(sqlQuery1, function (err, results1, fields) {
          //console.warn(results1);
          res.render('user-status', {
            title: 'User Meal Status - ',
            authorised: req.session.authorised,
            fname: req.session.fname,
            user_id: req.session.user_id,
            meals: results1
          });
        });
      }
      
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
    //console.log(results);
    res.render('edit-meal', {
      title: 'Meal Edit - ',
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
    //console.log(results);
    if (results.affectedRows == 1) {
      res.redirect('/user-status');
      return;
    } else {
      errors.push(err.message);
      next();
    }    
  });
});

router.post('/daly-status', function (req, res, next) {
  //console.log(req.body.dateInfo)
  if (req.session.authorised) {    
    var sqlQuery = ` set @DateFilter := ? ;   `;
    var values = [];
    var d = new Date();
    if(req.body.dateInfo == ""){
      values = [d.getFullYear()+"-"+(d.getMonth()+1).toString()+"-"+d.getDate()];
    }else{
      values = [req.body.dateInfo];
    }
    //console.log(values)    
    db.query(sqlQuery, values, function (err, results, fields) {
      //console.warn(results.serverStatus);
      if(results.serverStatus==2){
        var sqlQuery1 = `  select  u.user_id ,u.user_fname,m.meal_id,m.meal_date,m.breakfast,m.launch,m.dinner
                        ,(select sum(m1.breakfast) from meal m1 where m1.meal_date =  @DateFilter ) as totalBreakfast
                        ,(select sum(m2.launch) from meal m2 where m2.meal_date =  @DateFilter ) as totalLaunch
                        ,(select sum(m3.dinner) from meal m3 where m3.meal_date =  @DateFilter )  as totalDinner 
                        ,(select (sum(m4.breakfast)/2)+sum(m4.launch)+sum(m4.dinner) from meal m4 where m4.meal_date =  @DateFilter )  as totalMeal 
                        from meal m inner join users u on u.user_id  = m.users_id 
                        where m.meal_date =  @DateFilter  `;
        db.query(sqlQuery1, function (err, results1, fields) {
          //console.warn(results1);
          res.render('daly-status', {
            title: 'User Meal Status - ',
            authorised: req.session.authorised,
            fname: req.session.fname,
            user_id: req.session.user_id,
            meals: results1
          });
        });
      }
      
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


router.post('/monthly-Status', function (req, res, next) {

  console.log(req.body)

  if (req.session.authorised) {
    
    var sqlQuery = ` set @userID := ?, @monthId := ? , @yearId := ? ;   `;
    const d = new Date();
    var values = [];
    if(req.body.monthInfo == ""){
      values = [req.body.user_id, d.getMonth() + 1, d.getFullYear()];
    }else{
      var month = req.body.monthInfo.split("-");
      values = [req.body.user_id, month[1], month[0]];
    }
    db.query(sqlQuery, values, function (err, results, fields) {
      //console.warn(results.serverStatus);
      if(results.serverStatus==2){
        var sqlQuery1 = ` select m.meal_id,m.meal_date,m.breakfast,m.launch,m.dinner,u.user_fname
                        ,(select sum(m1.breakfast)/2 from meal m1 where m1.users_id =  @userID and month(m1.meal_date) =  @monthId and year(m1.meal_date) =  @yearId   and meal_date <= CURDATE() ) as totalBreakfast
                        ,(select sum(m2.launch) from meal m2 where m2.users_id =  @userID and month(m2.meal_date) =  @monthId and year(m2.meal_date) =  @yearId   and meal_date <= CURDATE()) as totalLaunch
                        ,(select sum(m3.dinner) from meal m3 where m3.users_id =  @userID and month(m3.meal_date) =  @monthId and year(m3.meal_date) =  @yearId   and meal_date <= CURDATE())  as totalDinner 
                        ,(select (sum(m4.breakfast)/2)+sum(m4.launch)+sum(m4.dinner) from meal m4 where m4.users_id =  @userID and month(m4.meal_date) =  @monthId and year(m4.meal_date) =  @yearId   and meal_date <= CURDATE())  as totalMeal 
                        from meal m inner join users u on u.user_id  = m.users_id
                        where m.users_id =  @userID and month(m.meal_date) =  @monthId and year(m.meal_date) =  @yearId   `;
        db.query(sqlQuery1, function (err, results1, fields) {
          //console.warn(results1);
          res.render('monthly-status', {
            title: 'User Meal Status - ',
            authorised: req.session.authorised,
            fname: req.session.fname,
            user_id: req.session.user_id,
            meals: results1
          });
        });
      }
      
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

router.get('/add-meal', function (req, res, next) {  
  res.render('add-meal', {
    title: 'Add meal - ',
    authorised: req.session.authorised,
    fname: req.session.fname,
    user_id: req.session.user_id,
  });
});

router.post('/add-meal', function (req, res, next) {  
  var breakfast = checkNagative(req.body.breakfast);
  var lunch = checkNagative(req.body.lunch);
  var dinner = checkNagative(req.body.dinner);


  var sqlQuery = `select count(meal_id) dt from meal m where m.users_id = ? and meal_date = cast(? as date)`;
    var values = [req.session.user_id, req.body.dateInfo];
    console.warn(values);
    db.query(sqlQuery, values, function (err, results, fields) {
       console.warn(results);        
      if (results[0].dt == 0) {
        var sqlQueryinsert = `insert into meal(meal_id,users_id,meal_date,breakfast,launch,dinner,add_by,add_date,isdelete) 
                              values (null,?,?,?,?,?,?,?,0)  `;
        var values1 = [req.session.user_id, req.body.dateInfo,breakfast,lunch,dinner,req.session.fname, new Date()];
        db.query(sqlQueryinsert, values1, function (err, results1, fields) {
          console.warn(results1.affectedRows);        
          if (results.affectedRows > 0) {
            errors.push(results.affectedRows+" Rows Inserted.");
            next();
          } else {
            errors.push(err.message);
            next();
          }     
        });
      }else{
        errors.push("Meal Already Exist");
        next();
      }
    });
    next();
});


router.post('/add-meal', function (req, res, next) {
  res.statusCode = 401;
  res.setHeader("Content-Type", "text/html");
  res.render('add-meal', {
    title: 'add-meal ',
    messages: errors
  });
  errors = [];
});

module.exports = router;







function checkNagative(num){
  if(num<0){
    return 0;
  }else{
    return num;
  }
}
