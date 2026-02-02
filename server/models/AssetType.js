import mongoose from 'mongoose';

const assetTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  depreciationRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  warrantyMonths: {
    type: Number,
    default: 12,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  customFields: [{
    fieldName: String,
    fieldType: {
      type: String,
      enum: ['text', 'number', 'date', 'select', 'checkbox'],
      default: 'text'
    },
    isRequired: Boolean,
    options: [String] // For select fields
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
assetTypeSchema.index({ name: 1 });

export default mongoose.model('AssetType', assetTypeSchema);
