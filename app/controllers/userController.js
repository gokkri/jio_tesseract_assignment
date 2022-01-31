const Services = require('../services/userServices');
const cron = require('node-cron');


var controller = {


    getAllUsers: async function (req, res) {

        try {

                let getAllUsers = await Services.getAllUsers();

                return res.send({
                    success:1,
                    data:getAllUsers
                })

        } catch (error) {

            console.log(error)

            return res.send({
                success: 0,
                data:[],
                message: "someThing went wrong"
            })
        }
    },


    //=====================================================================================================================

    createUser: async function (req, res) {

        try {

            var createNumber = 150

            for (var i = 1; i <= createNumber; i++) {

                var user = {
                    name: `test_${i}`,
                    userCategory: "GENERAL",
                    userCategoryReason: "GENERAL",
                    createdAt: parseInt(Date.now() / 1000),
                    userStatus: "ACTIVE"
                }

                var createUser = await Services.createUser(user);

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


 





}

module.exports = controller;