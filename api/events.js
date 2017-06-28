const router = require('express').Router();

const { Events } = require('../models');
const { isLoggedIn } = require('../lib/auth');
const { getMeetup } = require('../lib/meetup');

/**
 * @api {get} /events Get all events today
 * @apiName GetEvents
 * @apiGroup Events
 * @apiExample {json=../schemas/examples/eventArray.json} apiSuccessExample Response JSON
 */
router.get('/', (req, res) => {
  Events
    .getToday(req.query.offset)
    .then(events => res.json(events));
});

/**
 * @api {get} /events/suggested Get all suggested events
 * @apiName GetSuggestedEvents
 * @apiGroup Events
 * @apiExample {json=../schemas/examples/eventArray.json} apiSuccessExample Response JSON
 */
router.get('/suggested', (req, res) => {
  Events
    .suggested()
    .then(events => res.json(events));
});

/**
 * @api {get} /events/upcoming Get all upcoming events
 * @apiName GetUpcomingEvents
 * @apiGroup Events
 * @apiExample {json=../schemas/examples/eventArray.json} apiSuccessExample Response JSON
 */
router.get('/upcoming', (req, res) => {
  Events
    .getUpcoming(req.query.offset)
    .then(events => res.json(events));
});

/**
 * @api {post} /events Add an event
 * @apiName AddEvent
 * @apiGroup Events
 * @apiSchema (Body) {jsonschema=../schemas/json/event.json} apiParam
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer aaa.bbb.ccc"
 *     }
 * @apiExample {json=../schemas/examples/event.json} apiParamExample Request JSON
 * @apiExample {json=../schemas/examples/createdEvent.json} apiSuccessExample Response JSON
 */
router.post('/', (req, res, next) => {
  Events
    .create(req.body, !req.user)
    .then(event => res.json(event))
    .catch(next);
});

/**
 * @api {post} /events/url Add an event from a meetup.com url
 * @apiName AddMeetupEvent
 * @apiGroup Events
 * @apiSchema (Body) {jsonschema=../schemas/json/url.json} apiParam
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer aaa.bbb.ccc"
 *     }
 * @apiExample {json=../schemas/examples/url.json} apiParamExample Request JSON
 * @apiExample {json=../schemas/examples/createdEvent.json} apiSuccessExample Response JSON
 */
router.post('/url', (req, res, next) => {
  getMeetup(req.body.url)
    .then(event => Events.create(event, !req.user))
    .then(event => res.json(event))
    .catch(next);
});

/**
 * @api {post} /events/:id/approve Approve a pending event
 * @apiName ApproveEvent
 * @apiGroup Events
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer aaa.bbb.ccc"
 *     }
 * @apiParamExample {string} Request URL
 *    https://api.meeetup.events/api/v1/events/594b65fa11ecf100c5972d7f/approve
 * @apiExample {json=../schemas/examples/createdEvent.json} apiSuccessExample Response JSON
 */
router.post('/:id/approve', isLoggedIn, (req, res, next) => {
  Events
    .approve(req.params.id)
    .then(event => res.json(event))
    .catch(next);
});

/**
 * @api {put} /events/:id Update an event
 * @apiName UpdateEvent
 * @apiGroup Events
 * @apiSchema (Body) {jsonschema=../schemas/json/event.json} apiParam
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer aaa.bbb.ccc"
 *     }
 * @apiExample {json=../schemas/examples/event.json} apiParamExample Request JSON
 * @apiExample {json=../schemas/examples/createdEvent.json} apiSuccessExample Response JSON
 */
router.put('/:id', isLoggedIn, (req, res, next) => {
  Events
    .update(req.params.id, req.body)
    .then(event => res.json(event))
    .catch(next);
});

/**
 * @api {delete} /events/:id Delete an event
 * @apiName DeleteEvent
 * @apiGroup Events
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer aaa.bbb.ccc"
 *     }
 * @apiParamExample {string} Request URL
 *    https://api.meeetup.events/api/v1/events/594b65fa11ecf100c5972d7f/delete
 */
router.delete('/:id', isLoggedIn, (req, res, next) => {
  Events
    .delete(req.params.id)
    .then(event => res.json(event))
    .catch(next);
});

module.exports = router;
