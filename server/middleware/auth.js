'use strict'

const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req, res, next) => {
  const { token } = req.headers
  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) {
      res.status(403).send({
        message: 'Authentication failed',
        data: err
      })
    } else {
      req.headers.isAdmin = decode.data.role === 'admin'
      req.headers._id = decode.data._id
      next()
    }
  })
}

module.exports = auth
