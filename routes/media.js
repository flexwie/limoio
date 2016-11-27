var express 	= require('express');
var formidable 	= require('formidable');
var jwt			= require('jsonwebtoken');
var fs 			= require('fs');
var config		= require('../config.js');
var path 		= require('path');
var media_model = require('../models/media.js');
var media 		= express.Router();

media.get('/:id', function(req, res) {
	media_model.findById(req.params.id, function(err, m) {
		if(err) {res.send(err);}
		res.sendfile(path.join(__dirname, '../public/frontend/img/assets/' + m.url));
	})
});

media.get('/', function(req, res) {
	media_model.find({}, function(err, med) {
		if(err) {res.json({success : false, message: 'Couldnt fetch media ' + err});}
		console.log(med);
		res.json(med);
	});
});

media.use(function(req, res, next) {
	var token = req.cookies.token;
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

media.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();

	form.parse(req);

	form.on('fileBegin', function (name, file) {
		file.path = path.join(__dirname + '/../public/frontend/img/assets/' + file.name);
		var m = new media_model();

		m.name = Math.floor(Math.random() * (100000 - 1) + 1);
		m.url = file.name;
		m.isUsed = false;

		m.save(function(err) {
			if(err) {res.send(err); }
			console.log('Created DB entry');
		});
	});

	form.on('file', function (name, file) {
		console.log('Uploaded ' + file.name);
	});

	res.redirect('/admin');
});

media.delete('/:id', function (req, res) {
	var url = '';
	media_model.findById(req.params.id, function(err, m) {
		if(err) { console.log(err); }
		url = m.url;
	});

	media_model.remove({
		_id: req.params.id
	}, function(err, m) {
		if(err) {res.send(err);}
		fs.unlink(path.join(__dirname + '/../public/frontend/img/assets/' + url));
		res.json({ success: true, message: 'Deleted'});
	});
});

module.exports = media;
