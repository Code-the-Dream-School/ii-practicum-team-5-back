import mongoose from 'mongoose'

const StopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provide user'],
    },
    planId: {
      type: mongoose.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Provide plan'],
    },
    name: {
      type: String,
      required: [true, 'Provide name between 3 to 200 char length'],
      minLength: [3, 'Name min length is 3'],
      maxLength: [200, 'Name max length is 200'],
    },
    description: {
      type: String,
      maxLength: 255,
    },
    imageURL: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
      required: [true, 'Provide address'],
    },
    location: {
      type: [Number, Number],
      required: [true, 'Provide location'],
    },
    sequence: {
      type: Number,
      default: 0,
      required: [true, 'Provide sequence'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Stop', StopSchema)
