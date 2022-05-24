
function pathIdValidation(req, res, next) {
  try {
    const params = req.params

    for (let id in params) {

      if (params[id].length !== 12 && params[id].length !== 24) {
        return res.status(409).json({
          errorType: 'ID does not match rules!',
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

function bodyIdValidation(req, res, next) {
  try {
    const body = req.body

    for (let id in body) {

      if (body[id].length !== 12 && body[id].length !== 24) {
        return res.status(409).json({
          errorType: 'ID does not match rules!',
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


module.exports = {
  pathIdValidation,
  bodyIdValidation
}
