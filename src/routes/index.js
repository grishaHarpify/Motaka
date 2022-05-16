const router = require('express').Router()

// Middlewares
const verifyJWT = require('../middlewares/verifyJWT')

// Import routes
const authRouter = require('./auth.router')
const jobsRouter = require('./jobs.router')
const categoriesRouter = require('./categories.router')
const usersRouter = require('./users.router')

// Use routes
router.use('/', authRouter) // motaka.am/
router.use('/jobs', verifyJWT, jobsRouter) // motaka.am/jobs
router.use('/categories', verifyJWT, categoriesRouter) // motaka.am/categories
router.use('/users', verifyJWT, usersRouter) // motaka.am/users

// For testing
const testRouter = require('./test.router')
router.use('/help', testRouter)

module.exports = router
