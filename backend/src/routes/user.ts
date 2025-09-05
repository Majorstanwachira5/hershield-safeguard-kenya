import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUserSafetySettings,
  updateUserPrivacySettings,
  getUserStats,
  blockUser,
  unblockUser,
  deactivateUser,
  reactivateUser
} from '../controllers/user';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Safety settings validation
const safetySettingsValidation = [
  body('shareLocationWithContacts')
    .optional()
    .isBoolean()
    .withMessage('shareLocationWithContacts must be a boolean'),
  body('enableEmergencyAlert')
    .optional()
    .isBoolean()
    .withMessage('enableEmergencyAlert must be a boolean'),
  body('enableAIModeration')
    .optional()
    .isBoolean()
    .withMessage('enableAIModeration must be a boolean'),
  body('blockUnknownContacts')
    .optional()
    .isBoolean()
    .withMessage('blockUnknownContacts must be a boolean'),
  body('autoReportThreats')
    .optional()
    .isBoolean()
    .withMessage('autoReportThreats must be a boolean')
];

// Privacy settings validation
const privacySettingsValidation = [
  body('profileVisibility')
    .optional()
    .isIn(['public', 'friends', 'private'])
    .withMessage('Invalid profile visibility option'),
  body('shareLocation')
    .optional()
    .isBoolean()
    .withMessage('shareLocation must be a boolean'),
  body('shareStatus')
    .optional()
    .isBoolean()
    .withMessage('shareStatus must be a boolean'),
  body('allowDirectMessages')
    .optional()
    .isBoolean()
    .withMessage('allowDirectMessages must be a boolean')
];

// Get users (admin only)
router.get('/', 
  authorize('admin', 'moderator'),
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query cannot exceed 100 characters'),
    query('role')
      .optional()
      .isIn(['user', 'moderator', 'admin'])
      .withMessage('Invalid role filter'),
    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ],
  validateRequest,
  getUsers
);

// Get specific user
router.get('/:userId',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  getUser
);

// Update user safety settings
router.put('/safety-settings',
  safetySettingsValidation,
  validateRequest,
  updateUserSafetySettings
);

// Update user privacy settings
router.put('/privacy-settings',
  privacySettingsValidation,
  validateRequest,
  updateUserPrivacySettings
);

// Get user statistics
router.get('/:userId/stats',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  getUserStats
);

// Block user (admin/moderator only)
router.post('/:userId/block',
  authorize('admin', 'moderator'),
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('reason')
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  validateRequest,
  blockUser
);

// Unblock user (admin/moderator only)
router.post('/:userId/unblock',
  authorize('admin', 'moderator'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  unblockUser
);

// Deactivate user (admin only)
router.post('/:userId/deactivate',
  authorize('admin'),
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('reason')
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],
  validateRequest,
  deactivateUser
);

// Reactivate user (admin only)
router.post('/:userId/reactivate',
  authorize('admin'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  reactivateUser
);

export default router;
