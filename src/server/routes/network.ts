import { Router } from 'express';
import networkController from '../controllers/networkController';

const router = Router();

router.get('/info', networkController.getNetworkInfo);
router.post('/config', networkController.updateNetworkSettings);

export default router;