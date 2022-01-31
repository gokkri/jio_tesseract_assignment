const bookingController = require('./controllers/bookingController');
const userController = require('./controllers/userController');

module.exports = function(app){


    //parking routes
    app.route('/parking/fetchParkingSlots/:status').get(bookingController.fetchParkingSlots);
    app.route('/parking/bookParkingSpot').post(bookingController.bookParkingSpot);
    app.route('/parking/fetchBookingStatus/:userId').get(bookingController.fetchBookingStatus);
    // app.route('/parking/turnOffOnlineBooking').post(userController.turnOffOnlineBooking);


    //user routes
    app.route('/users/getAllUsers/').get(userController.getAllUsers);
    
    
    
    


    //dummy routes==========================================================================================
    app.route('/users/createUsers').get(userController.createUser);
    app.route('/parking/createParkingSlots').get(bookingController.createParkingSlots);
    app.route('/bullQueue/bookParkingSlotByWorker').get(bookingController.bookParkingSlotByWorker);
    //dummy routes==========================================================================================

    

    
}