import { ExpenseService } from './expense.service';

interface ParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

export class CsvParserService {
  // Simple heuristic mapping
  private static categoryRules = [
    { keywords: ['ZOMATO', 'SWIGGY', 'RESTAURANT', 'FOOD', 'CAFE', 'STARBUCKS'], category: 'Food' },
    { keywords: ['UBER', 'OLA', 'METRO', 'IRCTC', 'PETROL', 'FUEL'], category: 'Travel' },
    { keywords: ['AMAZON', 'FLIPKART', 'MYNTRA', 'SHOPPING', 'PAYTM'], category: 'Shopping' },
    { keywords: ['NETFLIX', 'SPOTIFY', 'HOTSTAR', 'SUBSCRIPTION'], category: 'Entertainment' },
    { keywords: ['PHARMACY', 'APOLLO', 'HOSPITAL', 'CLINIC', 'MEDICAL'], category: 'Medical' },
    { keywords: ['JIO', 'AIRTEL', 'RECHARGE', 'WIFI', 'ELECTRICITY', 'BILL'], category: 'Utilities' },
    { keywords: ['RENT', 'LANDLORD', 'MAINTENANCE'], category: 'Rent' },
    { keywords: ['GROCERY', 'SUPERMARKET', 'DMART', 'BIGBASKET', 'BLINKIT'], category: 'Groceries' }
  ];

  static async parseAndImport(
    userId: string,
    csvContent: string,
    mappings: { date: string, description: string, amount: string }
  ): Promise<{ imported: number, errors: number }> {
    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) return { imported: 0, errors: 0 }; // Only header or empty
    
    // Naive CSV parser respecting quotes
    const parseLine = (line: string) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += line[i];
        }
      }
      result.push(current);
      return result;
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase());
    
    // Find column indexes based on user mappings
    const dateIdx = headers.indexOf(mappings.date);
    const descIdx = headers.indexOf(mappings.description);
    const amountIdx = headers.indexOf(mappings.amount);

    if (dateIdx === -1 || descIdx === -1 || amountIdx === -1) {
      throw { statusCode: 400, message: 'Invalid column mapping. Headers not found.' };
    }

    let imported = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length <= Math.max(dateIdx, descIdx, amountIdx)) {
        errors++;
        continue;
      }

      try {
        const dateStr = cols[dateIdx];
        const descStr = cols[descIdx];
        const amountStr = cols[amountIdx].replace(/,/g, ''); // Handle comma thousands separators
        
        let amount = parseFloat(amountStr);
        // If amount is positive in a bank statement, it might be credit. 
        // We only care about expenses, or handle negative sign depending on bank format.
        // Assuming statement uses negative for debits or user maps a 'Withdrawal/Debit' column specifically.
        // We will take absolute value if it's explicitly marked as debit/expense, avoiding credits.
        // For simplicity, let's just parse the absolute value if it's defined as an expense import.
        if (isNaN(amount) || amount === 0) {
          errors++;
          continue;
        }

        // Detect category
        const upperDesc = descStr.toUpperCase();
        let detectedCategory = 'Other';
        for (const rule of this.categoryRules) {
          if (rule.keywords.some(kw => upperDesc.includes(kw))) {
            detectedCategory = rule.category;
            break;
          }
        }

        const expenseData = {
          amount: Math.abs(amount),
          date: new Date(dateStr),
          description: descStr,
          category: detectedCategory,
          paymentMethod: 'Bank Transfer', // Default for statement imports
          merchant: descStr.substring(0, 30) // Best effort merchant extraction
        };

        if (isNaN(expenseData.date.getTime())) {
          errors++;
          continue;
        }

        // Use the existing expense service to create
        await ExpenseService.createExpense(userId, expenseData);
        imported++;

      } catch (err) {
        errors++;
      }
    }

    return { imported, errors };
  }
}
