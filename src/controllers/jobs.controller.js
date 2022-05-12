const UserModel = require('../models/User')
const JobModel = require('../models/Job')
const _ = require('lodash')

const { QueryHandler } = require('../services/queryHandler')

async function getAllJobs(req, res) {
  try {
    // const allJobs = await JobModel.find({}).populate('providerId', 'firstName lastName email avatar')

    // const test = new QueryHandler(req.query, JobModel /*, populateField = 'providerId'*/)
    //   .costHandler()
    //   .getResult()


    // const result = await test
    // res.json({ result })

    // res.json({
    //   data: allJobs,
    // })

    // ================


  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

// Get job data with id
async function getJobDataWithId(req, res) {
  try {
    const { id: jobId } = req.params

    // Find job with id
    let jobData = await JobModel.findById(jobId)

    // Check job with such id exist or not
    if (!jobData) {
      return res.status(400).json({
        errorType: 'Incorrect ID error!',
        errorMsg: 'Job with such ID does not exist.',
      })
    }

    res.json({
      jobData,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

// Create new job [USER]
async function createNewJob(req, res) {
  try {
    const { startDate, startTime, duration, salary, address, category, subCategories } = req.body
    const user = req.user

    // Put job data to DB
    await JobModel.create({
      startDate: `${startDate}T${startTime}`,
      duration,
      salary,
      address,
      category,
      subCategories,
      providerId: user._id,
    })

    res.json({
      message: 'Job successfully created.',
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

// Edit job data [USER]
async function editJobWithId(req, res) {
  try {
    const { id: jobId } = req.params

    // Get job data form DB
    const jobData = await JobModel.findById(jobId)

    res.json({
      message: 'Job editing in progress.',
      data: jobData,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}

module.exports = {
  getAllJobs,
  getJobDataWithId,
  createNewJob,
  editJobWithId,
}
