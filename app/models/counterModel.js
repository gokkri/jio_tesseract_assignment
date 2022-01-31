//Schema Setup
var mongoose = require('mongoose');

var counterSchema = mongoose.Schema({}, {strict:false});

const uri = "mongodb+srv://gokkri:hello123*@cluster0.ok9vl.mongodb.net/users?retryWrites=true&w=majority";


var connection2 = mongoose.createConnection(uri, { useNewUrlParser: true });

module.exports= connection2.model('counters', counterSchema, 'counters');


//checking connections
connection2.on('error', console.error.bind(console, 'Connection error: '));
connection2.once('open', function(callback) {
//The code in this asynchronous callback block is executed after connecting to MongoDB.
console.log('Successfully connected to counters MongoDB /.');
});