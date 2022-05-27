const jwtRouter = require('express').Router()

// Import Controller
const jwtController = require('../controllers/jwt.controller')



jwtRouter.post('/refresh',
  jwtController.getRefreshReturnPair)

module.exports = jwtRouter
