const router = require('express').Router()

// Import routes
const rootRouter = require('./root.router')

// create user 
const User = require('../models/User')
const ConfirmCode = require('../models/ConfirmCode')
const bcrypt = require('bcrypt')
router.get('/create', async (req, res) => {
  await User.create({
    phone: '+374 77 630905',
    password: await bcrypt.hash('111111111', 12)
  })
  res.send('Created!')
})
router.get('/test', async (req, res) => {
  const test = await ConfirmCode.findOne({ userId: '626a74660d035090a352dbb9' }).populate('userId')

  res.send(test)
})

// Use routes
router.use('/', rootRouter) // motaka.am/



module.exports = router
