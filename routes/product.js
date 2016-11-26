var express 		= require('express');
var path 			= require('path');
var jwt				= require('jsonwebtoken');
var config			= require('../config.js');
var product_model 	= require('../models/product.js');
var product			= express.Router();

product.route('/')
	.get(function(req, res) {
		product_model.find(function(err, prod) {
			if(err) {res.send(err);}
			
			res.json(prod);
		});
	});

//---------------------------------------
//USE PROTECTTION
//---------------------------------------

product.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if(err) {
				return res.json({ success : false, message : 'Token false' });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({ success : false, message : 'No token provided' });
	}
});

//Routes handling products (CRUD)
product.route('/')
	.post(function(req, res) {
		var prod = new product_model();
		prod.name = req.body.name;
		prod.price = req.body.price;
		//TODO implement several img sizes
		prod.picture.size = 'big';
		//TODO upload file to static dir, change name to random number, ceck if number already exists
		prod.picture.url = req.body.picture_url;
		prod.created_at = new Date();
		
		prod.save(function(err) {
			if(err) {res.send(err); }
			res.json({ success: true, message: 'Created' });
		});
	});

product.route('/:prod_id')
	.post(function(req, res) {
		product_model.findById(req.params.prod_id, function (err, prod){
			//if(err) {res.send(err);}
			prod.name = req.body.name;
			prod.price = req.body.price;
			//TODO add img
			prod.save(function(err) {
				if(err) {res.json({ success: false, message: 'Update failed ' + err});}
				res.json({ success: true, message: 'Updated' });
			});
		});
	})
	.delete(function(req, res) {
		product_model.remove({
			_id: req.params.prod_id
		}, function(err, prod) {
			if(err) {res.send(err);}
			res.json({ message: 'Deleted'});
		});
	});


module.exports = product;