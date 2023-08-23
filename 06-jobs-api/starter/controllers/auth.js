const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors/index')

const register = async (req, res) => {
  {
    /* const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email, password')
  }
  const salt = await bcrypt.genSalt(10)
  console.log(salt)
  const hashedPassword = await bcrypt.hash(password, salt)
  console.log(hashedPassword)
  const tempUser = { name, email, password: hashedPassword }
 */
  }
  //? Mongoose middleware handles everything for you.
  //? Check the user file in models to study the schema
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  console.log(token)
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  res.send('Login user')
}
module.exports = { register, login }
