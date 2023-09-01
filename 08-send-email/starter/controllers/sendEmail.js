const nodemailer = require('nodemailer')

const sendEmail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ana.spinka@ethereal.email',
      pass: 'BZVF93aKfkAceWf8uH',
    },
  })

  let info = await transporter.sendMail({
    from: '"Full Stack Dev" <therahulchaurasia@gmail.com>',
    to: 'bar@example.com',
    subject: 'Hello',
    html: '<h2>Sending emails with node.js</h2>',
  })
  res.json(info)
}

module.exports = sendEmail
