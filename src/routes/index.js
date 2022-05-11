const router = require('express').Router()

// Import routes
const authRouter = require('./auth.router')
const jobsRouter = require('./jobs.router')


// Use routes
router.use('/', authRouter) // motaka.am/
router.use('/jobs', jobsRouter) // motaka.am/jobs


// For testing
const testRouter = require('./test.router')
router.use('/help', testRouter)



module.exports = router
