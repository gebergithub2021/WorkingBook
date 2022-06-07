const expressRedisCache = require('express-redis-cache');
const redis = require('./redis');

const cache=expressRedisCache({
    client:redis,
    expire:120
});

module.exports=cache;