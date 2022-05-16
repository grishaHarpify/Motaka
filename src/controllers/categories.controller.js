
async function getAllCategories(req, res) {
  res.send('ok')
}


async function getCategoryDataWithId(req, res) {
  res.send(`ok ${req.params.categoryId}`)
}

module.exports = {
  getAllCategories,
  getCategoryDataWithId
}
