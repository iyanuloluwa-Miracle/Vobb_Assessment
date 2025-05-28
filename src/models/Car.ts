import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICar extends Document {
  brand: string;
  model: string;
  price: number;
  available: boolean;
  category: Types.ObjectId;
  year?: number;
  color?: string;
}

const CarSchema: Schema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  year: { type: Number },
  color: { type: String },
});

export default mongoose.model<ICar>('Car', CarSchema); 