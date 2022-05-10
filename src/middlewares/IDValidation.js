
function idValidation(req, res, next) {
  try {
    const { id } = req.params

    if (id.length === 12 || id.length === 24) {
      return next()
    }

    return res.status(400).json({
      errorType: 'Mongo ID error!',
      errorMsg: 'ID passed in must be a string of 12 bytes or a string of 24 hex characters.'
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


module.exports = idValidation
