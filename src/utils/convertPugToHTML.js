const pug = require('pug')

function convertPugToHTML(filename, paramsObj) {
  const compiledFunction = pug.compileFile(`./views/${filename}`)

  const htmlText = compiledFunction({
    candidate: paramsObj.candidate,
    appURL: paramsObj.appURL
  })

  return htmlText
}


module.exports = convertPugToHTML
