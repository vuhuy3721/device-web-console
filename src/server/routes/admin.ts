import { Router } from 'express';
import adminController from '../controllers/adminController';

const router = Router();

// Route to get admin settings
router.get('/settings', adminController.getSettings);

// Route to update admin password
router.post('/password', adminController.updatePassword);

// Route to get admin status
router.get('/status', adminController.getStatus);

export default router;