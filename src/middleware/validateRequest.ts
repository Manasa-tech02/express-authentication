import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod/v4';

// Reusable validation middleware factory
// Usage: router.post('/register', validate(registerSchema), register);
export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // Extract clean error messages from Zod
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }

        // Replace req.body with sanitized/transformed data
        // (e.g., trimmed name, lowercased email)
        req.body = result.data;
        next();
    };
};
