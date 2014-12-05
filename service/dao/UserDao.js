var db = require('../db');

module.exports.findUserByUsername = function(user,callback){
	db.query('select * from user where username=?',user,callback);
};

module.exports.loginUser = function(user,callback){
	db.query('select * from user where username=? and password=?',user,callback);
};

module.exports.saveUser = function(user,callback){
	db.query('insert into user(username,password,time) values(?,?,now())',user,callback);
};
