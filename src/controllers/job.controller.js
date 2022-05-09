const User = require('../models/User')
const Job = require('../models/Job')

// Get job data with id
async function getJobDataWithId(req, res) {
  try {
    const { jobId } = req.params

    res.json({
      message: `Job data with id: ${jobId}`
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

// Create new job [USER]
async function createNewJob(req, res) {
  try {
    const { startDate, startTime, duration, cost, address, category, subCategories } = req.body
    const user = req.user

    // Put job data to DB
    await Job.create({
      startDate: `${startDate}T${startTime}`,
      duration,
      cost,
      address,
      category,
      subCategories,
      providerId: user._id
    })

    res.json({
      message: 'Job successfully created.'
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}

// Edit job data [USER]
async function editJobWithId(req, res) {
  try {
    const { jobId } = req.params

    // Get job data form DB
    const jobData = await Job.findById(jobId)


    res.json({
      message: 'Job editing in progress.',
      data: jobData
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message
    })
  }
}


module.exports = {
  getJobDataWithId,
  createNewJob,
  editJobWithId
}
