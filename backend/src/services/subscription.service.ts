import { Subscription, ISubscription } from '../models/subscription.model';
import mongoose from 'mongoose';

export class SubscriptionService {
  static async createSubscription(userId: string, data: Partial<ISubscription>): Promise<ISubscription> {
    const nextBillingDate = this.calculateNextBillingDate(data.startDate!, data.billingCycle!);
    
    const subscription = new Subscription({
      ...data,
      nextBillingDate,
      userId: new mongoose.Types.ObjectId(userId),
    });
    return subscription.save();
  }

  static async getSubscriptions(userId: string): Promise<ISubscription[]> {
    return Subscription.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ nextBillingDate: 1 });
  }

  static async getUpcomingRenewals(userId: string, daysThreshold: number = 7): Promise<ISubscription[]> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysThreshold);

    return Subscription.find({
      userId: userObjId,
      status: 'active',
      nextBillingDate: { $gte: now, $lte: futureDate }
    }).sort({ nextBillingDate: 1 });
  }

  static async updateSubscription(userId: string, subId: string, data: Partial<ISubscription>): Promise<ISubscription | null> {
    let updateData = { ...data };
    
    // Recalculate billing date if start date or cycle changes
    if (data.startDate || data.billingCycle) {
      const existing = await Subscription.findById(subId);
      if (existing) {
        const start = data.startDate || existing.startDate;
        const cycle = data.billingCycle || existing.billingCycle;
        updateData.nextBillingDate = this.calculateNextBillingDate(start, cycle);
      }
    }

    return Subscription.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(subId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  static async deleteSubscription(userId: string, subId: string): Promise<boolean> {
    const result = await Subscription.deleteOne({
      _id: new mongoose.Types.ObjectId(subId),
      userId: new mongoose.Types.ObjectId(userId)
    });
    return result.deletedCount > 0;
  }

  // Helper method to compute upcoming renewal
  private static calculateNextBillingDate(startDate: Date, cycle: string): Date {
    const nextDate = new Date(startDate);
    const now = new Date();
    
    // Fast forward to next future date based on cycle
    while (nextDate <= now) {
      if (cycle === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (cycle === 'yearly') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else if (cycle === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      }
    }
    
    return nextDate;
  }
}
