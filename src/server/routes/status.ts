import { Router } from 'express';
import statusController from '../controllers/statusController';

const router = Router();

router.get('/', statusController.getStatus);
router.get('/health', statusController.getHealthStatus.bind(statusController));

export default router;