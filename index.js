const express = require('express')
var app = express()

app.get('/', function(req, res) {
	res.send('nice es geht')
})

app.listen(4000, function() {
	console.log('Listening')
})
