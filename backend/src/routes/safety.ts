import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getSafetyDashboard,
  getThreatReports,
  getThreatReport,
  updateThreatReportStatus,
  deleteThreatReport,
  getSafetyMetrics,
  getSafetyTips,
  createSafetyTip,
  updateSafetyTip,
  deleteSafetyTip
} from '../controllers/safety';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// All safety routes require authentication
router.use(protect);

// Get safety dashboard
router.get('/dashboard', getSafetyDashboard);

// Get safety metrics
router.get('/metrics', getSafetyMetrics);

// Threat reports management
router.get('/reports',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['pending_review', 'under_investigation', 'resolved', 'dismissed', 'urgent'])
      .withMessage('Invalid status filter'),
    query('riskLevel')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Invalid risk level filter'),
    query('threatType')
      .optional()
      .isIn(['harassment', 'cyberbullying', 'stalking', 'hate_speech', 'sexual_harassment', 
             'doxxing', 'impersonation', 'threats_of_violence', 'blackmail', 'image_abuse',
             'domestic_violence', 'assault', 'other'])
      .withMessage('Invalid threat type filter')
  ],
  validateRequest,
  getThreatReports
);

// Get specific threat report
router.get('/reports/:reportId',
  param('reportId').isMongoId().withMessage('Invalid report ID'),
  validateRequest,
  getThreatReport
);

// Update threat report status (admin/moderator only)
router.put('/reports/:reportId/status',
  authorize('admin', 'moderator'),
  [
    param('reportId').isMongoId().withMessage('Invalid report ID'),
    body('status')
      .isIn(['pending_review', 'under_investigation', 'resolved', 'dismissed', 'urgent'])
      .withMessage('Invalid status'),
    body('reviewNotes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Review notes cannot exceed 1000 characters'),
    body('actionTaken')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Action taken cannot exceed 500 characters'),
    body('resolutionType')
      .optional()
      .isIn(['no_action', 'warning_sent', 'account_suspended', 'authorities_contacted', 'support_provided'])
      .withMessage('Invalid resolution type')
  ],
  validateRequest,
  updateThreatReportStatus
);

// Delete threat report (admin only)
router.delete('/reports/:reportId',
  authorize('admin'),
  param('reportId').isMongoId().withMessage('Invalid report ID'),
  validateRequest,
  deleteThreatReport
);

// Safety tips management
router.get('/tips',
  [
    query('category')
      .optional()
      .isIn(['privacy', 'harassment', 'emergency', 'dating', 'workplace', 'general'])
      .withMessage('Invalid category filter'),
    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ],
  validateRequest,
  getSafetyTips
);

// Create safety tip (admin/moderator only)
router.post('/tips',
  authorize('admin', 'moderator'),
  [
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('content')
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Content must be between 20 and 2000 characters'),
    body('category')
      .isIn(['privacy', 'harassment', 'emergency', 'dating', 'workplace', 'general'])
      .withMessage('Invalid category'),
    body('priority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Each tag must be between 2 and 50 characters')
  ],
  validateRequest,
  createSafetyTip
);

// Update safety tip (admin/moderator only)
router.put('/tips/:tipId',
  authorize('admin', 'moderator'),
  [
    param('tipId').isMongoId().withMessage('Invalid tip ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Content must be between 20 and 2000 characters'),
    body('category')
      .optional()
      .isIn(['privacy', 'harassment', 'emergency', 'dating', 'workplace', 'general'])
      .withMessage('Invalid category'),
    body('priority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Each tag must be between 2 and 50 characters')
  ],
  validateRequest,
  updateSafetyTip
);

// Delete safety tip (admin only)
router.delete('/tips/:tipId',
  authorize('admin'),
  param('tipId').isMongoId().withMessage('Invalid tip ID'),
  validateRequest,
  deleteSafetyTip
);

export default router;
