const ws = require('ws')
const Game = require('../models/game')

let messegers ={}

const setserver = async (hook) => {
  await Game.deleteMany({})

  hook.on('connection', async (stream, req) => {

    let started = false
    let selfid = null

    const selfsender = (message) => {
      if(message[0] == "started"){
        enemysender = message[1]
        started = true
        stream.send(JSON.stringify({item : "begin"}))
      }
      else{
        stream.send(JSON.stringify(message))
      }
    }
    let enemysender = null

    stream.on('message' ,async (message) => {
      let data = JSON.parse(message)

      if(!started){
        selfid = data.idA
        let note = await Game.findOne({ idB:null })
        
        if (note == null) {
          const newgame = new Game(data)
          await newgame.save()
          messegers[data.idA] = selfsender
        } 
        else {
          let thegame = await Game.findByIdAndUpdate(note.id, { idB:data.idA } )
          messegers[data.idA] = selfsender
          enemysender = messegers[thegame.idA]
          enemysender(["started",selfsender])
          started = true
          stream.send(JSON.stringify({item:"begin"}))
        }
      }
      else {
        enemysender(data)
      }
      console.log(data)

    })
    stream.on('close', async (code, reason) => {
      console.log(code, reason)

      await Game.findOneAndDelete({idA:selfid})
      delete messegers[selfid]
    })
    
  })
}

module.exports = {
  setserver
}