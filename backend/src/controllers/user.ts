import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { User } from '../models/User';
import { logger } from '../utils/logger';

// @desc    Get users (admin only)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isActive
  } = req.query;

  const query: any = {};
  
  // Add filters
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  
  const users = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(parseInt(limit as string))
    .sort({ createdAt: -1 });
    
  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        current: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
        total
      }
    }
  });
});

// @desc    Get specific user
// @route   GET /api/v1/users/:userId
// @access  Private
export const getUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  // Users can only view their own profile unless admin/moderator
  if (req.user.id !== userId && !['admin', 'moderator'].includes(req.user.role)) {
    return next(createError('Not authorized to view this user', 403));
  }
  
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    return next(createError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
});

// @desc    Update user safety settings
// @route   PUT /api/v1/users/safety-settings
// @access  Private
export const updateUserSafetySettings = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowedFields = [
    'shareLocationWithContacts',
    'enableEmergencyAlert',
    'enableAIModeration',
    'blockUnknownContacts',
    'autoReportThreats'
  ];

  const updates: any = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[`safetySettings.${key}`] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(createError('User not found', 404));
  }

  logger.info(`Safety settings updated for user: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Safety settings updated successfully',
    data: { user }
  });
});

// @desc    Update user privacy settings
// @route   PUT /api/v1/users/privacy-settings
// @access  Private
export const updateUserPrivacySettings = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowedFields = [
    'profileVisibility',
    'shareLocation',
    'shareStatus',
    'allowDirectMessages'
  ];

  const updates: any = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[`privacySettings.${key}`] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(createError('User not found', 404));
  }

  logger.info(`Privacy settings updated for user: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Privacy settings updated successfully',
    data: { user }
  });
});

// @desc    Get user statistics
// @route   GET /api/v1/users/:userId/stats
// @access  Private
export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  // Users can only view their own stats unless admin/moderator
  if (req.user.id !== userId && !['admin', 'moderator'].includes(req.user.role)) {
    return next(createError('Not authorized to view these stats', 403));
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return next(createError('User not found', 404));
  }

  const stats = {
    safetyScore: user.safetyScore,
    reportsMade: user.reportsMade,
    reportsReceived: user.reportsReceived,
    accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    lastLogin: user.lastLogin,
    isVerified: user.isVerified,
    twoFactorEnabled: user.twoFactorAuth.enabled
  };

  res.status(200).json({
    success: true,
    data: { stats }
  });
});

// @desc    Block user (admin/moderator only)
// @route   POST /api/v1/users/:userId/block
// @access  Private/Admin/Moderator
export const blockUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { reason } = req.body;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(createError('User not found', 404));
  }

  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  logger.warn(`User blocked: ${user.email} by ${req.user.email}. Reason: ${reason}`);

  res.status(200).json({
    success: true,
    message: 'User blocked successfully'
  });
});

// @desc    Unblock user (admin/moderator only)
// @route   POST /api/v1/users/:userId/unblock
// @access  Private/Admin/Moderator
export const unblockUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(createError('User not found', 404));
  }

  user.isActive = true;
  await user.save({ validateBeforeSave: false });

  logger.info(`User unblocked: ${user.email} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'User unblocked successfully'
  });
});

// @desc    Deactivate user (admin only)
// @route   POST /api/v1/users/:userId/deactivate
// @access  Private/Admin
export const deactivateUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { reason } = req.body;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(createError('User not found', 404));
  }

  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  logger.warn(`User deactivated: ${user.email} by ${req.user.email}. Reason: ${reason}`);

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully'
  });
});

// @desc    Reactivate user (admin only)
// @route   POST /api/v1/users/:userId/reactivate
// @access  Private/Admin
export const reactivateUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(createError('User not found', 404));
  }

  user.isActive = true;
  await user.save({ validateBeforeSave: false });

  logger.info(`User reactivated: ${user.email} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'User reactivated successfully'
  });
});
