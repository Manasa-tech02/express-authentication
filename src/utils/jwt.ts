import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret';

// Generate Access Token (15 Minutes)
export const generateToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' });
};

// Generate Refresh Token (7 Days)
export const generateRefreshToken = (userId: number) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

// Verify Access Token
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};
