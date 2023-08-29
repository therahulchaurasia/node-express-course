const { StatusCodes } = require('http-status-codes')
const path = require('path')

const uploadProductImage = async (req, res) => {
  // console.log(req.files, __dirname)
  const productImage = req.files.image
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } })
}

module.exports = { uploadProductImage }
