var express 	= require('express');
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
	console.log(req);
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
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
/* 	console.log(req);
	console.log(req.files);
 	var form = new formidable.IncomingForm();
	form.multiples = true;
	form.uploadDir = path.join(__dirname, '/public/frontend/img/assets/');
	form.on('file', function(field, file) {
		var m = new media();
		m.name = file.name;
		m.url = file.name + '.jpg';
		m.isUsed = false;
		m.save(function(err) {
			if(err) {res.send(err); }
			console.log('Created');
		});
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});
	
	form.on('error', function(err) {
		console.log('Error: ' + err);
	});
	form.on('end', function() {
		res.json({ success : true, message : 'Uploaded' });
	}); */
	
	fs.readFile(req.files.Image.path, function(err, data) {
		var newPath = __dirname + '/';
		fs.writeFile(newPath, data, function(err) {
			res.json({ success : true, message : 'Uploaded'});
		});
	})
});

module.exports = media;
