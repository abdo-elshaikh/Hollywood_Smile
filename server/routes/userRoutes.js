// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createUser);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
