const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const search = 'ab'
  const products = await Product.find({}).sort('-name price')
  res.status(200).json({ products, nbhits: products.length })
}
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query //query is handy
  const queryObject = {}
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }
  // console.log(queryObject)
  let result = Product.find(queryObject) // Since filter needs an object we create an object beforehand
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt') // default sort value
  }
  const products = await result
  res.status(200).json({ products, nbhits: products.length })
}

module.exports = {
  getAllProducts,
  getAllProductsStatic,
}
