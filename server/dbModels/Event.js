const mongoose = require('mongoose')

const { Schema } = mongoose

const EventSchema = new Schema({
  slug: String,
  name: String,
  bonusForWin: Number,
  columns: [ String ],
  rows: [ String ],
  turnList: [{
    turnNumber: Number,
    fog: Boolean,
    type: { type: String, default: 'commonTurn' }
  }],
  cellList: [{
    name: String,
    connectedCells: Array,
    started: Boolean,
    gameMap: String,
    incomeStatus: String,
    bonus: { type: Number, default: 0 }
  }]
})

module.exports = mongoose.model('Event', EventSchema)
