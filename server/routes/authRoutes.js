const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require('../controllers/authController');
const { protect, authorize} = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser); // POST /api/users/register
router.post('/login', loginUser); // POST /api/users/login

// Protected routes (Requires authentication)
router.get('/profile', protect, getUserProfile); // GET /api/users/profile
router.put('/profile', protect, updateUserProfile); // PUT /api/users/profile
router.put('/profile/change-password', protect, changePassword); // PUT /api/users/profile/password

module.exports = router;
