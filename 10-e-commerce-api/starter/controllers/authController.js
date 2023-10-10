const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors/index')
const jwt = require('jsonwebtoken')
const { createJWT } = require('../utils')

const register = async (req, res) => {
  const { email, password, name } = req.body

  // Two options: One is code mentioned below, Other is by default validation in Userschema
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  //first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  // Never directly pass the req.body in this object. Pick your values and send them
  const user = await User.create({ email, password, name, role })
  const tokenUser = { name: user.name, userId: user._id, role: user.role }
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token })
}

const login = async (req, res) => {
  res.status(StatusCodes.OK).send('login')
}

const logout = async (req, res) => {
  res.status(StatusCodes.OK).send('logout')
}

module.exports = { register, login, logout }
