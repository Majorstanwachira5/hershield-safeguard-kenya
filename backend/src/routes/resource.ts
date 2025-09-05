import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  searchResources
} from '../controllers/resource';
import { protect, authorize, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Resource validation schema
const resourceValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['helpline', 'counseling', 'legal_aid', 'medical', 'shelter', 'education', 'government', 'ngo', 'other'])
    .withMessage('Invalid category'),
  body('contactInfo.phone')
    .optional()
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254XXXXXXXXX)'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('contactInfo.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('location.county')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('County name cannot exceed 100 characters'),
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot exceed 100 characters'),
  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters'),
  body('operatingHours')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Operating hours cannot exceed 200 characters'),
  body('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array'),
  body('services.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each service must be between 2 and 100 characters'),
  body('eligibility')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Eligibility cannot exceed 500 characters'),
  body('cost')
    .optional()
    .isIn(['free', 'paid', 'sliding_scale', 'insurance_covered'])
    .withMessage('Invalid cost type'),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  body('languages.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each language must be between 2 and 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each tag must be between 2 and 50 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('isEmergency')
    .optional()
    .isBoolean()
    .withMessage('isEmergency must be a boolean')
];

// Get resources (public access with optional auth for personalization)
router.get('/',
  optionalAuth,
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
      .isIn(['helpline', 'counseling', 'legal_aid', 'medical', 'shelter', 'education', 'government', 'ngo', 'other'])
      .withMessage('Invalid category filter'),
    query('county')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('County filter cannot exceed 100 characters'),
    query('city')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('City filter cannot exceed 100 characters'),
    query('cost')
      .optional()
      .isIn(['free', 'paid', 'sliding_scale', 'insurance_covered'])
      .withMessage('Invalid cost filter'),
    query('isEmergency')
      .optional()
      .isBoolean()
      .withMessage('isEmergency must be a boolean'),
    query('language')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Language filter cannot exceed 50 characters'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query cannot exceed 100 characters'),
    query('sortBy')
      .optional()
      .isIn(['name', 'category', 'location', 'rating', 'createdAt'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Invalid sort order')
  ],
  validateRequest,
  getResources
);

// Search resources (public access)
router.get('/search',
  optionalAuth,
  [
    query('q')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search query must be between 2 and 100 characters'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('category')
      .optional()
      .isIn(['helpline', 'counseling', 'legal_aid', 'medical', 'shelter', 'education', 'government', 'ngo', 'other'])
      .withMessage('Invalid category filter'),
    query('location')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location filter cannot exceed 100 characters')
  ],
  validateRequest,
  searchResources
);

// Get specific resource (public access)
router.get('/:resourceId',
  optionalAuth,
  param('resourceId').isMongoId().withMessage('Invalid resource ID'),
  validateRequest,
  getResource
);

// Create resource (admin/moderator only)
router.post('/',
  protect,
  authorize('admin', 'moderator'),
  resourceValidation,
  validateRequest,
  createResource
);

// Update resource (admin/moderator only)
router.put('/:resourceId',
  protect,
  authorize('admin', 'moderator'),
  [
    param('resourceId').isMongoId().withMessage('Invalid resource ID'),
    ...resourceValidation.map(validation => validation.optional())
  ],
  validateRequest,
  updateResource
);

// Delete resource (admin only)
router.delete('/:resourceId',
  protect,
  authorize('admin'),
  param('resourceId').isMongoId().withMessage('Invalid resource ID'),
  validateRequest,
  deleteResource
);

export default router;
