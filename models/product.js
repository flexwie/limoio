var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var productSchema = new Schema({
	name: String,
	price: Number,
	picture: { size: String, url: String },
	created_at: Date,
	updated_at: Date
});

productSchema.pre('save', function(next) {
	var current = new Date();
	this.updated_at = current;
	
	if(!this.created_at) { this.created_at = current; }
	
	next();
});

module.exports = mongoose.model('Product', productSchema);