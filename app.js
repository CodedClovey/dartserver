const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const gameRouter = require('./controllers/mongo.js')
const middleware = require('./utils/middleware.js')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/games', gameRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app