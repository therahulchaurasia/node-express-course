const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')
const { createTokenUser, attachCookiesToResponse } = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}
const getSingleUser = async (req, res) => {
  const singleUser = await User.findOne({ _id: req.params.id }).select(
    '-password'
  )
  if (!singleUser) {
    throw new CustomError.NotFoundError(
      `No user found with id : ${req.params.id}`
    )
  }
  res.status(StatusCodes.OK).json({ singleUser })
}
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

//* Update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please enter valid name and email')
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   )

//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({ payload: tokenUser, response: res })
//   res.status(StatusCodes.OK).json({ tokenUser })
// }

//* Update user with user.save() and it's gotchas. Check User model and watch the UserSchema.pre
const updateUser = async (req, res) => {
  const { email, name } = req.body
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please enter valid name and email')
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.name = name

  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ payload: tokenUser, response: res })
  res.status(StatusCodes.OK).json({ tokenUser })
}
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both passwords')
  }
  const user = await User.findOne({ _id: req.user.userId })
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Please enter correct password')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Password changed successfully' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
