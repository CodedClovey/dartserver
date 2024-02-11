const mongoose = require('mongoose')

const infoSchema = new mongoose.Schema({
  content:  String,
})

infoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Info', infoSchema)