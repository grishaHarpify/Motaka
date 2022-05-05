const User = require('../models/User')

function createNewJob(req, res) {
  try {
    const { startDate, startTime, duration, cost, address, category } = req.body


    res.json({
      startDate,
      startTime,
      duration,
      cost,
      address,
      category
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
