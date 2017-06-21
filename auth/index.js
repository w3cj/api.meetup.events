const jwt = require('jsonwebtoken');
const router = require('express').Router();

require('dotenv').config();

router.post('/login', (req, res, next) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    jwt.sign({
      role: 'admin'
    }, process.env.TOKEN_SECRET, {}, (error, token) => {
      res.json({
        token
      });
    });
  } else {
    next(new Error('Invalid Login'));
  }
});

module.exports = router;
