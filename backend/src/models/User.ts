import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: 'user' | 'moderator' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  profilePicture?: string;
  dateOfBirth?: Date;
  location?: {
    county: string;
    city: string;
    coordinates?: [number, number];
  };
  emergencyContacts: {
    name: string;
    phoneNumber: string;
    relationship: string;
    isPrimary: boolean;
  }[];
  safetySettings: {
    shareLocationWithContacts: boolean;
    enableEmergencyAlert: boolean;
    enableAIModeration: boolean;
    blockUnknownContacts: boolean;
    autoReportThreats: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    shareLocation: boolean;
    shareStatus: boolean;
    allowDirectMessages: boolean;
  };
  twoFactorAuth: {
    enabled: boolean;
    secret?: string;
    backupCodes?: string[];
  };
  loginAttempts: number;
  lockUntil?: Date;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  lastLogin?: Date;
  ipAddresses?: string[];
  deviceInfo?: {
    userAgent: string;
    ip: string;
    lastUsed: Date;
  }[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    safety: boolean;
    marketing: boolean;
  };
  subscription: {
    plan: 'free' | 'premium';
    expiresAt?: Date;
    features: string[];
  };
  reportsMade: number;
  reportsReceived: number;
  safetyScore: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
  getVerificationToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  incrementLoginAttempts(): Promise<this>;
  resetLoginAttempts(): Promise<this>;
  isLocked(): boolean;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    match: [/^\+254[0-9]{9}$/, 'Please add a valid Kenyan phone number (+254XXXXXXXXX)']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one lowercase letter, uppercase letter, number, and special character'
    ],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 13; // Minimum age requirement
      },
      message: 'User must be at least 13 years old'
    }
  },
  location: {
    county: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    coordinates: {
      type: [Number]
    }
  },
  emergencyContacts: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Contact name cannot be more than 100 characters']
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\+254[0-9]{9}$/, 'Please add a valid Kenyan phone number']
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Relationship cannot be more than 50 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  safetySettings: {
    shareLocationWithContacts: { type: Boolean, default: false },
    enableEmergencyAlert: { type: Boolean, default: true },
    enableAIModeration: { type: Boolean, default: true },
    blockUnknownContacts: { type: Boolean, default: false },
    autoReportThreats: { type: Boolean, default: true }
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    },
    shareLocation: { type: Boolean, default: false },
    shareStatus: { type: Boolean, default: true },
    allowDirectMessages: { type: Boolean, default: true }
  },
  twoFactorAuth: {
    enabled: { type: Boolean, default: false },
    secret: String,
    backupCodes: [String]
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationTokenExpire: Date,
  lastLogin: Date,
  ipAddresses: [String],
  deviceInfo: [{
    userAgent: String,
    ip: String,
    lastUsed: { type: Date, default: Date.now }
  }],
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    safety: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    expiresAt: Date,
    features: [String]
  },
  reportsMade: { type: Number, default: 0 },
  reportsReceived: { type: Number, default: 0 },
  safetyScore: { type: Number, default: 100, min: 0, max: 100 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Index for location queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password with bcrypt
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  this.password = await bcrypt.hash(this.password, saltRounds);
  
  // Set password changed timestamp
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
  
  next();
});

// Method to match password
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get signed JWT token
userSchema.methods.getSignedJwtToken = function(): string {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = process.env.JWT_EXPIRE || '90d';
  
  return (jwt.sign as any)(
    { id: this._id.toString() }, 
    secret, 
    { expiresIn }
  );
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function(): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Method to generate verification token
userSchema.methods.getVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = function(): Promise<IUser> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        loginAttempts: 1
      },
      $unset: {
        lockUntil: 1
      }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !(this.lockUntil && this.lockUntil > Date.now())) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function(): Promise<IUser> {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

export const User = mongoose.model<IUser>('User', userSchema);
