import { Router } from 'express';
import connectionController from '../controllers/connectionController';

const router = Router();

router.get('/', connectionController.getConnectionInfo);
router.post('/update', connectionController.updateConnectionSettings);

export default router;