import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../utils/errors';

// Fields to return (EXCLUDE password)
const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

// --- GET ALL USERS (with Pagination) ---
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Run both queries in parallel for performance
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                select: userSelect,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }, // Newest first
            }),
            prisma.user.count(), // Total number of users
        ]);

        res.json({
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);
    }
};

// --- GET USER BY ID ---
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            throw new BadRequestError('Invalid user ID');
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

// --- UPDATE USER ROLE ---
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const { role } = req.body; // Validated by Zod middleware

        if (isNaN(id)) {
            throw new BadRequestError('Invalid user ID');
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        // Update the role
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: userSelect,
        });

        res.json({ message: `User role updated to '${role}'`, user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// --- DELETE USER ---
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            throw new BadRequestError('Invalid user ID');
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        // Delete user (cascades to refresh tokens due to onDelete: Cascade)
        await prisma.user.delete({ where: { id } });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
