import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

interface AuthRequest extends Request {
    user?: any;
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }

    if (req.user.role !== 'admin') {
        throw new ForbiddenError('Access Denied: Admins Only');
    }

    next();
};
