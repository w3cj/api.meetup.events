const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message: '🌈'
  });
});

router.use('/events', require('./events'));

module.exports = router;
