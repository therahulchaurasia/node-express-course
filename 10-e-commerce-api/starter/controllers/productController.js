const { StatusCodes } = require('http-status-codes')
const createProduct = async (req, res) => {
  res.status(StatusCodes.OK).send('Route to create a product')
}
const getAllProducts = async (req, res) => {
  res.status(StatusCodes.OK).send('Route to Get All Products')
}
const getSingleProduct = async (req, res) => {
  res.status(StatusCodes.OK).send('Route to get Single Product')
}
const updateProduct = async (req, res) => {
  res.status(StatusCodes.OK).send('Route to update Product')
}
const deleteProduct = async (req, res) => {
  res.status(StatusCodes.OK).send('Route to delete Product')
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
