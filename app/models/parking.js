//Schema Setup
var mongoose = require('mongoose');

var Schema = mongoose.Schema({


    parkingSlot: {
        type: 'String',
        required: true,
        unique: true
    },
    parkingCategory: {
        type: 'String',
        required: true
    },
    parkingStatus: {
        type: 'String',
    },
    bookingDetails: {
        userId: {
            type: "Number",
            required: true,
            //   unique: true,
            default: 0,
        },
        bookedTime: {
            type: 'Number',
            default: 0

        },
        bookingAutoExpiredTime: {
            type: 'Number',
            default: 0
        },
        parkedTime: {
            type: 'Number',
            default: 0
        },
        vacatedTime: {
            type: 'Number',
            default: 0
        },
    }

},
    // {strict:false}
);

const uri = "mongodb+srv://gokkri:hello123*@cluster0.ok9vl.mongodb.net/users?retryWrites=true&w=majority";


var connection2 = mongoose.createConnection(uri, { useNewUrlParser: true });

module.exports = connection2.model('parkingSlots', Schema, 'parkingSlots');


//checking connections
connection2.on('error', console.error.bind(console, 'Connection error: '));
connection2.once('open', function (callback) {
    //The code in this asynchronous callback block is executed after connecting to MongoDB.
    console.log('Successfully connected to counters MongoDB /.');
});