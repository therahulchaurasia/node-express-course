const mongoose = require('mongoose')
//* First we decalare a schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Name cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: `{VALUE} is not supported`,
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

//Similar to joining two tables in sql
ProductSchema.virtual('reviews', {
  ref: 'Review', // Reference to the other table
  localField: '_id', // Field in the local table
  // JOIN
  foreignField: 'product', // Field in the other table where you want to join
  justOne: false, // Limit value
  // match: { rating: 5 }, // WHERE condition
})

//* Fetching the value and then changing it around in the controller instead of directly using mongoose methods gives you access to such hooks
//* Refer the delete controller for products. You can see that instead of findAndDeleteById we fetch the data and perform manual deletion. This gives us access to the following hook
ProductSchema.pre('remove', async function (next) {
  // It allows you to access other models as well and perform operations
  await this.model('Review').deleteMany({ product: this._id })
})

//* Then we declare the model supporting it.
module.exports = mongoose.model('Product', ProductSchema)
