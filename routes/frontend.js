var express 	= require('express');
var path 		= require('path');
var frontend	= express.Router();
	
frontend.route('/')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/../public/frontend/index.html'));
	});
	
frontend.route('/:prod_slug')
	.get(function(req, res) {
		product.findOne({slug : req.params.prod_slug}, function(err, prod) {
			if(err) {res.send(err);}
			res.json(prod);
		})
	});
	
module.exports = frontend;