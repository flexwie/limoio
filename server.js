//TEST
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var path		= require('path');
var fs 			= require('fs');
var formidable	= require('formidable');
var morgan		= require('morgan');
var mongoose 	= require('mongoose');
var jwt			= require('jsonwebtoken');
var product		= require('./models/product.js');
var user		= require('./models/user.js');
var media_m		= require('./models/media.js');
var config		= require('./config.js');

//----- Express Init -----
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('superSecret', config.secret);
app.use(express.static(path.join(__dirname, 'public')));

//----- Init -----
var port = 4000;
mongoose.connect(config.database);

var protectedRoutes = express.Router();
var frontend		= express.Router();
var backend			= express.Router();
var media			= express.Router();

//----- Routes -----
app.get('/', function(req, res) {
	res.redirect('/shop');
});

backend.route('/')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/public/backend/index.html'));
	})
	.post(function(req, res) {
		user.findOne({name : req.body.name}, function(err, user) {
			if(err) throw err;
			
			if(!user) {
				res.json({ success : false, message : 'User not found' });
			} else if(user) {
				if(user.password != req.body.password) {
					res.json({ success : false, message : 'Wrong password' });
				} else {
					var token = jwt.sign(user, app.get('superSecret'), { expiresIn : 60*60*24 });
					res.json({ success : true, message : 'User logged in', token : token });
				}
			}
		});
	});

protectedRoutes.use(function(req, res, next) {
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

media.get('/:id', function(req, res) {
	
});

media.get('/', function(req, res) {
	media_m.find({}, function(err, med) {
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

//Routes handling API Auth
app.route('/auth')
	.post(function(req, res) {
	});

//Routes handling users (CRUD)
/* app.route('/users')
	.get(function(req, res) {
		user.find({}, function(err, users) {
			res.json(users);
		});
	}); */
	
//Public product routes
app.route('/products')
	.get(function(req, res) {
		product.find(function(err, prod) {
			if(err) {res.send(err);}
			
			res.json(prod);
		});
	});
	
app.route('/products/:prod_id')
	.get(function(req, res) {
		product.findById(req.params.prod_id, function(err, prod) {
			if(err) {res.send(err);}
			res.json(prod);
		})
	});

//Routes handling products (CRUD)
protectedRoutes.route('/products')
	.post(function(req, res) {
		var prod = new product();
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

protectedRoutes.route('/products/:prod_id')
	.put(function(req, res) {
		product.findById(req.params.prod_id, function(err, prod) {
			if(err) {res.send(err);}
			prod.name = req.body.name;
			prod.price = req.body.price;
			//TODO add img
			prod.save(function(err) {
				if(err) {res.json({ success: false, message: 'Update failed ' + err});}
				res.json({ success: true, message: 'Updated' });
			});
		})
	})
	.delete(function(req, res) {
		product.remove({
			_id: req.params.prod_id
		}, function(err, prod) {
			if(err) {res.send(err);}
			res.json({ message: 'Deleted'});
		});
	});
	
frontend.route('/')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/public/frontend/index.html'));
	});

app.use('/protected', protectedRoutes);
app.use('/shop', frontend);
app.use('/admin', backend);
app.use('/media', media);

//----- Start -----
app.listen(port, function() {
	console.log('Listening on port ' + port);
});
