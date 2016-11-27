var express 		= require('express');
var path 			= require('path');
var cookieParser	= require('cookie-parser');
var jwt				= require('jsonwebtoken');
var config			= require('../config.js');
var user_model 		= require('../models/user.js');
var backend			= express.Router();

backend.route('/')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/../public/backend/index.html'));
	})
	.post(function(req, res) {
		user_model.findOne({name : req.body.name}, function(err, user) {
			if(err) throw err;
			
			if(!user) {
				res.json({ success : false, message : 'User not found' });
			} else if(user) {
				if(user.password != req.body.password) {
					res.json({ success : false, message : 'Wrong password' });
				} else {
					var token = jwt.sign(user, config.secret, { expiresIn : 60*60*24 });
					res.clearCookie('token').cookie('token', token, {expire : 60 * 60 *24 }).redirect('/admin');
				}
			}
		});
	});

backend.route('/login')
	.get(function (req, res) {
		var token = req.cookies.token;
		if( token ) {
			jwt.verify(token, config.secret, function (err, decoded) {
				if(err) { console.log(err); }
				res.redirect('/admin');
			});
		}
		res.sendfile(path.join(__dirname + '/../public/backend/login.html'));
	});
	
module.exports = backend;