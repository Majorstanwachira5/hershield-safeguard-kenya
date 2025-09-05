import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

export const getResources = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const sampleResources = [
    {
      name: 'Gender Violence Recovery Centre',
      description: 'Comprehensive support for survivors of gender-based violence',
      category: 'counseling',
      contactInfo: {
        phone: '+254 709 991 000',
        email: 'info@gvrc.or.ke'
      },
      location: {
        county: 'Nairobi',
        city: 'Nairobi'
      },
      isActive: true,
      isEmergency: true
    }
  ];
  res.status(200).json({ success: true, data: { resources: sampleResources } });
});

export const searchResources = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, data: { resources: [] } });
});

export const getResource = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, data: { resource: {} } });
});

export const createResource = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(201).json({ success: true, message: 'Resource created successfully' });
});

export const updateResource = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'Resource updated successfully' });
});

export const deleteResource = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'Resource deleted successfully' });
});
