import mongoose from 'mongoose';
import Property from './Property.js';

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [5, 'Review comment must be at least 5 characters long'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from reviewing the same property multiple times for the same booking
reviewSchema.index({ user: 1, property: 1 }, { unique: true });

// Static method to calculate average rating and update property
reviewSchema.statics.calcAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: { property: new mongoose.Types.ObjectId(propertyId) },
    },
    {
      $group: {
        _id: '$property',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].numReviews,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

// Call calcAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.property);
});

// Call calcAverageRating after remove / delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.property);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
