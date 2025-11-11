import { Router } from 'express';
import settingsController from '../controllers/settingsController';

const router = Router();

router.get('/', settingsController.getSettings.bind(settingsController));
router.put('/', settingsController.updateSettings.bind(settingsController));

export default router;