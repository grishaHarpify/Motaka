const testRouter = require('express').Router()
const bcrypt = require('bcrypt')

const Category = require('../models/Category')
const User = require('../models/User')


// create user 
testRouter.post('/createUser', async (req, res) => {
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

// create category
testRouter.post('/createCategory', async (req, res) => {
  const { category } = req.body

  await Category.create({
    name: category
  })

  res.json({
    status: 'Category created!',
    category
  })
})

// delete user
testRouter.post('/deleteUser', async (req, res) => {
  const { phone } = req.body

  const user = await User.findOne({ phone })
  if (!user) {
    return res.json({
      message: `${phone} already deleted.`
    })
  }

  await User.deleteOne({ phone })

  res.json({
    message: `User with phone ${phone} was deleted.`
  })
})

// renderDB
testRouter.get('/dbs', (req, res) => {
  res.render('dbHome')
})


module.exports = testRouter 
