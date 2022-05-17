const JobModel = require('../models/Job')
const UserModel = require('../models/User')
const OrderModel = require('../models/Order')


async function createNewOrder(req, res) {
  try {
    const { jobId, providerId } = req.body

    // Check provider exist or not
    const userFromDb = await UserModel.findById(providerId)
    if (!userFromDb || !userFromDb.role.isProvider) {
      return res.status(400).json({
        errorType: 'Incorrect ID error!',
        errorMsg: 'Provider with such ID does not exist.',
      })
    }

    // Check job exist or not 
    const jobFromDb = await JobModel.findById(jobId)
    if (!jobFromDb) {
      return res.status(400).json({
        errorType: 'Incorrect ID error!',
        errorMsg: 'Job with such ID does not exist.',
      })
    }

    // Check such job open or no
    if (jobFromDb.status !== 'open') {
      return res.status(400).json({
        errorType: 'Job creating error!',
        errorMsg: 'The status of this job is not open.',
      })
    }

    // Create new order 
    const newOrder = await OrderModel.create({
      jobId,
      providerId
    })

    // Change job status inProgress
    jobFromDb.status = 'inProgress'
    await jobFromDb.save()


    res.json({
      message: 'Order successfully created.',
      orderId: newOrder._id
    })

  } catch (e) {
    console.log(`Error in file: ${__filename}!`)
    console.log(e.message)
    res.status(500).json({
      errorType: 'Server side error!',
      errorMsg: e.message,
    })
  }
}


module.exports = {
  createNewOrder
}
