const monk = require('monk');
const moment = require('moment');

const { validate } = require('jsonschema');
const schemas = require('../schemas');
const { validationError } = require('../schemas/utils');

class Events {
  constructor(db) {
    this.events = db.get('events');
    this.events.createIndex({ url: 1 }, { unique: true });
  }
  getUpcoming() {
    return this.events.find({
      date: {
        $gte: moment().endOf('day')._d
      },
      pending: false
    });
  }
  getToday() {
    return this.events.find({
      date: {
        $gte: moment().startOf('day')._d,
        $lt: moment().endOf('day')._d
      },
      pending: false
    });
  }
  suggested() {
    return this.events.find({
      pending: true
    });
  }
  create(event, pending) {
    const result = validate(event, schemas.event);
    if (result.errors.length === 0) {
      event.date = moment(event.date)._d;
      event.start_time = moment(event.start_time)._d;
      if (event.end_time) event.end_time = moment(event.end_time)._d;
      event.pending = pending;
      return this.events.insert(event);
    }
    return validationError(result.errors, 'event');
  }
  approve(_id) {
    return this.events.findOneAndUpdate({
      _id: monk.id(_id)
    }, {
      $set: {
        pending: false
      }
    });
  }
  update(_id, event) {
    const result = validate(event, schemas.event);
    if (result.errors.length === 0) {
      delete event._id;
      return this.events.findOneAndUpdate({
        _id: monk.id(_id)
      }, event);
    }
    return validationError(result.errors, 'event');
  }
  delete(_id) {
    return this.events.findOneAndDelete({
      _id: monk.id(_id)
    });
  }
}

module.exports = Events;
