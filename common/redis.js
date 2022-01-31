'use strict'
const redis = require('redis');
const util = require('util');
const client = redis.createClient();
const getAsync = util.promisify(client.get).bind(client);

client.on('connect', function () {
    console.log('Redis client connected');
});

client.on('error', function () {
    console.log('Error connecting redis');
});

var redisFunctions = {

    setKey: async function (key, value, ttl) {

        try {

            await client.set(key, value);

            await client.expire(key, ttl);

            return 1;

        } catch (e) {

            console.log(e);
            return 0;
        }
    },

    getKey: async function (key) {

        var data;

        try {

            data = await getAsync(key);

        } catch (e) {
            console.log(e);
        }

        return data;
    }
};

module.exports = redisFunctions;