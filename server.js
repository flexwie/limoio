var express 		= require('express');
var app 			= express();
var bodyParser 		= require('body-parser');
var path			= require('path');
var cookieParser	= require('cookie-parser');
var fs 				= require('fs');
var formidable		= require('formidable');
var morgan			= require('morgan');
var mongoose 		= require('mongoose');
var jwt				= require('jsonwebtoken');
var backend_router	= require('./routes/backend.js');
var frontend_router	= require('./routes/frontend.js');
var product_router 	= require('./routes/product.js');
var product			= require('./models/product.js');
var user			= require('./models/user.js');
var media_router	= require('./routes/media.js');
var media_model		= require('./models/media.js');
var config			= require('./config.js');

//----- Express Init -----
app.use(cookieParser());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(morgan('dev'));
app.set('superSecret', config.secret);
app.use(express.static(path.join(__dirname, 'public')));

//----- Init -----
var port = 4000;
mongoose.connect(config.database);

//----- Routes -----
app.get('/', function(req, res) {
	res.redirect('/shop');
});

app.use('/products', product_router);
app.use('/shop', frontend_router);
app.use('/admin', backend_router);
app.use('/media', media_router);

//----- Start -----
app.listen(port, function() {
	console.log('Listening on port ' + port);
});
