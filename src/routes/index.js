const router = require('express').Router()

// Import routes
const rootRouter = require('./root.router')
const homeRouter = require('./home.router')

// create user [for deleting]
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.post('/createUser', async (req, res) => {
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

//create category
const Category = require('../models/Category')
router.post('/createCategory', async (req, res) => {
  const { category } = req.body

  await Category.create({
    name: category
  })

  res.json({
    status: 'Category created!',
    category
  })
})
// -----------

// Use routes
router.use('/', rootRouter) // motaka.am/
router.use('/home', homeRouter) // motaka.am/home



module.exports = router
