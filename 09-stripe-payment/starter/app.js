require('dotenv').config()
require('express-async-errors')
const stripeController = require('./controllers/stripeController')
const express = require('express')
const app = express()

// controller

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())
app.use(express.static('./public'))

// stripe
app.post('/stripe', stripeController)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
