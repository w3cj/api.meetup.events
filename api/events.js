const router = require('express').Router();

const { Events } = require('../models');
const { isLoggedIn } = require('../lib/auth');

router.get('/', (req, res) => {
  Events
    .getToday()
    .then(events => res.json(events));
});

router.get('/upcoming', (req, res) => {
  Events
    .getUpcoming()
    .then(events => res.json(events));
});

router.post('/', isLoggedIn, (req, res, next) => {
  Events
    .create(req.body)
    .then(event => res.json(event))
    .catch(next);
});

module.exports = router;
