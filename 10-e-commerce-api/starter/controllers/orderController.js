const { StatusCodes } = require("http-status-codes")
const Order = require("../models/Order")
const CustomError = require("../errors/index")
const Product = require("../models/Products")
const { checkPermissionFunction } = require("../utils")

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`)
  }
  checkPermissionFunction(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })

  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue"
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided")
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Please provide tax and shipping fee")
  }

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `Product with the id ${item.product} does not exists`
      )
    }
    const { name, price, image, _id } = dbProduct
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += item.amount * price
  }
  const total = subtotal + tax + shippingFee
  // get client secret
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: "usd" })
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`)
  }
  checkPermissionFunction(req.user, order.user)
  ;(order.paymentIntentId = paymentIntentId), (order.status = "paid")
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
