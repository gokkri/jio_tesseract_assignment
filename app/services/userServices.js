const UserModel = require('../models/users');
const countersModel = require('../models/counterModel');


var Services = {

    getSpecificUser: async function (userId) {

        try {

            let getSpecificUser = await UserModel.findOne({ userId: userId, userStatus: "ACTIVE" }).lean()

            // console.log (getSpecificUser)
            return getSpecificUser


        } catch (error) {

            console.log(error)
            return []

        }


    },
    createUser: async function (user) {

        try {

            let userId = await getCounterId("users")

            user.userId = userId

            let insertUser = await UserModel.create(user)

            console.log(insertUser)
            return insertUser


        } catch (error) {

            console.log(error)
            return 0

        }


    },

    getAllUsers: async function () {

        try {

            let getAllUsers = await UserModel.find({}).lean()

            return getAllUsers


        } catch (error) {

            console.log(error)
            return []

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

