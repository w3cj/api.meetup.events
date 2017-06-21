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
  price: Joi.string()
});

class Events {
  constructor(db) {
    this.events = db.get('events');
  }
  getUpcoming() {
    return this.events.find({
      date: {
        $gte: moment().endOf('day')
      }
    });
  }
  getToday() {
    return this.events.find({
      date: {
        $gte: moment().startOf('day'),
        $lt: moment().endOf('day')
      }
    });
  }
  create(event) {
    const result = Joi.validate(event, eventSchema);
    if (!result.error) {
      event.date = moment(event.date)._d;
      event.start_time = moment(event.start_time)._d;
      event.end_time = moment(event.end_time)._d;
      return this.events.insert(event);
    }
    return Promise.reject(result.error);
  }
}

module.exports = Events;
