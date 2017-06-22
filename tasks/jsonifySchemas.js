const fs = require('fs');
const schemas = require('../schemas');

Object.keys(schemas).forEach((name) => {
  fs.writeFileSync(`schemas/json/${name}.json`, JSON.stringify(schemas[name]));
});
