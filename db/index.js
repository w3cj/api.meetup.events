const monk = require('monk');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI || 'localhost/events');
module.exports = db;
