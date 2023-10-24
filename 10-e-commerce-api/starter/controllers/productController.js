const { StatusCodes } = require('http-status-codes')
const Product = require('../models/Products')
const CustomError = require('../errors/index')
const path = require('path')
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
  const singleProduct = await Product.findOne({ _id: productId }).populate(
    'reviews'
  )
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
  console.log(req.files)
  if (!req.files) {
    throw new CustomError.BadRequestError('No file uploaded')
  }
  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload image')
  }

  const maxSize = 1024 * 1024
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    )
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
