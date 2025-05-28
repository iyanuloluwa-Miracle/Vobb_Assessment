import mongoose, { Document, Schema } from 'mongoose';

export interface ICar {
  brand: string;
  carModel: string;
  year: number;
  price: number;
  category: mongoose.Types.ObjectId;
  available: boolean;
  features: string[];
  images: string[];
  description: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  vin: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarDocument extends Document, ICar {}

const carSchema = new Schema<ICarDocument>({
  brand: { type: String, required: true },
  carModel: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  available: { type: Boolean, default: true },
  features: [{ type: String }],
  images: [{ type: String }],
  description: { type: String },
  mileage: { type: Number },
  fuelType: { type: String },
  transmission: { type: String },
  color: { type: String },
  vin: { type: String, unique: true },
}, {
  timestamps: true
});

export const Car = mongoose.model<ICarDocument>('Car', carSchema); 