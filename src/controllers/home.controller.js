const User = require('../models/User')

function createNewJob(req, res) {
  try {
    const { startDate, startTime, duration, cost, address, category, subCategories } = req.body

    // const test = new Date(`T${startTime}`)
    // console.log(test)

    res.json({
      startDate,
      startTime,
      duration,
      cost,
      address,
      category,
      subCategories
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
