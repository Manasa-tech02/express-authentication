import rateLimit from 'express-rate-limit';

// --- GLOBAL RATE LIMITER ---
// Applies to ALL routes — prevents general abuse
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                    // Max 100 requests per 15 min per IP
    message: {
        success: false,
        message: 'Too many requests, please try again after 15 minutes.',
    },
    standardHeaders: true,       // Sends rate limit info in headers (RateLimit-*)
    legacyHeaders: false,        // Disables old X-RateLimit-* headers
});

// --- AUTH RATE LIMITER (Strict) ---
// Applies only to login & register — prevents brute force attacks
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 10,                     // Max 10 attempts per 15 min per IP
    message: {
        success: false,
        message: 'Too many login/register attempts, please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
