const db = require('../db');

const Events = require('./Events');

module.exports = {
  Events: new Events(db)
};
