const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

const ws = require('ws')
const socket = require('./controllers/socket')

const s = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

//const server = new ws.Server({noServer:true})
const server = new ws.WebSocketServer({server: s})
socket.setserver(server)