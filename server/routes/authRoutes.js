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
router.post('/register', registerUser); // POST /api/auth/register
router.post('/login', loginUser); // POST /api/auth/login

// Protected routes (Requires authentication)
router.get('/profile', protect, getUserProfile); // GET /api/auth/profile
router.put('/profile', protect, updateUserProfile); // PUT /api/auth/profile
router.put('/profile/change-password', protect, changePassword); // PUT /api/auth/profile/password

module.exports = router;
