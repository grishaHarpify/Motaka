// To get data from [form-data] (files and images in req.files)
const multer = require('multer')
const upload = multer(({ storage: multer.memoryStorage() }))
const cpUpload = upload.fields([{ name: 'photo', maxCount: 15 }, { name: 'pdfFile', maxCount: 15 }])

module.exports = cpUpload
