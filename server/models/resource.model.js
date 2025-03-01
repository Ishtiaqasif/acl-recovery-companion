const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['article', 'video', 'pdf', 'link', 'exercise'],
    required: true
  },
  url: {
    type: String,
    required: function() {
      return ['video', 'pdf', 'link'].includes(this.contentType);
    }
  },
  content: {
    type: String,
    required: function() {
      return this.contentType === 'article';
    }
  },
  author: {
    type: String,
    required: true
  },
  source: {
    type: String
  },
  recoveryPhase: {
    type: String,
    enum: ['all', 'pre-op', 'early-recovery', 'strength-building', 'advanced-training', 'return-to-sport'],
    default: 'all'
  },
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;