import { Router } from 'express';
import { generateGroceryList, getGroceryList, toggleBought } from '../controllers/groceryController';

const router = Router();

router.post('/generate', generateGroceryList);
router.get('/:userId', getGroceryList);
router.patch('/:userId/:itemId', toggleBought);

export default router;
