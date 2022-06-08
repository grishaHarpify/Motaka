const nodemailer = require('nodemailer')

const senderAddress = process.env.MAIL_SENDER_ADDRESS
const senderPassword = process.env.MAIL_SENDER_PASSWORD

async function sendCodeToEmail(mailAddress, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: senderAddress,
      pass: senderPassword, // password from mail settings
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
        <h1> Welcome to Motaka </h1>
        <div>
          <b> Your confirm code: </b>
          <h1>${code}</h1>  
        </div>
      </div>
    `,
  })

  console.log('Mail sended [info]: ' + info.response)
}

async function sendSomethingToEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: senderAddress,
      pass: senderPassword, // password from mail settings
    },
    tls: { rejectUnauthorized: false },
  })

  const info = await transporter.sendMail({
    from: senderAddress,
    to: mailAddress,
    subject: 'Motaka',
    text: '',
    html: `
      <div></div>
    `,
  })

  console.log('Mail sended [info]: ' + info.response)
}


module.exports = { sendCodeToEmail }
