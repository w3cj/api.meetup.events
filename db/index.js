const monk = require('monk');

const db = monk(process.env.MONGO_URI || 'localhost/events');
module.exports = db;
