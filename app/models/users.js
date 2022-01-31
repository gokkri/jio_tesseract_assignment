//Schema Setup
var mongoose = require('mongoose');

var Schema = mongoose.Schema({

    userId: {
        type: 'Number',
        required: true,
        unique: true
    },
    name: {
        type: 'String',
        required: true
    },
    userCategory: {
        type: 'String',
        required: true
    },
    userCategoryReason: {
        type: 'String',
        required: true
    },
    createdAt: {
        type: 'Number',
        required: true
    },
    userStatus: {
        type: 'String',
        required: true
    },
    userDetails: {
        mobile: {
            type: "String",
            required: true,
            //   unique: true,
            default: "NONE",
        },
        email: {
            type: "String",
            required: true,
            default: "NONE",
        },
        gender: {
            type: "String",
            required: true,
            default: "NONE",
        },
        profileImage: {
            type: "String",
            required: true,
            default: "NONE",
        },
    },

}, 
// { strict: false }
);

const uri = "mongodb+srv://gokkri:hello123*@cluster0.ok9vl.mongodb.net/users?retryWrites=true&w=majority";


var connection2 = mongoose.createConnection(uri, { useNewUrlParser: true });

module.exports = connection2.model('users', Schema, 'users');


//checking connections
connection2.on('error', console.error.bind(console, 'Connection error: '));
connection2.once('open', function (callback) {
    //The code in this asynchronous callback block is executed after connecting to MongoDB.
    console.log('Successfully connected to users DB ');
});