import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: string; // Since categories are open text, we store it as a string
  monthlyLimit: number;
  period: string; // "YYYY-MM"
  alertsEnabled: boolean;
  alertThreshold: number; // Percentage (e.g. 80 for 80%)
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    categoryId: { type: String, required: true },
    monthlyLimit: { type: Number, required: true },
    period: { type: String, required: true },
    alertsEnabled: { type: Boolean, default: true },
    alertThreshold: { type: Number, default: 80 },
  },
  { timestamps: true }
);

// We want only one budget per category per period per user
budgetSchema.index({ userId: 1, categoryId: 1, period: 1 }, { unique: true });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
