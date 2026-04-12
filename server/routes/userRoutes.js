const express = require('express');
const { requireAdmin, requireAuth } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getUsageReport,
  getMyCommentHistory,
  getAllComments,
} = require('../controllers/userController');

const router = express.Router();

router.get('/me/comments', requireAuth, getMyCommentHistory);
router.get('/comments', requireAdmin, getAllComments);
router.get('/reports/usage', requireAdmin, getUsageReport);
router.get('/', requireAdmin, getAllUsers);
router.put('/:userId/role', requireAdmin, updateUserRole);
router.put('/:userId/status', requireAdmin, updateUserStatus);

module.exports = router;
