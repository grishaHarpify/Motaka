const UserModel = require('../models/User')
const JobModel = require('../models/Job')

class JobQueryHandler {

  constructor(queryObject, DBmodel, requestSelect = '', populateFiled = '', populateSelect = '') {
    this.queryString = JSON.stringify(queryObject)
    this.DBmodel = DBmodel

    // For les information
    this.requestSelect = requestSelect
    this.populateFiled = populateFiled
    this.populateSelect = populateSelect
  }


  // by cost [salcost]
  salaryCostHandler() {
    if (this.queryString.includes('salcost')) {
      console.log('from salaryCostHandler')
      // Add $ after [gt, gte, lt, lte]
      this.queryString = this.queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )

      this.queryString = this.queryString.replace('salcost', 'salary.cost')
    }

    return this
  }

  // by categories [caties]
  categoriesHandler() {
    if (this.queryString.includes('caties')) {

    }
  }

  // by date [date]
  startDateHandler() {

  }

  // by duration [dur]
  durationHandler() {

  }


  async getRequestResult() {
    const queryObject = JSON.parse(this.queryString)
    console.log(queryObject)
    const requestResult = await this.DBmodel.find(queryObject)
      .select(this.requestSelect)
      .populate(this.populateFiled, this.populateSelect)

    return requestResult
  }

}


module.exports = {
  JobQueryHandler
}