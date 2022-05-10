const testRouter = require('express').Router()
const bcrypt = require('bcrypt')

const UserModel = require('../models/User')
const ConfirmCodeModel = require('../models/ConfirmCode')
const CategoryModel = require('../models/Category')
const JobModel = require('../models/Job')


// Create, delete ..... // 
// create user 
testRouter.post('/createUser', async (req, res) => {
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
testRouter.post('/createCategory', async (req, res) => {
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
testRouter.delete('/deleteUser', async (req, res) => {
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
testRouter.get('/', async (req, res) => {
  res.render('helpHome')
})

// Render dbs
testRouter.get('/dbs/:dbName', async (req, res) => {
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
    let jobs = await getAllJob()
    if (jobs.length === 0) {
      jobs = ''
    }

    return res.render('dbHome', {
      message: 'Jobs',
      data: jobs
    })
  }

  // else //
  return res.render('dbHome', {
    message: 'Choose DataBase to see data'
  })
})

// Render requestsInfo
testRouter.get('/requestsInfo/:name', (req, res) => {
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
async function getAllJob() {
  const jobs = await JobModel.find()
  jobs.forEach((eachJob) => {
    return JSON.stringify(eachJob, undefined, 2)
  })

  return jobs
}
// ========================== // 

module.exports = testRouter 
