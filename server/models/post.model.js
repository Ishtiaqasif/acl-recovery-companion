const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['success-story', 'question', 'support', 'general', 'tip'],
    default: 'general'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema],
  tags: [{
    type: String,
    trim: true
  }],
  recoveryPhase: {
    type: String,
    enum: ['pre-op', 'early-recovery', 'strength-building', 'advanced-training', 'return-to-sport'],
    default: 'early-recovery'
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;