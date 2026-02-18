import { Request, Response } from 'express';
import prisma from '../lib/prisma';

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
export const getAllUsers = async (req: Request, res: Response) => {
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
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// --- GET USER BY ID ---
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// --- UPDATE USER ROLE ---
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const { role } = req.body; // Validated by Zod middleware

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the role
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: userSelect,
        });

        res.json({ message: `User role updated to '${role}'`, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

// --- DELETE USER ---
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user (cascades to refresh tokens due to onDelete: Cascade)
        await prisma.user.delete({ where: { id } });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
