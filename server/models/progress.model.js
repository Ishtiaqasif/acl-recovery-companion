const mongoose = require('mongoose');

const ProgressEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  painLevel: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  swelling: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'severe'],
    required: true
  },
  flexion: {
    type: Number,
    min: 0,
    max: 150,
    required: true
  },
  extension: {
    type: Number,
    min: -30,
    max: 10,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

const ProgressEntry = mongoose.model('ProgressEntry', ProgressEntrySchema);

module.exports = ProgressEntry;