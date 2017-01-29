var express 	= require('express');
var path 		= require('path');
var frontend	= express.Router();
	
frontend.route('/')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/../public/frontend/index.html'));
	});
	
frontend.route('/:prod_slug')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/../public/frontend/single.html'));
	});
	
module.exports = frontend;