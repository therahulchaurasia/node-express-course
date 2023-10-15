const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')

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
  res.status(StatusCodes.OK).send('Route to show Current User')
}
const updateUser = async (req, res) => {
  res.status(StatusCodes.OK).send(req.body)
}
const updateUserPassword = async (req, res) => {
  res.status(StatusCodes.OK).send(req.body)
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
