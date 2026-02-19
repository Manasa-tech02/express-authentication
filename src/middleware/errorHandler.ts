import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // If it's our custom AppError, use its status code and message
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Unknown/unexpected errors (bugs)
    console.error('Unexpected Error:', err.stack);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        // Only show stack trace in development
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
