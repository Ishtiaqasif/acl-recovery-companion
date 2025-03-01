const Resource = require('../models/resource.model');

// Create new resource
exports.createResource = async (req, res) => {
  try {
    // Add user id to request body
    if (req.user) {
      req.body.submittedBy = req.user.id;
      
      // If user is not admin, set approved to false
      if (req.user.role !== 'admin') {
        req.body.approved = false;
      }
    }
    
    const resource = await Resource.create(req.body);
    
    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all resources with pagination
exports.getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {
      approved: true // Only approved resources are public
    };
    
    // Filter by content type if provided
    if (req.query.contentType) {
      query.contentType = req.query.contentType;
    }
    
    // Filter by recoveryPhase if provided
    if (req.query.recoveryPhase) {
      query.recoveryPhase = req.query.recoveryPhase;
    }
    
    // Filter by tag if provided
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    
    // Filter by featured
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    
    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const total = await Resource.countDocuments(query);
    
    const resources = await Resource.find(query)
      .populate('submittedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single resource
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName');
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Increment view count
    resource.viewCount += 1;
    await resource.save();
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Make sure user is admin or owner of the resource
    if (
      (!req.user || req.user.id !== resource.submittedBy?.toString()) && 
      (!req.user || req.user.role !== 'admin')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this resource'
      });
    }
    
    // If user is not admin, don't allow updating approved status
    if (req.user.role !== 'admin') {
      delete req.body.approved;
      delete req.body.featured;
    }
    
    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Make sure user is admin or owner of the resource
    if (
      (!req.user || req.user.id !== resource.submittedBy?.toString()) && 
      (!req.user || req.user.role !== 'admin')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource'
      });
    }
    
    await resource.remove();
    
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

// Admin - Get all pending resources
exports.getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ approved: false })
      .populate('submittedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin - Approve resource
exports.approveResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    resource.approved = true;
    await resource.save();
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};