const helpRouter = require('express').Router()

const bcrypt = require('bcrypt')

const UserModel = require('../models/User')
const ConfirmCodeModel = require('../models/ConfirmCode')
const CategoryModel = require('../models/Category')
const JobModel = require('../models/Job')
const OrderModel = require('../models/Order')
const CommentModel = require('../models/Comment')


// Create, delete ..... // 
// create user 
helpRouter.post('/createUser', async (req, res) => {
  const { phone, password } = req.body

  await UserModel.create({
    phone,
    password: await bcrypt.hash(password, 12)
  })

  res.json({
    status: 'User created!',
    phone
  })
})

// create category
helpRouter.post('/createCategory', async (req, res) => {
  const { category } = req.body

  await CategoryModel.create({
    name: category
  })

  res.json({
    status: 'Category created!',
    category
  })
})

// delete user
helpRouter.delete('/deleteUser', async (req, res) => {
  const { phone } = req.body

  const user = await UserModel.findOne({ phone })
  if (!user) {
    return res.json({
      message: `${phone} already deleted.`
    })
  }

  await UserModel.deleteOne({ phone })

  res.json({
    message: `User with phone ${phone} was deleted.`
  })
})
// =================================== // 


// ======= Render test pages ======= //
// Render test home
helpRouter.get('/', async (req, res) => {
  res.render('helpHome')
})

// Render dbs
helpRouter.get('/dbs/:dbName', async (req, res) => {
  if (req.params.dbName === 'users') {
    let users = await getAllUsers()
    if (users.length === 0) {
      users = ''
    }

    return res.render('dbHome', {
      message: 'Users',
      data: users
    })
  }

  if (req.params.dbName === 'confirmCodes') {
    let confirmCodes = await getAllConfirmCodes()
    if (confirmCodes.length === 0) {
      confirmCodes = ''
    }

    return res.render('dbHome', {
      message: 'Confirm Codes',
      data: confirmCodes
    })
  }

  if (req.params.dbName === 'categories') {
    let categories = await getAllCategories()
    if (categories.length === 0) {
      categories = ''
    }

    return res.render('dbHome', {
      message: 'Categories',
      data: categories
    })
  }

  if (req.params.dbName === 'jobs') {
    let jobs = await getAllJobs()
    if (jobs.length === 0) {
      jobs = ''
    }

    return res.render('dbHome', {
      message: 'Jobs',
      data: jobs
    })
  }

  if (req.params.dbName === 'orders') {
    let orders = await getAllOrders()
    if (orders.length === 0) {
      orders = ''
    }

    return res.render('dbHome', {
      message: 'Orders',
      data: orders
    })
  }

  if (req.params.dbName === 'comments') {
    let comments = await getAllComments()
    if (comments.length === 0) {
      comments = ''
    }

    return res.render('dbHome', {
      message: 'Comments',
      data: comments
    })
  }


  // else //
  return res.render('dbHome', {
    message: 'Choose DataBase to see data'
  })
})

// Render requestsInfo
helpRouter.get('/requestsInfo/:name', (req, res) => {
  if (req.params.name === 'about') {
    return res.render('requestsInfo', {
      message: 'About Requests Symbols',
      isAboutPage: true
    })
  }

  if (req.params.name === 'Grisha') {
    return res.render('requestsInfo', {
      message: 'Info About Requests [Grisha]',
      isGrishaPage: true
    })
  }

  if (req.params.name === 'Mamikon') {
    return res.render('requestsInfo', {
      message: 'Info About Requests [Mamikon]',
      isMamikonPage: true
    })
  }

  if (req.params.name === 'helperRequests') {
    return res.render('requestsInfo', {
      message: 'Info About Helper Requests',
      isHelperRequestsPage: true
    })
  }

  res.render('requestsInfo', {
    message: 'Choose a developer to see info'
  })
})
// =================================== // 






// Functions for db //
async function getAllUsers() {
  const users = await UserModel.find()
  users.forEach((eachUser) => {
    return JSON.stringify(eachUser, undefined, 2)
  })

  return users
}
async function getAllConfirmCodes() {
  const confirmCodes = await ConfirmCodeModel.find()
  confirmCodes.forEach((eachCode) => {
    return JSON.stringify(eachCode, undefined, 2)
  })

  return confirmCodes
}
async function getAllCategories() {
  const categories = await CategoryModel.find({}, 'name subCategories')
  categories.forEach((eachCat) => {
    return JSON.stringify(eachCat, undefined, 2)
  })

  return categories
}
async function getAllJobs() {
  const jobs = await JobModel.find()
  jobs.forEach((eachJob) => {
    return JSON.stringify(eachJob, undefined, 2)
  })

  return jobs
}
async function getAllOrders() {
  const orders = await OrderModel.find()
  orders.forEach((eachOrder) => {
    return JSON.stringify(eachOrder, undefined, 2)
  })

  return orders
}
async function getAllComments() {
  const comments = await CommentModel.find()
  comments.forEach((eachCom) => {
    return JSON.stringify(eachCom, undefined, 2)
  })

  return comments
}
// ========================== // 

module.exports = helpRouter 
