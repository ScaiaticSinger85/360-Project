const express = require('express');
const { getAllUsers, updateUserRole, updateUserStatus } = require('../controllers/usersController');

const router = express.Router();

router.get('/', getAllUsers);
router.put('/:userId/role', updateUserRole);
router.put('/:userId/status', updateUserStatus);

module.exports = router;
