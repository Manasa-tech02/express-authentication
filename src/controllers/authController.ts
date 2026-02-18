import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

// --- REGISTER ---
export const register = async (req: Request, res: Response) => {
    try {
        // Data is already validated & sanitized by Zod middleware
        const { email, password, name } = req.body;

        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash Password (The "Safe")
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User in DB
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'user' // Default role
            },
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Tokens
        const accessToken = generateToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Store Refresh Token in DB
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        // Set Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'Login successful', accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// --- REFRESH TOKEN ---
export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: 'No Refresh Token' });

    try {
        const payload = verifyRefreshToken(refreshToken) as any;
        if (!payload) return res.status(403).json({ message: 'Invalid Token' });

        const savedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!savedToken) return res.status(403).json({ message: 'Token Revoked' });

        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) return res.status(403).json({ message: 'User not found' });

        const newAccessToken = generateToken(user.id, user.role);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

// --- LOGOUT ---
export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        try {
            await prisma.refreshToken.delete({ where: { token: refreshToken } });
        } catch (error) {
            // Ignore if token not found
        }
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};
