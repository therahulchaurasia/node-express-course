const User = require("../models/User")
const CustomError = require("../errors/index")

const getAllUsers = async (req, res) => {
  const users = await User.find({})
  res.status(200).json({ users, count: users.length })
}

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params
  const user = await User.find({ _id: userId })
  if (!user) {
    throw new CustomError.NotFoundError(`No user found with the id ${userId}`)
  }
  res.status(200).json({ user })
}

module.exports = { getAllUsers, getSingleUser }
