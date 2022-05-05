const homeRouter = require('express').Router()


/* Import middlewares */
const verifyJWT = require('../middlewares/verifyJWT')
const { isProvider, isUser } = require('../middlewares/checkRole')

/* --- middlewares end --- */

// Import Controllers
const homeController = require('../controllers/home.controller')


// Routes // 
homeRouter.post('/new_job', verifyJWT, isProvider, homeController.createNewJob)


module.exports = homeRouter
