import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ICategoryModel extends Model<ICategory> {
  // Add any static methods here if needed
}

const categorySchema = new Schema<ICategory, ICategoryModel>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true }
}, {
  timestamps: true
});

const Category = mongoose.model<ICategory, ICategoryModel>('Category', categorySchema);
export { Category }; 