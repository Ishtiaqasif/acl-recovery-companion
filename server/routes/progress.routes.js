const express = require('express');
const router = express.Router();
const { 
  createProgressEntry,
  getProgressEntries,
  getProgressEntry,
  updateProgressEntry,
  deleteProgressEntry
} = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getProgressEntries)
  .post(createProgressEntry);

router.route('/:id')
  .get(getProgressEntry)
  .put(updateProgressEntry)
  .delete(deleteProgressEntry);

module.exports = router;