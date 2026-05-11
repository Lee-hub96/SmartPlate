import { Router } from 'express';
import { scanPantry, getPantryItems, deletePantryItem } from '../controllers/pantryController';

const router = Router();

router.post('/scan', scanPantry);
router.get('/:userId', getPantryItems);
router.delete('/:userId/:itemId', deletePantryItem);

export default router;
