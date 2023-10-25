const { StatusCodes } = require('http-status-codes')
const Order = require('../models/Order')
const CustomError = require('../errors/index')

const getAllOrders = async (req, res) => {
  res.status(StatusCodes.OK).send('get All orders')
}

const getSingleOrder = async (req, res) => {
  res.status(StatusCodes.OK).send('get Single Order')
}

const getCurrentUserOrders = async (req, res) => {
  res.status(StatusCodes.OK).send('get CurrentUser Orders')
}

const createOrder = async (req, res) => {
  res.status(StatusCodes.OK).send('create Order')
}

const updateOrder = async (req, res) => {
  res.status(StatusCodes.OK).send('update Order')
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
