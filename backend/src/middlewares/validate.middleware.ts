import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error && error.issues) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: error.issues.map((e: any) => ({ path: e.path?.join('.'), message: e.message }))
        });
      }
      next(error);
    }
  };
};
