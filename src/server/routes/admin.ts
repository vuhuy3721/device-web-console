import { Router } from 'express';
import adminController from '../controllers/adminController';

const router = Router();

// Route to get admin settings
router.get('/settings', adminController.getSettings.bind(adminController));

// Login route
router.post('/login', adminController.login.bind(adminController));

// Route to update admin password
router.post('/password', adminController.updatePassword.bind(adminController));
router.get('/password', adminController.getPassword.bind(adminController));

// Route to change password (with current password verification)
router.post('/change-password', adminController.changePassword.bind(adminController));

// Route to get admin status
router.get('/status', adminController.getStatus.bind(adminController));

// Route to reboot device
router.post('/reboot', adminController.rebootDevice.bind(adminController));

// Route for factory reset
router.post('/factory-reset', adminController.factoryReset.bind(adminController));

export default router;