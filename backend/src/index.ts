import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { initDb } from './utils/initDb';
import pantryRoutes from './routes/pantryRoutes';
import mealRoutes from './routes/mealRoutes';
import groceryRoutes from './routes/groceryRoutes';
import fitnessRoutes from './routes/fitnessRoutes';
import budgetRoutes from './routes/budgetRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDb().catch(err => console.error('Failed to init DB:', err));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/api/pantry', pantryRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'SmartPlate Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
