var express = require('express');
var router = express.Router();
var userDao=require('../service/dao/UserDao.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{ title: 'index'});
});

router.get('/login', function(req, res) {
  res.render('login',{ title: 'login', message: ''});
});

router.get('/reg', function(req, res) {
  res.render('reg',{ title: 'register', message: ''});
});

router.get('/home', function(req, res) {
  if (!req.session.username) {
        res.render('login',{ title: 'login',message:
            '请先登录'});
        return;
  }
  res.render('home',{ title: 'Simple Chat', username: req.session.username});
});

router.get('/logout', function(req, res) {
	  req.session.username=null;
  	res.redirect('/');
});

router.post('/doLogin', function(req, res) {
	var usernameForm = req.body.username;
	var passwordForm = req.body.password;
	var userForm = [usernameForm,passwordForm];

  	if(!usernameForm || !passwordForm){
		res.render('login',{ title: 'login',message:'用户名或密码不允许为空'});
  	}

  	userDao.loginUser(userForm,function(err,result){
  		//console.log(result.username+'    '+result.password);
  		console.log(result);
  		if(result!=null && result.length>0){
  			req.session.username=usernameForm;
			  //res.render('home',{ title: 'home',username:usernameForm});
        res.redirect('/home');
  		}else{
			res.render('login',{ title: 'login',message:
				'用户不存在或密码错误'});
  		}
  	});
});

router.post('/doReg', function(req, res) {
	var username = req.body.username;
	var	password = req.body.password;
	var	repassword = req.body.repassword;
	var user = [username,password,repassword];

	if(!username || !password || !repassword){
		res.render('reg',{ title: 'register',message:'用户名或密码不允许为空'});
  	}

  	if(password!==repassword){
  		res.render('reg',{ title: 'register',message:'两次密码不一致'});
  	}

  	userDao.findUserByUsername(user,function(err,result){
  		if(result!=null && result.length>0){
  			res.render('reg',{ title: 'register',message:'用户已存在'});
  		}else{
			userDao.saveUser(user,function(err,result){
				if(err){
          console.log('error when reg:::'+err);
					res.render('reg',{ title: 'register',message:'注册失败'});
				}else{
					res.render('login',{ title: 'login',message:'注册成功'});
				}
			});
  		}
  	});

});

module.exports = router;
