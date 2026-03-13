import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  startDate: Date;
  nextBillingDate: Date;
  category: string;
  status: 'active' | 'cancelled';
  autoRenew: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    billingCycle: { type: String, enum: ['monthly', 'yearly', 'weekly'], required: true },
    startDate: { type: Date, required: true },
    nextBillingDate: { type: Date, required: true, index: true }, // Index for fast upcoming-renewal lookups
    category: { type: String, required: true },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    autoRenew: { type: Boolean, default: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
