
function idValidation(req, res, next) {
  try {
    const params = req.params

    for (let id in req.params) {

      if (params[id].length !== 12 && params[id].length !== 24) {
        return res.status(400).json({
          errorType: 'Mongo ID error!',
          errorMsg: `${id} passed in must be a string of 12 bytes or a string of 24 hex characters.`
        })
      }

    }

    next()
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
