const gameRouter = require('express').Router()
const Game = require('../models/game')
const Streak = require('../models/streak')
const socket = require('./socket')

gameRouter.get('/totalplayers', (request, response) => {
  const ppl = socket.messegercount()
  response.json({item:ppl})
})

gameRouter.get('/', (request, response) => {
  Game.find({}).then(notes => {
    response.json(notes)
  })
})

gameRouter.get('/streak', (request, response) => {
  Streak.find({}).sort({ score : -1}).limit(25).then(notes => {
    response.json(notes)
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

gameRouter.post('/streak', (request, response, next) => {
  const body = request.body

  const note = new Streak({
    name: body.name,
    score: body.score
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

module.exports = gameRouter