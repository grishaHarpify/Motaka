const UserModel = require('../models/User')
const JobModel = require('../models/Job')

const { JobQueryHandler } = require('../services/queryHandler')

// Get all jobs with filter
async function getAllJobs(req, res) {
  try {
    // Get from query important info and paginate
    // (pagination) is async function => needed await
    const filteredQueryObject = await (new JobQueryHandler(
      req.query,
      JobModel,
      'salary.cost category startDate duration', // requestSelect
      'userId', // populateField 
      'firstName lastName email avatar' // populateSelect  
    ).salaryCostHandler()
      .categoriesHandler()
      .startDateHandler()
      .durationHandler()
      .pagination())

    // get from db data and send
    const allJobsAfterQuery = await filteredQueryObject.getRequestResult()

    res.json(allJobsAfterQuery)

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
    let jobData = await JobModel.findById(jobId).populate('userId', 'firstName lastName email avatar')

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
    const newJob = await JobModel.create({
      startDate: `${startDate}T${startTime}`,
      duration,
      salary,
      address,
      category,
      subCategories,
      userId: user._id,
    })

    res.json({
      message: 'Job successfully created.',
      jobId: newJob._id
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

// Edit job data [USER] // in progress 
async function editJobWithId(req, res) {
  try {
    const { id: jobId } = req.params

    // Get job data form DB
    const jobData = await JobModel.findById(jobId).populate('userId', 'firstName lastName email avatar')

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

// Add job new candidate
async function addJobNewCandidate(req, res) {
  try {
    const { jobId } = req.params
    const candidateId = req.user._id

    // Check user exist
    const userFromDb = await UserModel.findById(candidateId)
    if (!userFromDb) {
      return res.status(400).json({
        errorMessage: 'User with such ID does not exist.'
      })
    }

    // Find job data from DB
    const jobFromDb = await JobModel.findById(jobId)
    if (!jobFromDb) {
      return res.status(400).json({
        errorMessage: 'Job with such ID does not exist.'
      })
    }

    // // Check job status
    if (jobFromDb.status !== 'open') {
      return res.status(400).json({
        errorMessage: `This job [${jobId}] is not open. Service provider cannot become candidate for a job that is not open.`
      })
    }

    // Check candidateId and job.userId
    if (jobFromDb.userId.toString() === candidateId.toString()) {
      return res.status(400).json({
        errorMessage: 'Service provider cannot become a job candidate if he/she is the creator of that job.'
      })
    }

    // Check candidate already have in candidates list or no
    for (let i = 0; i < jobFromDb.candidatesList.length; i++) {
      let eachCanId = jobFromDb.candidatesList[i]

      if (eachCanId.toString() === candidateId.toString()) {
        return res.status(400).json({
          errorMessage: 'Service provider cannot become a job candidate more then one time.'
        })
      }
    }

    // Add new candidate in DB
    jobFromDb.candidatesList.push(candidateId)
    await jobFromDb.save()

    res.json({
      message: `Provider[${candidateId}] have been successfully added to the list of candidates for this job [${jobId}].`
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

// Cancel job
async function cancelJob(req, res) {
  try {
    const { jobId } = req.params
    // Find job data from DB
    const jobFromDb = await JobModel.findById(jobId)
    if (!jobFromDb) {
      return res.status(400).json({
        errorMessage: 'Job with such ID does not exist.'
      })
    }

    // Check job status
    if (jobFromDb.status === 'canceled') {
      return res.json({
        message: 'Job already canceled.'
      })
    }

    // Change job status to 'canceled'
    jobFromDb.status = 'canceled'
    await jobFromDb.save()

    res.json({
      message: `Job with id [${jobId}] was canceled.`
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
  addJobNewCandidate,
  cancelJob,
}
