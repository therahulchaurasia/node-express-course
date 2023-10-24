const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const Review = require('../models/Review')
const Product = require('../models/Products')
const { checkPermissionFunction } = require('../utils')

const createReview = async (req, res) => {
  const { product: productId } = req.body
  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new CustomError.BadRequestError(`No product with id : ${productId}`)
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError('Review already submitted')
  }
  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  //& In the .populate method the first parameter i.e. the path should match the field in the model and the second parameter can contain the fields in the referenced model
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })
  // .populate({
  //   path: 'user',
  //   select: 'name',
  // })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)
  }

  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)
  }
  checkPermissionFunction(req.user, review.user)
  ;(review.rating = rating), (review.title = title), (review.comment = comment)
  await review.save()
  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)
  }
  checkPermissionFunction(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({ msg: 'Review removed successfully' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
