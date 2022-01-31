'use strict';
var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

var multer = require('multer');
var form = multer();
var bodyParser = require('body-parser');


process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

var args = process.argv.slice(2);
var env=args[0];
var port=args[1];

if(!env){
     env="dev";
}

var port="6004";

console.log("Port:"+port+"env:"+env);

exports.env = env;

// var db = require('./database/mongoConnect');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(form.array());

var routes = require('./app/routes');
routes(app);


//listening on port
app.listen(port, function() {
   console.log(`parking api started on port-${port} --${(env).toUpperCase()}`);
});