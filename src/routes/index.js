const router = require('express').Router()

// Import routes
const rootRouter = require('./root.router')
const homeRouter = require('./home.router')


// Use routes
router.use('/', rootRouter) // motaka.am/
router.use('/home', homeRouter) // motaka.am/home


// For testing
const testRouter = require('./test.router')
router.use('/test', testRouter)



module.exports = router
