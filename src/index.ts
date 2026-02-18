import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import { globalLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.get('/', (req: Request, res: Response) => {
    res.send('Authentication API Running 🔐');
});

app.use(helmet());
app.use(cors());
app.use(globalLimiter);          // Rate limit all routes
app.use(morgan('dev'));  //in production combined
app.use(express.json());
app.use(cookieParser());

// Swagger API Docs UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Error Handler (Must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
