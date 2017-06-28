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
  getUpcoming(offset = 6) {
    return this.events.find({
      date: {
        $gt: moment.utc().endOf('day').add(offset, 'hours')._d
      },
      pending: false
    });
  }
  getToday(offset = 6) {
    const $gte = moment.utc().startOf('day').add(offset, 'hours')._d;
    const $lte = moment.utc().endOf('day').add(offset, 'hours')._d;
    return this.events.find({
      date: {
        $gte,
        $lte,
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
      event.date = moment.utc(event.date)._d;
      event.start_time = moment.utc(event.start_time)._d;
      if (event.end_time) event.end_time = moment.utc(event.end_time)._d;
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
