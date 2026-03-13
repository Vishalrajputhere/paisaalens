import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  currency: string;
  monthlyIncome: number;
  goals: Array<{ name: string; target: number; saved: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    currency: { type: String, default: 'INR' },
    monthlyIncome: { type: Number, default: 0 },
    goals: [
      {
        name: { type: String },
        target: { type: Number },
        saved: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
