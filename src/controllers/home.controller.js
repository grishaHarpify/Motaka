const User = require('../models/User')

function createNewJob(req, res) {
  try {

    res.send(`${req.user.phone} can create new job.`)

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
