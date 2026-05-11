import { Router } from 'express';
import { generateMealPlan, getMealPlan } from '../controllers/mealController';

const router = Router();

router.post('/generate', generateMealPlan);
router.get('/plans/:userId', getMealPlan);

export default router;
