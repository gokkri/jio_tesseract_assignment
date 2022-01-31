const bookingServices = require('../services/bookingServices');
let Queue = require('bull');
let REDIS_URL = 'redis://127.0.0.1:6379';
let reservedQueue = new Queue('reservedQueue', REDIS_URL);
let generalQueue = new Queue('generalQueue', REDIS_URL);
let maxJobsPerWorker = 1;

var Api = {

    pushNewItemsToQueue: async function (queueName, data) {

        console.log(queueName, data)

        try {

            if (queueName == "reservedQueue") {

                let job1 = await reservedQueue.add(data);
                console.log(job1.data)

            } else if (queueName == "generalQueue") {

                console.log(`hello`)

                let job2 = await generalQueue.add(data);
                console.log(job2.data)
            }



        } catch (error) {

            console.error(error);

        }

    },


    bookParkingSlotByWorker: async function (job) {

        try {

            // let job =     { bookingId:"ajhjasdh", userId: 10166, requestedTime: 1643617207 , userCategory :"RESERVED"}
            let userId = Number(job.userId);

            let filter = { parkingStatus: "AVAILABLE", parkingCategory: job.userCategory }
            let select = { parkingSlot: 1, _id: 0 }

            let fetchAvailableSlots = await bookingServices.getParkingSlots(filter, select)
            let fetchAvailableSlotsEasy = fetchAvailableSlots.map(x => x.parkingSlot)

            if (fetchAvailableSlotsEasy.length > 0) {

                let randomSlot = fetchAvailableSlotsEasy[Math.floor(Math.random() * fetchAvailableSlotsEasy.length)]
                let bookSlot = bookingServices.allotParkingToUser(randomSlot, userId)
                // let bookSlot = bookingServices.allotParkingToUser("P_1", userId)

            } else if (fetchAvailableSlotsEasy.length == 0 && job.userCategory == "RESERVED") {//meaning all reserved slots are booked

                //push RESERVED USER to general queue 
                //with high priority 
                //(priority: 1 meaning highest priority for reserved users in general queue)

                await generalQueue.add(job.userCategory, { priority: 1 });

            } else { //meaning all parking slots are booked

                console.log(`all parking slots are booked`)


            }

            //add log in DB

            //send communication to user

        } catch (error) {

            console.error(error);

        }

    },


}

reservedQueue.process(maxJobsPerWorker, async (job) => {

    console.log(job.data)

    job = job.data
    await Api.bookParkingSlotByWorker(job)

});

generalQueue.process(maxJobsPerWorker, async (job) => {

    console.log(job.data)

    job = job.data
    await Api.bookParkingSlotByWorker(job)

});






async function getCounterId(counterName) {
    var counterSeq;

    var data = await countersModel.findOneAndUpdate({ counterName: counterName }, { $inc: { counterSeq: 1 } }, { new: true }).lean();
    counterSeq = data.counterSeq;
    return counterSeq;
}

module.exports = Api;