import PDFDocument from 'pdfkit';
import { Expense } from '../models/expense.model';
import mongoose from 'mongoose';
import { Writable } from 'stream';

export class ReportService {
  static async generateMonthlyPdf(userId: string, period: string, writeStream: Writable): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        const [year, month] = period.split('-');
        
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        const expenses = await Expense.find({
          userId: userObjId,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 }).lean();

        const doc = new PDFDocument({ margin: 50 });
        
        doc.pipe(writeStream);
        
        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);

        // Header
        doc.fontSize(24).text('PaisaaLens Financial Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Monthly Summary for ${startDate.toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });
        doc.moveDown(2);

        // Summary Statistics
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        const categoryGroups = expenses.reduce((acc: any, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        }, {});

        doc.fontSize(16).text('Executive Summary', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Total Expenses: Rs ${totalSpent.toFixed(2)}`);
        doc.text(`Total Transactions: ${expenses.length}`);
        doc.moveDown(2);

        // Category Breakdown
        doc.fontSize(16).text('Spending by Category', { underline: true });
        doc.moveDown();
        
        Object.entries(categoryGroups)
          .sort((a: any, b: any) => b[1] - a[1]) // Sort descending
          .forEach(([cat, amount]: any) => {
            const pct = ((amount / totalSpent) * 100).toFixed(1);
            doc.fontSize(12).text(`${cat}: Rs ${amount.toFixed(2)} (${pct}%)`);
          });
          
        doc.moveDown(2);

        // Detailed Transactions
        doc.addPage();
        doc.fontSize(16).text('Transaction Details', { underline: true });
        doc.moveDown();

        const tableTop = doc.y;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Date', 50, tableTop);
        doc.text('Description', 150, tableTop);
        doc.text('Category', 350, tableTop);
        doc.text('Amount', 450, tableTop, { align: 'right' });

        doc.moveTo(50, doc.y + 5).lineTo(500, doc.y + 5).stroke();

        let y = doc.y + 15;
        doc.font('Helvetica');
        
        for (const exp of expenses) {
          if (y > 700) {
            doc.addPage();
            y = 50;
            // Draw header again
            doc.font('Helvetica-Bold');
            doc.text('Date', 50, y);
            doc.text('Description', 150, y);
            doc.text('Category', 350, y);
            doc.text('Amount', 450, y, { align: 'right' });
            doc.moveTo(50, y + 5).lineTo(500, y + 5).stroke();
            y += 15;
            doc.font('Helvetica');
          }

          doc.text(exp.date.toISOString().split('T')[0], 50, y);
          // truncate description to 30 chars
          const desc = exp.description.length > 30 ? exp.description.substring(0, 27) + '...' : exp.description;
          doc.text(desc, 150, y);
          doc.text(exp.category, 350, y);
          doc.text(exp.amount.toFixed(2), 450, y, { align: 'right' });
          
          y += 20;
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
