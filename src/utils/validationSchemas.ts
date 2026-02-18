import { z } from 'zod/v4';

// --- REGISTER SCHEMA ---
export const registerSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .transform((val) => val.toLowerCase().trim()), // Sanitize: lowercase + trim

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least 1 number'),

    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .transform((val) => val.trim()), // Sanitize: trim whitespace
});

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .transform((val) => val.toLowerCase().trim()),

    password: z
        .string()
        .min(1, 'Password is required'),
});

// Export Types (Zod infers them automatically!)
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
