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
      'salary startDate duration address category subCategories status userId', // requestSelect
      //'userId', // populateField 
      //'firstName lastName email avatar' // populateSelect  
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
      errorMessage: e.message,
    })
  }
}

// Get job data with id
async function getJobDataWithId(req, res) {
  try {
    const { jobId } = req.params

    // Find job with id
    let jobData = await JobModel.findById(jobId).select('salary startDate duration address category subCategories userId status')

    // Check job with such id exist or not
    if (!jobData) {
      return res.status(404).json({
        errorType: 'Incorrect ID error!',
        errorMessage: 'Job with such ID does not exist.',
      })
    }

    res.json({
      data: jobData,
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
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
      salary: {
        cost: salary // salary from FRONT we put in db with name salary.cost
      },
      address,
      category,
      subCategories,
      userId: user._id,
    })

    res.status(201).json({
      message: 'Job successfully created.',
      jobId: newJob._id
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

// Edit job data [USER]  
async function editJobWithId(req, res) {
  try {
    const { jobId } = req.params
    const user = req.user

    // Get job data form DB
    const jobFromDb = await JobModel.findById(jobId)

    if (!jobFromDb) {
      return res.status(404).json({
        errorType: 'Incorrect ID error!',
        errorMessage: 'Job with such ID does not exist.',
      })
    }

    // Check job author and current user id
    if (user._id.toString() !== jobFromDb.userId.toString()) {
      return res.status(403).json({
        errorType: 'Forbidden!',
        errorMessage: 'The user is not the creator of this job.',
      })
    }

    if (jobFromDb.status !== 'open') {
      return res.status(400).json({
        errorType: 'Job status error!',
        errorMessage: 'Job status is no longer open.',
      })
    }

    // Get job new data
    const jobNewData = {
      ...req.body,
      salary: {
        cost: req.body.salary // salary from FRONT we put in DB -> salary.cost
      }
    }

    // Edit job
    await JobModel.findByIdAndUpdate(jobId, {
      ...jobNewData
    })

    res.json({
      message: 'Job data successfully edited.'
    })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

// Add job new candidate
async function addJobNewCandidate(req, res) {
  try {
    const { jobId } = req.params
    const candidateId = req.user._id

    // Find job data from DB
    const jobFromDb = await JobModel.findById(jobId)
    if (!jobFromDb) {
      return res.status(404).json({
        errorType: 'Incorrect ID error!',
        errorMessage: 'Job with such ID does not exist.'
      })
    }

    // // Check job status
    if (jobFromDb.status !== 'open') {
      return res.status(400).json({
        errorType: 'Incorrect status error!',
        errorMessage: `This job [${jobId}] is not open. Service provider cannot become candidate for a job that is not open.`
      })
    }

    // Check candidateId and job.userId
    if (jobFromDb.userId.toString() === candidateId.toString()) {
      return res.status(403).json({
        errorType: 'Forbidden!',
        errorMessage: 'Service provider cannot become a job candidate if he/she is the creator of that job.'
      })
    }

    // Check candidate already have in candidates list or no
    for (let i = 0; i < jobFromDb.candidatesList.length; i++) {
      let eachCanId = jobFromDb.candidatesList[i]

      if (eachCanId.toString() === candidateId.toString()) {
        return res.status(403).json({
          errorType: 'Forbidden',
          errorMessage: 'Service provider cannot become a same job candidate more then one time.'
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
      errorMessage: e.message,
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
      return res.status(404).json({
        errorType: 'Incorrect ID error!',
        errorMessage: 'Job with such ID does not exist.'
      })
    }

    // Check job author
    const user = req.user
    if (user._id.toString() !== jobFromDb.userId.toString()) {
      return res.status(403).json({
        errorType: 'Forbidden!',
        errorMessage: 'Job creator ID and logged in user ID does not match. The creator of this work is not logged in user.'
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
      message: `Job [${jobId}] was canceled.`
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
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
