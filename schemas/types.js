function requiredString() {
  return {
    type: 'string',
    required: true
  };
}

function requiredDate() {
  return {
    type: ['string', 'date', 'number'],
    required: true
  };
}


function string() {
  return {
    type: 'string'
  };
}

module.exports = {
  requiredDate,
  requiredString,
  string
};
