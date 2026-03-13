import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CsvParserService } from '../services/csvParser.service';

export class UploadController {
  
  static async importCsv(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      
      if (!req.file) {
        throw { statusCode: 400, message: 'No file uploaded' };
      }

      const csvContent = req.file.buffer.toString('utf-8');
      
      // Mappings come from form data body
      const mappingsStr = req.body.mappings;
      if (!mappingsStr) {
        throw { statusCode: 400, message: 'Column mappings are required' };
      }

      let mappings;
      try {
        mappings = JSON.parse(mappingsStr);
      } catch (err) {
        throw { statusCode: 400, message: 'Invalid mappings JSON format' };
      }

      const result = await CsvParserService.parseAndImport(userId, csvContent, mappings);

      res.status(200).json({ 
        message: `Successfully imported ${result.imported} transactions. ${result.errors} errors skipped.`,
        result 
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHeaders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw { statusCode: 400, message: 'No file uploaded' };
      }
      
      const csvContent = req.file.buffer.toString('utf-8');
      const firstLine = csvContent.split('\n')[0];
      
      if (!firstLine) {
        throw { statusCode: 400, message: 'Empty CSV file' };
      }
      
      // Parse headers
      let headers = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < firstLine.length; i++) {
        if (firstLine[i] === '"') {
          inQuotes = !inQuotes;
        } else if (firstLine[i] === ',' && !inQuotes) {
          headers.push(current.trim().toLowerCase());
          current = '';
        } else {
          current += firstLine[i];
        }
      }
      headers.push(current.trim().toLowerCase());
      
      res.status(200).json({ headers });
    } catch (error) {
      next(error);
    }
  }
}
