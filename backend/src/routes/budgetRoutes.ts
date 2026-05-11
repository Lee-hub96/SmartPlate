import { Router } from 'express';
import { getBudget, updateBudget } from '../controllers/budgetController';

const router = Router();

router.get('/:userId', getBudget);
router.put('/:userId', updateBudget);

export default router;
