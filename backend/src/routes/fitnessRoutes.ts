import { Router } from 'express';
import { getFitnessProfile, updateFitnessGoal } from '../controllers/fitnessController';

const router = Router();

router.get('/:userId', getFitnessProfile);
router.put('/:userId', updateFitnessGoal);

export default router;
