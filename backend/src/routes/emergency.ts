import express from 'express';
import { body } from 'express-validator';
import {
  triggerEmergencyAlert,
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyHistory,
  reportEmergency,
  getLocalResources,
  sendSafetyCheckIn
} from '../controllers/emergency';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// All emergency routes require authentication
router.use(protect);

// Emergency alert validation
const emergencyAlertValidation = [
  body('emergencyType')
    .isIn(['harassment', 'stalking', 'threat', 'assault', 'domestic_violence', 'cyberbullying', 'other'])
    .withMessage('Invalid emergency type'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  body('contacts')
    .optional()
    .isArray()
    .withMessage('Contacts must be an array'),
  body('contacts.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid contact ID')
];

// Emergency contact validation
const emergencyContactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phoneNumber')
    .matches(/^\+254[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number (+254XXXXXXXXX)'),
  body('relationship')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Relationship must be between 2 and 50 characters'),
  body('isPrimary')
    .optional()
    .isBoolean()
    .withMessage('isPrimary must be a boolean'),
  body('canReceiveAlerts')
    .optional()
    .isBoolean()
    .withMessage('canReceiveAlerts must be a boolean')
];

// Emergency report validation
const emergencyReportValidation = [
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('emergencyType')
    .isIn(['harassment', 'stalking', 'threat', 'assault', 'domestic_violence', 'cyberbullying', 'other'])
    .withMessage('Invalid emergency type'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  body('isOngoing')
    .optional()
    .isBoolean()
    .withMessage('isOngoing must be a boolean'),
  body('evidenceUrls')
    .optional()
    .isArray()
    .withMessage('Evidence URLs must be an array'),
  body('evidenceUrls.*')
    .optional()
    .isURL()
    .withMessage('Invalid evidence URL format')
];

// Safety check-in validation
const safetyCheckInValidation = [
  body('status')
    .isIn(['safe', 'unsafe', 'help_needed', 'emergency'])
    .withMessage('Invalid safety status'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  body('coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('coordinates.*')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid coordinate value')
];

// Emergency alert routes
router.post('/alert', emergencyAlertValidation, validateRequest, triggerEmergencyAlert);
router.post('/report', emergencyReportValidation, validateRequest, reportEmergency);
router.post('/check-in', safetyCheckInValidation, validateRequest, sendSafetyCheckIn);

// Emergency contacts management
router.get('/contacts', getEmergencyContacts);
router.post('/contacts', emergencyContactValidation, validateRequest, addEmergencyContact);
router.put('/contacts/:contactId', emergencyContactValidation, validateRequest, updateEmergencyContact);
router.delete('/contacts/:contactId', deleteEmergencyContact);

// Emergency history and resources
router.get('/history', getEmergencyHistory);
router.get('/resources', getLocalResources);

export default router;
