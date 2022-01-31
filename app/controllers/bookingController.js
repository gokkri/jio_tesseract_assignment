const Services = require('../services/bookingServices');
const userServices = require('../services/userServices');
const bullQueueServices = require('../services/bullQueueServices');
const cron = require('node-cron');

const standardWaitTime = 30 //minutes
const shortendWaitTime = 15 // minutes

cron.schedule('* * * * *', () => {

        console.log('=========================================');
        console.log('cron called', new Date());
    
        controller.openSlotsForRebooking();
    
    });

var controller = {


    fetchParkingSlots: async function (req, res) {

        try {

            let status = req.params.status
            let filter = {}
            let select = {}

            if (!status || status == undefined || status == "ALL") {
                filter = {}
            } else {
                status = status.toUpperCase()
                filter = { parkingStatus: status }
            }

            let fetchParkingSlots = await Services.getParkingSlots(filter, select);

            return res.send({
                success: 1,
                data: fetchParkingSlots
            })

        } catch (error) {

            console.log(error)

            return res.send({
                success: 0,
                data: [],
                message: "someThing went wrong"
            })
        }
    },


    bookParkingSpot: async function (req, res) {

        try {

            let reqBody = req.body;

            //====================================
            // let reqBody = {
            //     userId:10166
            //     userId:10203
            // }
            //====================================

            let userId = Number(reqBody.userId)

            if (!userId) {
                return res.send({
                    success: 0,
                    data: [],
                    message: "please input userId"
                })
            }

            let getSpecificUser = await userServices.getSpecificUser(userId)
            if (!getSpecificUser) {
                return res.send({
                    success: 0,
                    data: [],
                    message: "user not found or deactivated."
                })
            }

            let checkIfAlreadyBookedFilter = { "bookingDetails.userId": userId, parkingStatus: { $in: ["PARKED", "BOOKED"] } }
            let checkIfAlreadyBookedSelect = {}
            let checkIfAlreadyBooked = await Services.getParkingSlots(checkIfAlreadyBookedFilter, checkIfAlreadyBookedSelect)

            if (checkIfAlreadyBooked.length > 0) {
                return res.send({
                    success: 0,
                    data: [],
                    message: "you already booked a parking slot bro."
                })
            }

            let filter = { parkingStatus: "AVAILABLE" }
            let select = {}
            let getAvailableSlots = await Services.getParkingSlots(filter, select);

            if (getAvailableSlots.length == 0) {
                return res.send({
                    success: 0,
                    data: [],
                    message: "No slots available"
                })
            }

            let reservedSlots = getAvailableSlots.filter(x => x.parkingCategory == "RESERVED")
            let generalSlots = getAvailableSlots.filter(x => x.parkingCategory == "GENERAL")

            let reservedSlotsEasy = reservedSlots.map(x => x.parkingSlot)
            let generalSlotsEasy = generalSlots.map(x => x.parkingSlot)

            let userCategory = getSpecificUser.userCategory
            let bookingId = (Math.random().toString(36).substr(2, 5)).toUpperCase()
            let bookingObject = {
                bookingId: bookingId,
                userId: userId,
                userCategory: userCategory,
                requestedTime: parseInt(Date.now() / 1000),
            }

            if (userCategory == "GENERAL") {

                bullQueueServices.pushNewItemsToQueue("generalQueue", bookingObject)

            } else if (userCategory == "RESERVED") {

                bullQueueServices.pushNewItemsToQueue("reservedQueue", bookingObject)

            }

            return res.send({
                success: 1,
                data: [bookingObject],
                message: "booking received"
            })


        } catch (error) {

            console.log(error)

            return res.send({
                success: 0,
                data: [],
                message: "someThing went wrong"
            })
        }
    },


    fetchBookingStatus: async function (req, res) {

        try {

            let userId = req.params.userId

            let fetchParkingSlots = await Services.getParkingSlots({ parkingStatus: "AVAILABLE" }, {});
            let fetchBookingStatus = await Services.getParkingSlots({ "bookingDetails.userId": userId }, { "_id": 0, "__v": 0 });

            if (fetchParkingSlots.length == 0 && fetchBookingStatus.length == 0) {

                return res.send({
                    success: 0,
                    data: [],
                    message: "All parking slots are booked"
                })

            } else if (fetchBookingStatus.length == 0) {

                return res.send({
                    success: 0,
                    data: [],
                    message: "No booking found for this userId"
                })

            }

            return res.send({
                success: 1,
                data: fetchBookingStatus
            })

        } catch (error) {

            console.log(error)

            return res.send({
                success: 0,
                data: [],
                message: "someThing went wrong"
            })
        }
    },

    openSlotsForRebooking: async function (req, res) {

        try {

            let waitingTimeReserved = standardWaitTime
            let waitingTimeGeneral = standardWaitTime

            let fetchAvailableSlotsCountReserved = await Services.getParkingSlotsCount({parkingStatus:"AVAILABLE", parkingCategory:"RESERVED"})
            let fetchAvailableSlotsCountGeneral = await Services.getParkingSlotsCount({parkingStatus:"AVAILABLE", parkingCategory:"RESERVED"})

            if(fetchAvailableSlotsCountReserved < 12){
                waitingTimeReserved = shortendWaitTime
            }
            if(fetchAvailableSlotsCountGeneral < 48){
                waitingTimeGeneral = shortendWaitTime
            }

            let waitTimeInSecondsReserved = waitingTimeReserved * 60
            let waitTimeInSecondsGeneral = waitingTimeGeneral * 60
            

            let openSlotsForRebookingGeneral = await Services.openSlotsForRebooking(waitTimeInSecondsGeneral, "GENERAL")
            let openSlotsForRebookingReserved = await Services.openSlotsForRebooking(waitTimeInSecondsReserved, "RESERVED")
            
        } catch (error) {
            console.log(error)
        }

    },
    //=====================================================================================================================

    createParkingSlots: async function (req, res) {

        try {


            var total = 120
            var reserved = 24
            var general = 96

            var createNumber = 72

            for (var i = 1; i <= createNumber; i++) {

                var slot = {
                    parkingCategory: "GENERAL",
                    // parkingCategory: "RESERVED",
                    parkingStatus: "AVAILABLE",
                }

                var createParkingSlots = await Services.createParkingSlots(slot);

            }


            console.log(`============================done====================================`)


        } catch (err) {

            console.log(err)

            return res.send({
                success: 0,
                data: "something went wrong"
            })
        }
    },


    bookParkingSlotByWorker: async function (req, res) {

        let data = await bullQueueServices.bookParkingSlotByWorker()

        return res.send(data)

    },


}

module.exports = controller;