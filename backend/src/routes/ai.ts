import express from 'express';
import { body } from 'express-validator';
import {
  analyzeMessage,
  detectThreat,
  generateSafetyAdvice,
  moderateContent,
  analyzeSentiment,
  checkForHarassment,
  generateEmergencyResponse,
  assessRiskLevel
} from '../controllers/ai';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Content analysis validation
const contentAnalysisValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters')
];

const messageAnalysisValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('sender')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Sender name cannot exceed 100 characters'),
  body('context')
    .optional()
    .isIn(['social_media', 'direct_message', 'email', 'comment', 'unknown'])
    .withMessage('Invalid context type')
];

const safetyAdviceValidation = [
  body('situation')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Situation description must be between 5 and 500 characters'),
  body('category')
    .optional()
    .isIn(['harassment', 'stalking', 'privacy', 'dating', 'workplace', 'general'])
    .withMessage('Invalid category')
];

// AI analysis routes (all require authentication)
router.use(protect);

// Message analysis for threat detection
router.post('/analyze-message', 
  messageAnalysisValidation, 
  validateRequest, 
  analyzeMessage
);

// General threat detection
router.post('/detect-threat', 
  contentAnalysisValidation, 
  validateRequest, 
  detectThreat
);

// Content moderation
router.post('/moderate-content', 
  contentAnalysisValidation, 
  validateRequest, 
  moderateContent
);

// Harassment detection
router.post('/check-harassment', 
  contentAnalysisValidation, 
  validateRequest, 
  checkForHarassment
);

// Sentiment analysis
router.post('/analyze-sentiment', 
  contentAnalysisValidation, 
  validateRequest, 
  analyzeSentiment
);

// Safety advice generation
router.post('/safety-advice', 
  safetyAdviceValidation, 
  validateRequest, 
  generateSafetyAdvice
);

// Risk assessment
router.post('/assess-risk', 
  [
    body('factors')
      .isArray({ min: 1 })
      .withMessage('Risk factors must be provided as an array'),
    body('factors.*')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Each risk factor must be between 1 and 200 characters'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location cannot exceed 100 characters'),
    body('timeOfDay')
      .optional()
      .isIn(['morning', 'afternoon', 'evening', 'night', 'late_night'])
      .withMessage('Invalid time of day')
  ], 
  validateRequest, 
  assessRiskLevel
);

// Emergency response generation
router.post('/emergency-response', 
  [
    body('emergencyType')
      .isIn(['harassment', 'stalking', 'threat', 'assault', 'domestic_violence', 'cyberbullying', 'other'])
      .withMessage('Invalid emergency type'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Location cannot exceed 200 characters'),
    body('immediateHelp')
      .optional()
      .isBoolean()
      .withMessage('immediateHelp must be a boolean'),
    body('details')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Details cannot exceed 1000 characters')
  ], 
  validateRequest, 
  generateEmergencyResponse
);

export default router;
