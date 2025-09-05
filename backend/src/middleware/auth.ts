import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { asyncHandler, createError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(createError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(createError('No user found with this id', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(createError('User account has been deactivated', 401));
    }

    // Check if user changed password after the token was issued
    if (user.passwordChangedAt && decoded.iat) {
      const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        return next(createError('User recently changed password! Please log in again.', 401));
      }
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return next(createError('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        createError(`User role ${req.user?.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

// Optional auth - doesn't throw error if no token
export const optionalAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Silent fail for optional auth
      logger.debug('Optional auth failed:', error);
    }
  }

  next();
});

// Admin only middleware
export const adminOnly = authorize('admin');

// Moderator or admin middleware
export const moderatorOrAdmin = authorize('moderator', 'admin');
