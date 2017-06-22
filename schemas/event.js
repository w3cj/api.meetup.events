const { requiredString, requiredDate, string } = require('./types');

module.exports = {
  type: 'object',
  properties: {
    title: Object.assign({
      description: 'The title or name of the event.'
    }, requiredString()),
    description: Object.assign({
      description: 'A description of the event. Can be HTML.'
    }, requiredString()),
    date: requiredDate(),
    start_time: requiredDate(),
    url: requiredString(),
    address: string(),
    location_name: string(),
    end_time: {
      type: ['string', 'date', 'number']
    },
    image: string(),
    meetup_name: Object.assign({
      description: 'The name of the group or organization that is organizing the event.'
    }, string()),
    price: string(),
    pending: {
      type: 'boolean',
      description: 'Events created without logging in are pending before they are approved by a logged in user.'
    }
  },
  additionalProperties: false
};
