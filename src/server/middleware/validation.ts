import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    // Example validation logic
    const { body } = req;

    // Check for required fields
    if (!body.field1 || !body.field2) {
        return res.status(400).json({ error: 'Missing required fields: field1, field2' });
    }

    // Additional validation can be added here

    next();
};