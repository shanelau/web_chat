var mysql = require('mysql'); 
var settings = require('../conf');  
var connection = mysql.createConnection({  
    host : settings.db_host,    
    database : settings.db_name,  
    user : settings.db_username,  
    password : settings.db_password  
});  
connection.connect(); 

module.exports.query = function (sqlStr,values,callback) {
	connection.query(sqlStr,values,callback);
}