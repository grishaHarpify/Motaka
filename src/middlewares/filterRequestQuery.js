

function getAllJobsQueryFilter(req, res, next) {
  const queryObject = req.query

  for (let key in queryObject) {
    // if key is not in case => delete it
    switch (key) {
      case 'salcost': // salary.cost
      case 'caties':  // categories
      case 'date':    // startDate
      case 'dur':     // duration
      case 'page':    // pagination and limit
      case 'limit':
        break
      default:
        delete queryObject[key]
    }
  }


  next()
}


module.exports = {
  getAllJobsQueryFilter
}
