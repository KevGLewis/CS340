var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_lewikevi',
    password        : '4082',
    database        : 'cs340_lewikevi',
    dateStrings     : 'date'
});

module.exports.pool = pool;
