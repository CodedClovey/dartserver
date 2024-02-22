const gameRouter = require('express').Router()
const Game = require('../models/game')

gameRouter.get('/', (request, response) => {
  Game.find({}).then(notes => {
    response.json(notes)
  })
})

gameRouter.get('/totalgames', (request, response) => {
  Game.countDocuments().then(number => {
    response.json({item:number})
  })
})

gameRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Game({
    idA: body.idA,
    idB: body.idB,
    heartnum: body.heartnum,
    dartsnum: body.dartsnum
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

module.exports = gameRouter