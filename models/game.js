const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  idA: Number,
  idB: Number,
  heartnum: Number,
  dartsnum: Number,
})

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Game', gameSchema)