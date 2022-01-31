const ParkingModel = require('../models/parking');
const countersModel = require('../models/counterModel');


var Services = {



    getParkingSlots: async function (filter, select) {

        try {

            let getParkingSlots = await ParkingModel.find(filter, select).lean()

            return getParkingSlots


        } catch (error) {

            console.log(error)
            return []

        }


    },

    allotParkingToUser: async function (parkingSlot, userId) {

        try {

            let allotParkingToUser = await ParkingModel.updateOne({ parkingSlot: parkingSlot, parkingStatus: "AVAILABLE" },
                {
                    $set: {
                        parkingStatus: "BOOKED",
                        "bookingDetails.userId": userId,
                        "bookingDetails.bookedTime": parseInt(Date.now() / 1000),
                    }
                })
            console.log(allotParkingToUser)
            return (allotParkingToUser)

        } catch (error) {
            console.log(error)
        }

    },

    getParkingSlotsCount: async function (filter) {

        try {

            let getParkingSlots = await ParkingModel.count(filter).lean()

            return getParkingSlots


        } catch (error) {

            console.log(error)
            return 0

        }


    },

    openSlotsForRebooking: async function (waitTime, parkingCategory) {

        try {

            let now = parseInt(Date.now()/1000)
            let expiryTime = now - waitTime

            let update = await ParkingModel.updateMany({
                parkingStatus:"BOOKED",
                parkingCategory:parkingCategory,
                "bookingDetails.bookedTime":{$lte:expiryTime}
            },{
                $set:{
                    parkingStatus:"AVAILABLE",
                    "bookingDetails.bookingAutoExpiredTime":parseInt(Date.now()/1000),
                    "bookingDetails.userId":0,
                }
            })

            console.log(update)
            
        } catch (error) {

            console.log(error)
            
        }

    },
    


    createParkingSlots: async function (slot) {

        try {

            let parkingSlot = await getCounterId("parkingSlot")

            slot.parkingSlot = `P_${parkingSlot}`

            let insertParkingSlot = await ParkingModel.create(slot)

            console.log(insertParkingSlot)
            return insertParkingSlot


        } catch (error) {

            console.log(error)
            return 0

        }


    },

}




async function getCounterId(counterName) {
    var counterSeq;

    var data = await countersModel.findOneAndUpdate({ counterName: counterName }, { $inc: { counterSeq: 1 } }, { new: true }).lean();
    counterSeq = data.counterSeq;
    return counterSeq;
}







module.exports = Services;

