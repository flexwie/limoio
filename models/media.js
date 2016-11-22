var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('media', new Schema({
	name: Number,
	isUsed: Boolean,
	url: String
}));