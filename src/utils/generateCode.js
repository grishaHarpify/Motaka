// Random number form 0 to 9
function numberFrom0To9() {
  return Math.floor(Math.random() * 9)
}

const codeLength = 6

// Random code from 000000 to 999999 
function generateCode() {
  let code = ''

  for (let i = 0; i < codeLength; i++) {
    code += numberFrom0To9()
  }

  return code
}

module.exports = generateCode
