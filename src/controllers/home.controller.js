const User = require('../models/User')
const Job = require('../models/Job')

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

module.exports = {
  createNewJob
}
