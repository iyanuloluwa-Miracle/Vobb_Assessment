import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPurchase extends Document {
  car: Types.ObjectId;
  customer: Types.ObjectId;
  date: Date;
  price: number;
}

const PurchaseSchema: Schema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
});

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema); 