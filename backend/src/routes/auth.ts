import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  enable2FA,
  verify2FA,
  disable2FA
} from '../controllers/auth';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Registration validation
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, uppercase letter, number, and special character'),
  
  body('phoneNumber')
    .optional()
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254XXXXXXXXX)'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        throw new Error('You must be at least 13 years old to register');
      }
      return true;
    }),
  
  body('location.county')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('County name cannot exceed 100 characters'),
  
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Password update validation
const passwordUpdateValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, uppercase letter, number, and special character')
];

// Profile update validation
const profileUpdateValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('phoneNumber')
    .optional()
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254XXXXXXXXX)'),
  
  body('location.county')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('County name cannot exceed 100 characters'),
  
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters')
];

// Email validation
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Authentication routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', logout);

// Profile management (protected routes)
router.get('/me', protect, getMe);
router.put('/profile', protect, profileUpdateValidation, validateRequest, updateProfile);
router.put('/password', protect, passwordUpdateValidation, validateRequest, updatePassword);

// Password reset
router.post('/forgot-password', emailValidation, validateRequest, forgotPassword);
router.put('/reset-password/:resetToken', passwordUpdateValidation, validateRequest, resetPassword);

// Email verification
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', protect, resendVerification);

// Two-factor authentication
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify', protect, 
  body('token').isLength({ min: 6, max: 6 }).withMessage('2FA token must be 6 digits'),
  validateRequest,
  verify2FA
);
router.delete('/2fa/disable', protect, disable2FA);

export default router;
