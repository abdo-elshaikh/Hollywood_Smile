const jwt = require('jsonwebtoken');
const config = require('./config');
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '5d',
  });
}

module.exports = generateToken;