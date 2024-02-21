const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

const ws = require('ws')
const socket = require('./controllers/socket')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

const server = new ws.Server({port:4000})
socket.setserver(server)