import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  getReportStats
} from '../controllers/report';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// All report routes require authentication
router.use(protect);

// Report creation validation
const reportValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn(['harassment', 'stalking', 'cyberbullying', 'threat', 'inappropriate_content', 'privacy_violation', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('evidenceUrls')
    .optional()
    .isArray()
    .withMessage('Evidence URLs must be an array'),
  body('evidenceUrls.*')
    .optional()
    .isURL()
    .withMessage('Invalid evidence URL format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each tag must be between 2 and 50 characters')
];

// Create new report
router.post('/',
  reportValidation,
  validateRequest,
  createReport
);

// Get reports
router.get('/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('category')
      .optional()
      .isIn(['harassment', 'stalking', 'cyberbullying', 'threat', 'inappropriate_content', 'privacy_violation', 'other'])
      .withMessage('Invalid category filter'),
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority filter'),
    query('status')
      .optional()
      .isIn(['pending', 'under_review', 'investigating', 'resolved', 'closed', 'dismissed'])
      .withMessage('Invalid status filter'),
    query('fromDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid fromDate format'),
    query('toDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid toDate format'),
    query('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query cannot exceed 100 characters')
  ],
  validateRequest,
  getReports
);

// Get specific report
router.get('/:reportId',
  param('reportId').isMongoId().withMessage('Invalid report ID'),
  validateRequest,
  getReport
);

// Update report
router.put('/:reportId',
  [
    param('reportId').isMongoId().withMessage('Invalid report ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('category')
      .optional()
      .isIn(['harassment', 'stalking', 'cyberbullying', 'threat', 'inappropriate_content', 'privacy_violation', 'other'])
      .withMessage('Invalid category'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority level'),
    body('status')
      .optional()
      .isIn(['pending', 'under_review', 'investigating', 'resolved', 'closed', 'dismissed'])
      .withMessage('Invalid status'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Location cannot exceed 200 characters'),
    body('evidenceUrls')
      .optional()
      .isArray()
      .withMessage('Evidence URLs must be an array'),
    body('evidenceUrls.*')
      .optional()
      .isURL()
      .withMessage('Invalid evidence URL format'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Each tag must be between 2 and 50 characters'),
    body('adminNotes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Admin notes cannot exceed 1000 characters'),
    body('resolutionDetails')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Resolution details cannot exceed 1000 characters')
  ],
  validateRequest,
  updateReport
);

// Delete report (admin only or report owner)
router.delete('/:reportId',
  param('reportId').isMongoId().withMessage('Invalid report ID'),
  validateRequest,
  deleteReport
);

// Get report statistics (admin/moderator only)
router.get('/stats/overview',
  authorize('admin', 'moderator'),
  [
    query('fromDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid fromDate format'),
    query('toDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid toDate format'),
    query('groupBy')
      .optional()
      .isIn(['day', 'week', 'month'])
      .withMessage('Invalid groupBy value')
  ],
  validateRequest,
  getReportStats
);

export default router;
