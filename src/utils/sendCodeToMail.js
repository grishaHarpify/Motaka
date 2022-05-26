const nodemailer = require('nodemailer')

const senderAddress = 'grisha.hovhanyan@mail.ru'

async function sendCodeToEmail(mailAddress, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: senderAddress,
      pass: 'EX7KDCEriJkyBt2v69zb', // password from mail settings
    },
    tls: { rejectUnauthorized: false },
  })

  const info = await transporter.sendMail({
    from: senderAddress,
    to: mailAddress,
    subject: 'Motaka',
    text: 'Verify your email',
    html: `
      <div style= "text-align: center">
        <b> Your confirm code: </b>
        <h1>${code}</h1>
      </div>
    `,
  })

  console.log('Mail sended [info]: ' + info.response)
}


module.exports = sendCodeToEmail
