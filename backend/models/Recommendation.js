const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  basedOn: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  basedOnTitle: { type: String, required: true },
  rawgId: { type: Number, required: true },
  title: { type: String, required: true },
  genre: { type: String },
  platform: { type: String },
  cover: { type: String, default: null },
  reason: { type: String },
  dismissed: { type: Boolean, default: false }
}, { timestamps: true });

recommendationSchema.index({ rawgId: 1 }, { unique: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
