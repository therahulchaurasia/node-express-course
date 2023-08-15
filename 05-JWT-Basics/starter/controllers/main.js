const { BadRequestError } = require('../errors')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new BadRequestError('Please provide username and password')
  }
  // just for demo normally provide id from the DB!
  const id = new Date().getDate()
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  //? The payload can be a object. That object can contain any information except confidential one. DO NOT SHARE CONFIDENTIAL INFORMATION INSIDE THE PAYLOAD!!!!!

  // Keep the payload small for the sake of the user
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
  res.status(200).json({ msg: 'User Created', token })
}

const dashboard = async (req, res) => {
  console.log(req.user)
  const luckyNumber = Math.floor(Math.random() * 100)
  res.status(200).json({
    msg: `Heloo, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  })
}

module.exports = {
  login,
  dashboard,
}
