const UserModel = require('../models/User')

async function getUserDataWithId(req, res) {
  try {
    const { userId } = req.params

    const userFromDb = await UserModel.findById(userId).select('role firstName lastName email phone')

    if (!userFromDb) {
      return res.status(404).json({
        errorType: 'Incorrect ID error!',
        errorMessage: 'User with such ID does not exist.',
      })
    }

    res.json({ data: userFromDb })
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
