import mongoose, { Document, Schema } from 'mongoose';

export interface IEmi extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  principalAmount: number;
  interestRate: number; // Annual interest rate percentage
  tenureMonths: number;
  startDate: Date;
  emiAmount: number;
  remainingAmount: number;
  paidInstallments: number;
  bankName: string;
  autoDeduct: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const emiSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    principalAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    startDate: { type: Date, required: true },
    emiAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paidInstallments: { type: Number, default: 0 },
    bankName: { type: String, required: true },
    autoDeduct: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const EMI = mongoose.model<IEmi>('EMI', emiSchema);
