const express = require('express');
const router = express.Router();
const { 
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  getPendingResources,
  approveResource
} = require('../controllers/resource.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getResources);
router.get('/:id', getResource);

// Protected routes
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

// Admin routes
router.get('/admin/pending', protect, authorize(['admin']), getPendingResources);
router.put('/admin/approve/:id', protect, authorize(['admin']), approveResource);

module.exports = router;