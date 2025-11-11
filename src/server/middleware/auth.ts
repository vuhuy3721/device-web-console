import { Request, Response, NextFunction } from 'express';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];
    // Here you would typically verify the token (e.g., using JWT)
    // For demonstration, let's assume a simple check
    if (token === process.env.AUTH_TOKEN) {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
};

export { authenticate };
export default authenticate;