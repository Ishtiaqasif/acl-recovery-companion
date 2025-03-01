const express = require('express');
const router = express.Router();
const { 
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  markGoalAchieved,
  deleteGoal
} = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .get(getGoal)
  .put(updateGoal)
  .delete(deleteGoal);

router.route('/:id/achieve')
  .put(markGoalAchieved);

module.exports = router;