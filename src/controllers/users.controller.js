const UserModel = require('../models/User')

const _ = require('lodash')

async function getUserDataWithToken(req, res) {
  try {
    const user = req.user

    const data = _.pick(user, ['role', '_id', 'firstName', 'lastName', 'email', 'phone', 'balance', 'activeRole', 'isEmailVerified', 'isPhoneVerified', 'avatar'])

    res.json({ data })
  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMessage: e.message,
    })
  }
}

async function changeUserBalance(req, res) {
  try {
    const { money } = req.body
    const user = req.user

    user.balance += +money
    await user.save()

    res.json({
      message: 'Balance successfully changed.'
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

async function getUserDataWithId(req, res) {
  try {
    const { userId } = req.params

    const userFromDb = await UserModel.findById(userId).select('role firstName lastName email phone avatar')

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
  getUserDataWithToken,
  changeUserBalance,
  getUserDataWithId
}
