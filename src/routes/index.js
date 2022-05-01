const router = require('express').Router()

// Import routes
const rootRouter = require('./root.router')

// create user 
const User = require('../models/User')
const bcrypt = require('bcrypt')
router.post('/create', async (req, res) => {
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

// Use routes
router.use('/', rootRouter) // motaka.am/



module.exports = router
