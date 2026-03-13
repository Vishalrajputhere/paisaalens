import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  category: string;
  paymentMethod: string;
  description: string;
  date: Date;
  merchant: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    merchant: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Indexes
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1, date: -1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
