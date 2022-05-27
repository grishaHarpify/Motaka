const router = require('express').Router()

// Middlewares
const verifyJWT = require('../middlewares/verifyJWT')

// Import routes
const authRouter = require('./auth.router')
const jobsRouter = require('./jobs.router')
const categoriesRouter = require('./categories.router')
const usersRouter = require('./users.router')
const ordersRouter = require('./orders.router')

// Use routes
router.use('/', authRouter) // motaka.am/
router.use('/jobs', verifyJWT, jobsRouter) // motaka.am/jobs
router.use('/categories', categoriesRouter) // motaka.am/categories
router.use('/users', usersRouter) // motaka.am/users
router.use('/orders', verifyJWT, ordersRouter) // motaka.am/orders 

// For testing
router.use('/help', require('./help.router'))

module.exports = router
