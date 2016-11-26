//TEST
var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');
var path			= require('path');
var fs 				= require('fs');
var formidable		= require('formidable');
var morgan			= require('morgan');
var mongoose 		= require('mongoose');
var jwt				= require('jsonwebtoken');
var backend_router	= require('');
var product_router 	= require('./routes/product.js');
var product			= require('./models/product.js');
var user			= require('./models/user.js');
var media_router	= require('./routes/media.js');
var media_model		= require('./models/media.js');
var config			= require('./config.js');

//----- Express Init -----
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('superSecret', config.secret);
app.use(express.static(path.join(__dirname, 'public')));

//----- Init -----
var port = 4000;
mongoose.connect(config.database);

var frontend		= express.Router();
var backend			= express.Router();

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
	
app.route('/products/:prod_id')
	.get(function(req, res) {
		product.findById(req.params.prod_id, function(err, prod) {
			if(err) {res.send(err);}
			res.json(prod);
		})
	});


	
frontend.route('/')
	.get(function(req, res) {
		res.sendfile(path.join(__dirname + '/public/frontend/index.html'));
	});

app.use('/products', product_router);
app.use('/shop', frontend);
app.use('/admin', backend);
app.use('/media', media_router);

//----- Start -----
app.listen(port, function() {
	console.log('Listening on port ' + port);
});
