import { Router } from 'express';
import networkController from '../controllers/networkController';

const router = Router();
router.get('/', networkController.getNetworkInfo.bind(networkController));
router.get('/info', networkController.getNetworkInfo.bind(networkController));
router.post('/config', networkController.updateNetworkSettings.bind(networkController));
router.post('/at-command', networkController.sendATCommand.bind(networkController));

export default router;