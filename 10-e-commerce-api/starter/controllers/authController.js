const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors/index')
const jwt = require('jsonwebtoken')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

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
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ payload: tokenUser, response: res })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Email or password is invalid')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      'Please provide valid credentials'
    )
  }

  const checkPassword = await user.comparePassword(password)

  if (!checkPassword) {
    throw new CustomError.UnauthenticatedError(
      'Please provide a valid password'
    )
  }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ payload: tokenUser, response: res })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out successfully' })
}

module.exports = { register, login, logout }
