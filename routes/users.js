var express = require('express');
var router = express.Router();
var db = require('../db');
var helpers = require('../helpers');
var errors = [];

var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');

//router.get('/register', helpers.loginChecker, function (req, res, next) {
router.get('/register', function (req, res, next) {

  res.render('register', {
    title: 'Register User - '
  });

});

//router.post('/register', helpers.loginChecker, function (req, res, next) {
router.post('/register', function (req, res, next) {

  if (!helpers.checkForm([req.body.email, req.body.psw, req.body.pswrepeat, req.body.fname])) {
    errors.push('Please fill in all fields!');
    next();
    return;
  }

  if (!helpers.validateEmail(req.body.email)) {
    errors.push('Please enter a valid email address!');
    next();
    return;
  }

  if (req.body.psw !== req.body.pswrepeat) {
    errors.push('Passwords are not equal!');
    next();
    return;
  }

  var sqlQuery = `INSERT INTO users(user_id,user_email,user_pass,user_fname,user_nid,user_phone,user_phone2,user_dob) 
                  VALUES(NULL, ?, MD5(?), ?,?,?,?,?)`;
  var values = [req.body.email, req.body.psw, req.body.fname, req.body.nid, req.body.phone1, req.body.phone2, req.body.dob];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      errors.push(err.message);
      next();
      return;
    }

    if (results.affectedRows == 1) {
      res.redirect('/login');
      return;
    } else {
      errors.push(err.message);
      next();
    }

  });

});

router.post('/register', function (req, res, next) {

  res.statusCode = 401;

  res.render('register', {
    title: 'Register User - ',
    messages: errors
  });

  errors = [];

});

router.get('/login', helpers.loginChecker, function (req, res, next) {

  res.render('login', {
    title: 'Login - User - '
  });

});

router.post('/login', function (req, res, next) {

  if (!helpers.checkForm([req.body.email, req.body.psw])) {
    errors.push('Please fill in all fields!');
    next();
    return;
  }

  if (!helpers.validateEmail(req.body.email)) {
    errors.push('Please enter a valid email address!');
    next();
    return;
  }

  var sqlQuery = `SELECT * FROM users WHERE user_email = ? AND user_pass = MD5(?)`;
  var values = [req.body.email, req.body.psw];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      errors.push(err.message);
      next();
      return;
    }

    if (results.length == 1) {
      localStorage.setItem('fname',results[0].user_fname);
      localStorage.setItem('authorised',true);
      localStorage.setItem('user_id',results[0].user_id);
      // req.session.authorised = true;
      // req.session.fname = results[0].user_fname;
      // req.session.user_id = results[0].user_id;
      //console.warn('Local Stores test',localStorage.getItem('fname'));
      res.redirect('/');
      return;
    } else {
      errors.push('The username or password is incorrect.');
      next();
    }

  });

});

router.post('/login', function (req, res, next) {

  res.statusCode = 401;

  res.render('login', {
    title: 'Login - User - ',
    messages: errors
  });

  errors = [];

});

router.get('/exit', function (req, res, next) {
  localStorage.clear();
  res.redirect('/');
  // req.session.destroy(function (err) {
  //   localStorage.clear();
  //   res.redirect('/');
  // });

});

router.get('/change-password', function (req, res, next) {
  if (localStorage.getItem('authorised')==='true') {
    res.render('change-password', {
      title: localStorage.getItem('fname')+"'s Password Change ",
      authorised: localStorage.getItem('authorised'),
      fname: localStorage.getItem('fname'),
      user_id: localStorage.getItem('user_id'),
    });
  }
});
router.post('/change-password', function (req, res, next) {

  var sqlQuery = `SELECT * FROM users where user_id = ? and user_pass  =  MD5( ? );`;
  var values = [req.body.user_id, req.body.currPass];

  db.query(sqlQuery, values, function (err, results, fields) {
    console.log(results);
    if (results.length == 1) {
      res.render('change-password', {
        title: localStorage.getItem('fname')+"'s Password Change ",
        authorised: localStorage.getItem('authorised'),
        fname: localStorage.getItem('fname'),
        user_id: localStorage.getItem('user_id'),
        // title: req.session.fname+"'s Password Change ",
        // authorised: req.session.authorised,
        // fname: req.session.fname,
        // user_id: req.session.user_id,
        user:results
      });
      return;
    } else {
      errors.push('The or password is incorrect.');
      next();
    }
  });

});
router.post('/change-password', function (req, res, next) {

  res.statusCode = 401;

  res.render('change-password', {
    title: ' Change Password ',
    messages: errors
  });

  errors = [];

});


router.post('/confirm-password', function (req, res, next) {

  if (req.body.newPass !== req.body.confPass) {
    errors.push('Passwords are not equal!');
    next();
    return;
  }
  console.log(req.body)
  var sqlQuery = ` update  users set user_pass = MD5( ? ) where user_id = ? `;
  var values = [req.body.confPass, req.body.nuser_id];
  db.query(sqlQuery, values, function (err, results, fields) {
    if (err) {
      errors.push(err.message);
      next();
      return;
    }
    if (results.affectedRows == 1) {
      res.redirect('/');
      return;
    } else {
      errors.push(err.message);
      next();
    }
  });
});
router.post('/confirm-password', function (req, res, next) {

  res.statusCode = 401;

  res.render('change-password', {
    title: 'change-password ',
    messages: errors
  });

  errors = [];

});

module.exports = router;