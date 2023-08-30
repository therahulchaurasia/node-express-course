const { StatusCodes } = require('http-status-codes')
const path = require('path')
const CustomErrors = require('../errors')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
const uploadProductImageLocal = async (req, res) => {
  // console.log(req.files, __dirname)
  if (!req.files) {
    throw new CustomErrors.BadRequestError('No File Provided')
  }
  const productImage = req.files.image

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomErrors.BadRequestError('Invalid File Format')
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new CustomErrors.BadRequestError(
      'Please upload image smaller than 1KB'
    )
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } })
}

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload',
    }
  )
  // console.log(result)
  fs.unlinkSync(req.files.image.tempFilePath)
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = { uploadProductImage }
