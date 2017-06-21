const jwt = require('jsonwebtoken');

require('dotenv').config();

function isLoggedIn(req, res, next) {
  const header = req.get('Authorization');
  if (header) {
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (error) {
        res.status(401);
        next(error);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401);
    next(new Error('UnAuthorized'));
  }
}

module.exports = {
  isLoggedIn
};
