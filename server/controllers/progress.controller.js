const ProgressEntry = require('../models/progress.model');

// Create new progress entry
exports.createProgressEntry = async (req, res) => {
  try {
    // Add user id to request body
    req.body.user = req.user.id;
    
    const entry = await ProgressEntry.create(req.body);
    
    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all progress entries for current user
exports.getProgressEntries = async (req, res) => {
  try {
    const entries = await ProgressEntry.find({ user: req.user.id })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single progress entry
exports.getProgressEntry = async (req, res) => {
  try {
    const entry = await ProgressEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }
    
    // Make sure user owns the entry
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this entry'
      });
    }
    
    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update progress entry
exports.updateProgressEntry = async (req, res) => {
  try {
    let entry = await ProgressEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }
    
    // Make sure user owns the entry
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this entry'
      });
    }
    
    entry = await ProgressEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete progress entry
exports.deleteProgressEntry = async (req, res) => {
  try {
    const entry = await ProgressEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }
    
    // Make sure user owns the entry
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this entry'
      });
    }
    
    await entry.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};