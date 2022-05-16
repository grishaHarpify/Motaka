const UserModel = require('../models/User')

async function getUserDataWithId(req, res) {
  try {
    const { userId } = req.params

    const userData = await UserModel.findById(userId)

    if (!userData) {
      return res.status(400).json({
        errorType: 'Incorrect ID error!',
        errorMsg: 'User with such ID does not exist.',
      })
    }

    res.json({ data: userData })
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
  getUserDataWithId,
}
