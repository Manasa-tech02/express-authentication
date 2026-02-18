import { Router } from 'express';
import { getAllUsers, getUserById, updateUserRole, deleteUser } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateRequest';
import { updateRoleSchema } from '../utils/validationSchemas';

const router = Router();

// All admin routes require: Login (authMiddleware) + Admin Role (adminMiddleware)
router.use(authMiddleware, adminMiddleware);

// --- ADMIN USER MANAGEMENT ---
router.get('/users', getAllUsers);                                    // List all users
router.get('/users/:id', getUserById);                               // Get one user
router.patch('/users/:id/role', validate(updateRoleSchema), updateUserRole);  // Update role
router.delete('/users/:id', deleteUser);                             // Delete user

export default router;
