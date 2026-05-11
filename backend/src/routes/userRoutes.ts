import { Router } from 'express';
import { getUserProfile, updateUserProfile, getDashboardSummary } from '../controllers/userController';

const router = Router();

router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);
router.get('/dashboard/:userId', getDashboardSummary);

export default router;
