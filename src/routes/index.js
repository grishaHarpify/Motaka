const router = require('express').Router()

// Import routes
const rootRouter = require('./root.router')
const jobRouter = require('./job.router')


// Use routes
router.use('/', rootRouter) // motaka.am/
router.use('/job', jobRouter) // motaka.am/home


// For testing
const testRouter = require('./test.router')
router.use('/help', testRouter)



module.exports = router
