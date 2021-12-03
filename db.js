const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mes_management_system'
});

module.exports = connection;



// const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'mmohibur_mesuser',
//   password: 'mW3)qapDT5sj',
//   database: 'mmohibur_mesdb'
// });

// module.exports = connection;