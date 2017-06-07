var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var session = require('express-session');
// var config = require('./config');

// var port = 4000;

var app = module.exports = express();
// var app = express();
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
