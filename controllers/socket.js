const ws = require('ws')
const Game = require('../models/game')

let messegers ={}

const messegercount= () => {
  return Object.keys(messegers).length
}

const setserver = async (hook) => {
  await Game.deleteMany({})

  hook.on('connection', async (stream, req) => {

    let started = false
    let selfid = null
    let login = false

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

      if(!login){
        selfid = data.id
        messegers[data.id] = selfsender
        login = true
      }
      else if(!started){
        
        await Game.findOneAndDelete({idA:selfid})
        let note = await Game.findOne({ idB:null, dartsnum:data.dartsnum, heartnum:data.heartnum})
        
        if (note == null) {
          const newgame = new Game(data)
          await newgame.save()
        }
        else {
          let thegame = await Game.findByIdAndUpdate(note.id, { idB:data.idA } )
          enemysender = messegers[thegame.idA]
          enemysender(["started",selfsender])
          console.log("ok")
          started = true
          stream.send(JSON.stringify({item:"begin"}))
        }
      }
      else {
        if(data.item == "kill"){
          console.log("x")
          await Game.findOneAndDelete({idA:selfid})
          await Game.findOneAndDelete({idB:selfid})
          started = false
          enemysender(data)

          enemysender = null
          note = null
        }
        else{
          enemysender(data)
          console.log("ok")
        }
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
  setserver,
  messegercount
}

