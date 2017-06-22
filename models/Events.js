const monk = require('monk');
const Joi = require('joi');
const moment = require('moment');

const eventSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  url: Joi.string().uri().required(),
  address: Joi.string().required(),
  location_name: Joi.string().required(),
  image: Joi.string().uri(),
  meetup_name: Joi.string(),
  price: Joi.string(),
  pending: Joi.boolean()
});

class Events {
  constructor(db) {
    this.events = db.get('events');
    this.events.createIndex('url', { unique: true });
  }
  getUpcoming() {
    return this.events.find({
      date: {
        $gte: moment().endOf('day')._d
      }
    });
  }
  getToday() {
    return this.events.find({
      date: {
        $gte: moment().startOf('day')._d,
        $lt: moment().endOf('day')._d
      }
    });
  }
  create(event, pending) {
    const result = Joi.validate(event, eventSchema);
    if (!result.error) {
      event.date = moment(event.date)._d;
      event.start_time = moment(event.start_time)._d;
      event.end_time = moment(event.end_time)._d;
      event.pending = pending;
      return this.events.insert(event);
    }
    return Promise.reject(result.error);
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
    const result = Joi.validate(event, eventSchema);
    if (!result.error) {
      delete event._id;
      return this.events.findOneAndUpdate({
        _id: monk.id(_id)
      }, event);
    }
    return Promise.reject(result.error);
  }
  delete(_id) {
    return this.events.findOneAndDelete({
      _id: monk.id(_id)
    });
  }
}

module.exports = Events;
