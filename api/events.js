const router = require('express').Router();

const { Events } = require('../models');
const { isLoggedIn } = require('../lib/auth');
const { getMeetup } = require('../lib/meetup');

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

router.post('/', (req, res, next) => {
  Events
    .create(req.body, !req.user)
    .then(event => res.json(event))
    .catch(next);
});

router.post('/url', (req, res, next) => {
  getMeetup(req.body.url)
    .then(event => Events.create(event, !req.user))
    .then(event => res.json(event))
    .catch(next);
});

router.post('/:id/approve', isLoggedIn, (req, res, next) => {
  Events
    .approve(req.params.id)
    .then(event => res.json(event))
    .catch(next);
});

router.put('/:id', isLoggedIn, (req, res, next) => {
  Events
    .update(req.params.id, req.body)
    .then(event => res.json(event))
    .catch(next);
});

router.delete('/:id', isLoggedIn, (req, res, next) => {
  Events
    .delete(req.params.id)
    .then(event => res.json(event))
    .catch(next);
});

module.exports = router;
