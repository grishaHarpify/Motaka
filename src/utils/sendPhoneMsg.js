const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET
})

function sendCodeToPhone(to, code) {
  const from = 'Motaka'
  // [to] --> phone number to send SMS  // only in phone which is registered in site 
  text = `Your confirm code: ${code}`

  nexmo.message.sendSms(from, to, text)
}

module.exports = { sendCodeToPhone }
// -------