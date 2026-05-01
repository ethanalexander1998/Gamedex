const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  platform: { type: String, trim: true },
  genre: { type: String, trim: true },
  status: {
    type: String,
    enum: ['Plan to Play', 'Playing', 'Completed', 'Dropped'],
    default: 'Plan to Play',
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    validate: {
      validator: v => v === null || v === undefined || Math.round(v * 10) / 10 === v,
      message: 'Score must have at most one decimal place'
    }
  },
  notes: { type: String, trim: true },
  cover: { type: String, default: null },
  rawgId: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
