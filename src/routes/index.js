const router = require('express').Router()

// Middlewares
const verifyJWT = require('../middlewares/verifyJWT')

// Import routes
const authRouter = require('./auth.router')
const jobsRouter = require('./jobs.router')
const userRouter = require('./user.router')

// Use routes
router.use('/', authRouter) // motaka.am/
router.use('/jobs', verifyJWT, jobsRouter) // motaka.am/jobs
router.use('/users', verifyJWT, userRouter)

// For testing
const testRouter = require('./test.router')
router.use('/help', testRouter)

module.exports = router
