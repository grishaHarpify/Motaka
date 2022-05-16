const CategoryModel = require('../models/Category')


async function getAllCategories(req, res) {
  try {
    // get all categories
    const allCategories = await CategoryModel.find()

    res.json({
      count: allCategories.length,
      data: allCategories
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


async function getCategoryDataWithId(req, res) {
  try {
    const { categoryId } = req.params

    const categoryData = await CategoryModel.findById(categoryId)

    // Check category with such id exist or not
    if (!categoryData) {
      return res.status(400).json({
        errorType: 'Incorrect ID error!',
        errorMsg: 'Category with such ID does not exist.',
      })
    }

    res.json({
      categoryData
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
  getAllCategories,
  getCategoryDataWithId
}
