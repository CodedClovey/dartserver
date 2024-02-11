const infoRouter = require('express').Router()
const Info = require('../models/info')

infoRouter.get('/', (request, response) => {
  Info.find({}).then(notes => {
    response.json(notes)
  })
})

module.exports = infoRouter