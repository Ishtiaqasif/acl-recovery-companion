const express = require('express');
const router = express.Router();
const { 
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likePost
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comment routes
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

// Like route
router.put('/:id/like', protect, likePost);

module.exports = router;