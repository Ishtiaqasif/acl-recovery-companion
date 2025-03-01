const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  target: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['mobility', 'strength', 'activity', 'pain'],
    required: true
  },
  achieved: {
    type: Boolean,
    default: false
  },
  achievedDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;