const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const auth = require('./auth');
const api = require('./api');

const { checkTokenSetUser } = require('./lib/auth');

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('doc'));
app.use(cors());

app.use(checkTokenSetUser);

app.use('/auth', auth);
app.use('/api/v1', api);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  res.status(err.status || res.statusCode || 500);
  res.json({
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : {}
  });
});

module.exports = app;
