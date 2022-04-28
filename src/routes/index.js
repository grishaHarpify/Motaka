const router = require('express').Router()

// Import routes
const rootRouter = require('./root.router')

// create user 
const User = require('../models/User')
const ConfirmCode = require('../models/ConfirmCode')
const bcrypt = require('bcrypt')
router.get('/create', async (req, res) => {
  const { phone, password } = req.body

  await User.create({
    phone,
    password: await bcrypt.hash(password, 12)
  })

  res.json({
    status: 'User created!',
    phone
  })
})
router.get('/test', async (req, res) => {
  const test = await ConfirmCode.findOne({ userId: '626a74660d035090a352dbb9' }).populate('userId')

  res.send(test)
})

// Use routes
router.use('/', rootRouter) // motaka.am/



module.exports = router
