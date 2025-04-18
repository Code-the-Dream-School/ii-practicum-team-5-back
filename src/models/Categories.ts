import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  description?: string
  imageURL: string
  createdAt?: Date
  updatedAt?: Date
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide name between 3 to 50 char length'],
      minLength: [3, 'Name min length is 3'],
      maxLength: [50, 'Name max length is 50'],
    },
    description: {
      type: String,
      maxLength: 255,
    },
    imageURL: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ICategory>('Category', CategorySchema)
