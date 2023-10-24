require('dotenv').config()
// using the below package reduces the need to use try catch block in every piece of code that we implement
require('express-async-errors')

//db import
const connectDB = require('./db/connect')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')

//express
const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser') // Use it parse cookies
const fileUpload = require('express-fileupload')

//Middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

app.use(morgan('tiny'))
app.use(express.json()) //To access the json data received in the body during api calls
app.use(cookieParser(process.env.JWT_SECRET)) // We need this package to parse cookies and we send the secret to sign the cookie.
app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req, res) => {
  res.send('e-commerce-api')
})
app.get('/api/v1', (req, res) => {
  // console.log(req.cookies)
  console.log(req.signedCookies)
  res.send('e-commerce-api')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)

app.get('/', (req, res) => {
  res.status(200).send('home')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()
