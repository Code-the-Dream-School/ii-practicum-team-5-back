import mongoose from 'mongoose'

const PlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provide user'],
    },
    title: {
      type: String,
      required: [true, 'Provide title between 3 to 200 char length'],
      minLength: [3, 'Title min length is 3'],
      maxLength: [200, 'Title max length is 200'],
    },
    description: {
      type: String,
      maxLength: 255,
    },
    images: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ['Full day', 'Half day', 'Night'],
    },
    stopCount: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    startLocation: {
      type: [Number, Number],
      required: [true, 'Provide start location'],
    },
    finishLocation: {
      type: [Number, Number],
      required: [true, 'Provide finish location'],
    },
    distance: {
      type: Number,
      default: 0,
      required: [true, 'Provide distance'],
    },
    duration: {
      type: Number,
      default: 0,
      required: [true, 'Provide duration'],
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Provide category'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Plan', PlanSchema)
