import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Extend Express Request type to include `user`
interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get Token from Header (Format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Get the part after "Bearer"

    try {
        // 2. Verify Token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Attach User Info to Request
        req.user = decoded;

        next(); // Proceed
    } catch (error) {
        throw new ForbiddenError('Invalid token');
    }
};
