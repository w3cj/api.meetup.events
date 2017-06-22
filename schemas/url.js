const { requiredString } = require('./types');

module.exports = {
  type: 'object',
  properties: {
    url: requiredString()
  }
};
