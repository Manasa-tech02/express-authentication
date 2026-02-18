import { Router, Request, Response } from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// --- PUBLIC ROUTES ---
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// --- PROTECTED ROUTES (Requires Login) ---
// Any user with a valid Token can access this
router.get('/me', authMiddleware, (req: Request | any, res: Response) => {
    res.json({ message: 'This is your profile', user: req.user });
});

// --- ADMIN ROUTES (Requires Login + Admin Role) ---
// Only 'admin' users can access this
router.get('/admin', authMiddleware, adminMiddleware, (req: Request | any, res: Response) => {
    res.json({ message: 'Welcome to the Admin Dashboard!', user: req.user });
});

export default router;
