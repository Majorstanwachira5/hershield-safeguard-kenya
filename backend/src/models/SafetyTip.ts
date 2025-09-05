import mongoose, { Document, Schema } from 'mongoose';

export interface ISafetyTip extends Document {
  title: string;
  content: string;
  category: 'privacy' | 'harassment' | 'emergency' | 'dating' | 'workplace' | 'general';
  priority: number;
  isActive: boolean;
  tags: string[];
  author: mongoose.Types.ObjectId;
  views: number;
  likes: number;
  shares: number;
  targetAudience: 'all' | 'teens' | 'young_adults' | 'adults';
  language: string;
  source?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const safetyTipSchema = new Schema<ISafetyTip>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['privacy', 'harassment', 'emergency', 'dating', 'workplace', 'general'],
    index: true
  },
  priority: {
    type: Number,
    default: 5,
    min: [1, 'Priority must be at least 1'],
    max: [10, 'Priority cannot exceed 10'],
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  targetAudience: {
    type: String,
    enum: ['all', 'teens', 'young_adults', 'adults'],
    default: 'all'
  },
  language: {
    type: String,
    default: 'en',
    trim: true,
    maxlength: [10, 'Language code cannot exceed 10 characters']
  },
  source: {
    type: String,
    trim: true,
    maxlength: [200, 'Source cannot exceed 200 characters']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
safetyTipSchema.index({ category: 1, isActive: 1, priority: -1 });
safetyTipSchema.index({ tags: 1, isActive: 1 });
safetyTipSchema.index({ targetAudience: 1, category: 1 });
safetyTipSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for engagement score
safetyTipSchema.virtual('engagementScore').get(function() {
  return this.views + (this.likes * 2) + (this.shares * 5);
});

// Pre-save middleware
safetyTipSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to get tips by category
safetyTipSchema.statics.getByCategory = function(category: string, options: any = {}) {
  const {
    limit = 10,
    isActive = true,
    targetAudience = 'all'
  } = options;

  let query: any = { category, isActive };
  
  if (targetAudience !== 'all') {
    query.$or = [
      { targetAudience: targetAudience },
      { targetAudience: 'all' }
    ];
  }

  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName');
};

// Static method for search
safetyTipSchema.statics.search = function(searchTerm: string, options: any = {}) {
  const {
    limit = 20,
    category,
    isActive = true
  } = options;

  let query: any = {
    $text: { $search: searchTerm },
    isActive
  };

  if (category) {
    query.category = category;
  }

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, priority: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName');
};

export const SafetyTip = mongoose.model<ISafetyTip>('SafetyTip', safetyTipSchema);
