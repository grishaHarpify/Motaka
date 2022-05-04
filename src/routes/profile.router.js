const profileRouter = require('express').Router()


/* Import middlewares */
const verifyJWT = require('../middlewares/verifyJWT')
const { isProvider, isUser } = require('../middlewares/checkRole')

/* --- middlewares end --- */

// Import Controllers
const profileController = require('../controllers/profile.controller')


// Routes // 
profileRouter.post('/new_job', verifyJWT, isProvider, profileController.createNewJob)


module.exports = profileRouter
