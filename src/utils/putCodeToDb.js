const ConfirmCode = require('../models/ConfirmCode')
const bcrypt = require('bcrypt')

async function putConfirmCodeToDb(userId, code) {
  try {
    const codeFromDb = await ConfirmCode.findOne({ userId }).populate('userId')

    // Code valid 1 day
    let validTime = new Date()
    validTime.setHours(validTime.getHours() + 24)

    // Hash code
    const hashCode = await bcrypt.hash(code, 10)

    // Then we send code to user first time
    if (!codeFromDb) { // codeFromDb === null 
      return await ConfirmCode.create({
        userId,
        code: hashCode,
        validTime,
        // isUser: false // [default]
      })
    }

    // Update code and valid time in db 
    await ConfirmCode.findOneAndUpdate({ userId }, { code: hashCode, validTime, isUsed: false })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
  }
}


module.exports = putConfirmCodeToDb
