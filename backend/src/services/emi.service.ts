import { EMI, IEmi } from '../models/emi.model';
import mongoose from 'mongoose';

export class EmiService {
  static async createEmi(userId: string, data: Partial<IEmi>): Promise<IEmi> {
    // Calculate EMI Amount using standard formula: P x R x (1+R)^N / [(1+R)^N-1]
    // P = Principal, R = Monthly Interest (Annual/12/100), N = Tenure in months
    const p = data.principalAmount!;
    const r = (data.interestRate! / 12) / 100;
    const n = data.tenureMonths!;
    
    let emiAmount = 0;
    if (r === 0) {
      emiAmount = p / n;
    } else {
      emiAmount = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    
    // Total amount to be paid
    const totalAmount = emiAmount * n;
    
    const emi = new EMI({
      ...data,
      emiAmount,
      remainingAmount: totalAmount,
      paidInstallments: 0,
      userId: new mongoose.Types.ObjectId(userId)
    });
    
    return emi.save();
  }

  static async getEmis(userId: string): Promise<IEmi[]> {
    return EMI.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ startDate: -1 });
  }

  static async recordPayment(userId: string, emiId: string): Promise<IEmi | null> {
    const objId = new mongoose.Types.ObjectId(emiId);
    const userObjId = new mongoose.Types.ObjectId(userId);
    
    const emi = await EMI.findOne({ _id: objId, userId: userObjId });
    if (!emi || !emi.active || emi.paidInstallments >= emi.tenureMonths) {
      return null;
    }

    emi.paidInstallments += 1;
    emi.remainingAmount = Math.max(0, emi.remainingAmount - emi.emiAmount);
    
    if (emi.paidInstallments >= emi.tenureMonths || emi.remainingAmount === 0) {
      emi.active = false;
      emi.remainingAmount = 0;
    }

    return emi.save();
  }

  static async deleteEmi(userId: string, emiId: string): Promise<boolean> {
    const result = await EMI.deleteOne({
      _id: new mongoose.Types.ObjectId(emiId),
      userId: new mongoose.Types.ObjectId(userId)
    });
    return result.deletedCount > 0;
  }
}
