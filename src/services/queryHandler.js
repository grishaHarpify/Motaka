const UserModel = require('../models/User')
const JobModel = require('../models/Job')

class QueryHandler {

  constructor(queryObject, DBmodel, populateFiled = '') {
    this.queryString = JSON.stringify(queryObject)
    this.DBmodel = DBmodel
    this.populateFiled = populateFiled
  }

  costHandler() {
    if (this.queryString.includes('cost')) {
      // Add $ after [gt, gte, lt, lte]
      this.queryString = this.queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )

    }

    return this
  }


  async getResult() {
    const queryObject = JSON.parse(this.queryString)
    console.log(queryObject)
    const requestResult = await this.DBmodel.find(queryObject).populate(this.populateFiled)

    return requestResult
  }

}

// async function handleQuery(queryObj) {

//   // console.log(queryObj, '<------ query')

//   let queryStr = JSON.stringify(queryObj)
//   console.log(queryStr)
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
//   console.log(queryStr)

//   // const newQ = {
//   //   cost: {}
//   // }

//   // if (queryObj['cost']) {
//   //   for (let key in queryObj['cost']) {
//   //     newQ['cost'][`$${key}`] = queryObj['cost'][key]
//   //   }
//   // }
//   const u = await JobModel.findOne(JSON.parse(queryStr))
//   console.log(u)
//   // console.log(newQ)
// }

module.exports = {
  // handleQuery,
  QueryHandler
}