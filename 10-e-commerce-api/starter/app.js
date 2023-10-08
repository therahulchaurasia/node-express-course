require('dotenv').config()
// using the below package reduces the need to use try catch block in every piece of code that we implement
require('express-async-errors')

//db import
const connectDB = require('./db/connect')
const authRouter = require('./routes/authRoutes')

//express
const express = require('express')
const app = express()
const morgan = require('morgan')

//Middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

app.use(morgan('tiny'))
//To access the json data received in the body during api calls
app.use(express.json())

app.use('/api/v1/auth', authRouter)

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
