require('dotenv').config()
const connectDB = require('./db/connect')
const Job = require('./models/Job')
const data = require('./mockData.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Job.deleteMany()
    await Job.create(data)
    console.log('Success')

    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
