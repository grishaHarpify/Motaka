const UserModel = require('../models/User')
const JobModel = require('../models/Job')

class JobQueryHandler {
  _page
  _limit
  _skip

  // Put all data her
  _queryHandlerResult = {}

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

    return this
  }

  // by date [date]
  startDateHandler() {
    if (this.queryString.includes('date')) {

    }

    return this
  }

  // by duration [dur]
  durationHandler() {
    if (this.queryString.includes('dur')) {

    }

    return this
  }

  // pagination and limit [page=15 & limit=15]
  async pagination() {
    const queryObject = JSON.parse(this.queryString)

    // get page and limit from query
    this._page = parseInt(queryObject.page) || 1
    this._limit = parseInt(queryObject.limit) || 20
    this._skip = (this._page - 1) * this._limit

    // delete page and limit from queryObject
    delete queryObject.page
    delete queryObject.limit

    // Get data count to create next and previous objects
    const dataCount = await this.DBmodel.countDocuments(queryObject)

    // previous page
    if (this._page !== 1 && this._page * this._limit - this._limit < dataCount) {
      this._queryHandlerResult.previous = {
        page: this._page - 1,
        limit: this._limit
      }
    }

    // next page
    if (this._page * this._limit < dataCount) {
      // for last age 
      // if(dataCount = 8 && [page = 2 & limit = 3])=> next.limit = 2
      let limitForNext = this._limit
      if (dataCount - this._page * this._limit < this._limit) {
        limitForNext = dataCount - (this._page * this._limit)
      }
      // ---

      this._queryHandlerResult.next = {
        page: this._page + 1,
        limit: limitForNext
      }
    }

    // parse object to string
    this.queryString = JSON.stringify(queryObject)

    return this
  }

  async getRequestResult() {
    const queryObject = JSON.parse(this.queryString)
    console.log(queryObject, 'query object after filter')

    // Get data from DB
    this._queryHandlerResult.data = await this.DBmodel.find(queryObject)
      .select(this.requestSelect)
      .skip(this._skip)
      .limit(this._limit)
      .populate(this.populateFiled, this.populateSelect)
      .exec()

    return this._queryHandlerResult
  }

}


module.exports = {
  JobQueryHandler
}