const nodemailer = require("nodemailer")
const nodemailerConfig = require("./nodemailerConfig")

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport(nodemailerConfig)

  return transporter.sendMail({
    from: '"Goku Devs 👻" <gokudevs@gmail.com>', // sender address
    to,
    subject,
    html,
  })
  console.log("message sent")
}

module.exports = sendEmail
