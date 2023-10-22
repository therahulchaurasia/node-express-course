const { StatusCodes } = require('http-status-codes')
const Product = require('../models/Products')
const CustomError = require('../errors/index')
const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products, count: products.length })
}
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params
  if (!productId) {
    throw new CustomError.BadRequestError('Please provide product id')
  }
  const singleProduct = await Product.findOne({ _id: productId })
  if (!singleProduct) {
    throw new CustomError.NotFoundError(
      `No product found with the id ${productId}`
    )
  }

  res.status(StatusCodes.OK).json({ singleProduct })
}
const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with the id ${productId}`
    )
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  const singleProduct = await Product.findOne({ _id: productId })
  if (!singleProduct) {
    throw new CustomError.NotFoundError(
      `No product found with the id ${productId}`
    )
  }
  await singleProduct.remove()
  res.status(StatusCodes.OK).json({ msg: `Success! Product Removed` })
}
const uploadImage = async (req, res) => {
  res.status(StatusCodes.OK).send('Route to upload Image')
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
