import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { sendEmail } from '../services/emailService';
import { generateQRCode, generateSecret } from '../services/twoFactorService';

// Helper function to send token response
const sendTokenResponse = (user: IUser, statusCode: number, res: Response, req: Request, message: string = 'Success') => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '90') * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
  };

  // Update last login and device info
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip || '127.0.0.1';
  
  user.lastLogin = new Date();
  user.ipAddresses = user.ipAddresses || [];
  
  if (!user.ipAddresses.includes(ip)) {
    user.ipAddresses.push(ip);
  }
  
  user.deviceInfo = user.deviceInfo || [];
  const existingDevice = user.deviceInfo.find(device => device.ip === ip && device.userAgent === userAgent);
  
  if (existingDevice) {
    existingDevice.lastUsed = new Date();
  } else {
    user.deviceInfo.push({
      userAgent,
      ip,
      lastUsed: new Date()
    });
  }
  
  user.save({ validateBeforeSave: false });

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture,
          subscription: user.subscription,
          safetyScore: user.safetyScore
        }
      }
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    dateOfBirth,
    location
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createError('User with this email already exists', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    dateOfBirth,
    location
  });

  // Generate verification token
  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    const verificationUrl = `${process.env.CLIENT_BASE_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'HerShield Account Verification',
      template: 'verification',
      data: {
        firstName: user.firstName,
        verificationUrl
      }
    });
  } catch (error) {
    logger.error('Email send error:', error);
    // Don't fail registration if email fails
  }

  logger.info(`New user registered: ${user.email}`);
  sendTokenResponse(user, 201, res, req, 'User registered successfully. Please check your email to verify your account.');
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(createError('Invalid credentials', 401));
  }

  // Check if account is locked
  if (user.isLocked()) {
    return next(createError('Account temporarily locked due to too many failed login attempts', 423));
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Increment login attempts
    await user.incrementLoginAttempts();
    logger.warn(`Failed login attempt for user: ${email} from IP: ${req.ip}`);
    return next(createError('Invalid credentials', 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(createError('Account has been deactivated', 401));
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  logger.info(`User logged in: ${user.email} from IP: ${req.ip}`);
  sendTokenResponse(user, 200, res, req, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res
    .status(200)
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    .json({
      success: true,
      message: 'User logged out successfully'
    });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id).populate('emergencyContacts');

  res.status(200).json({
    success: true,
    data: { user }
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const fieldsToUpdate: any = {};
  const allowedFields = [
    'firstName', 
    'lastName', 
    'phoneNumber', 
    'location',
    'emergencyContacts',
    'safetySettings',
    'privacySettings',
    'notifications'
  ];

  // Only include allowed fields
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      fieldsToUpdate[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  logger.info(`User profile updated: ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/password
// @access  Private
export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(createError('User not found', 404));
  }

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(createError('Current password is incorrect', 400));
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password updated for user: ${user.email}`);
  sendTokenResponse(user, 200, res, req, 'Password updated successfully');
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(createError('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_BASE_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'HerShield Password Reset',
      template: 'password-reset',
      data: {
        firstName: user.firstName,
        resetUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    logger.error('Email send error:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(createError('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(createError('Invalid or expired token', 400));
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  logger.info(`Password reset successful for user: ${user.email}`);
  sendTokenResponse(user, 200, res, req, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Get hashed token
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(createError('Invalid or expired verification token', 400));
  }

  // Mark as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info(`Email verified for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
// @access  Private
export const resendVerification = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(createError('User not found', 404));
  }

  if (user.isVerified) {
    return next(createError('User is already verified', 400));
  }

  // Generate new verification token
  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    const verificationUrl = `${process.env.CLIENT_BASE_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'HerShield Account Verification',
      template: 'verification',
      data: {
        firstName: user.firstName,
        verificationUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    logger.error('Email send error:', error);
    return next(createError('Email could not be sent', 500));
  }
});

// @desc    Enable 2FA
// @route   POST /api/v1/auth/2fa/enable
// @access  Private
export const enable2FA = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(createError('User not found', 404));
  }

  if (user.twoFactorAuth.enabled) {
    return next(createError('2FA is already enabled', 400));
  }

  // Generate secret
  const secret = generateSecret(user.email);
  const qrCodeUrl = await generateQRCode(`HerShield:${user.email}`, secret);

  // Store secret (not enabled yet)
  user.twoFactorAuth.secret = secret;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Scan the QR code with your authenticator app',
    data: {
      secret,
      qrCodeUrl
    }
  });
});

// @desc    Verify and enable 2FA
// @route   POST /api/v1/auth/2fa/verify
// @access  Private
export const verify2FA = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { token } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(createError('User not found', 404));
  }

  if (!user.twoFactorAuth.secret) {
    return next(createError('2FA setup not initiated', 400));
  }

  // Verify token (implementation would depend on your 2FA library)
  // For now, we'll simulate verification
  const isValid = true; // Replace with actual verification logic

  if (!isValid) {
    return next(createError('Invalid 2FA token', 400));
  }

  // Enable 2FA
  user.twoFactorAuth.enabled = true;
  await user.save({ validateBeforeSave: false });

  logger.info(`2FA enabled for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: '2FA enabled successfully'
  });
});

// @desc    Disable 2FA
// @route   DELETE /api/v1/auth/2fa/disable
// @access  Private
export const disable2FA = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(createError('User not found', 404));
  }

  if (!user.twoFactorAuth.enabled) {
    return next(createError('2FA is not enabled', 400));
  }

  // Disable 2FA
  user.twoFactorAuth.enabled = false;
  user.twoFactorAuth.secret = undefined;
  user.twoFactorAuth.backupCodes = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info(`2FA disabled for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: '2FA disabled successfully'
  });
});
