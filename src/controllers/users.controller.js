const UserModel = require('../models/User')

async function getUserDataWithId(req, res) {
  try {
    const { userId } = req.params

    const userData = await UserModel.findById(userId)

    if (!userData) {
      return res.status(404).json({
        errorType: 'Incorrect ID error!',
        errorMessage: 'User with such ID does not exist.',
      })
    }

    res.json({ data: userData })
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
  getUserDataWithId,
}
