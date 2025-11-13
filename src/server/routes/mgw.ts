import { Router } from 'express';
import { MGWController } from '../controllers/mgwController';

const router = Router();
const mgwController = new MGWController();

/**
 * MGW Routes
 * Handle incoming status updates from MGW software
 */

// Receive status update from MGW (POST endpoint)
router.post('/status', mgwController.receiveStatus.bind(mgwController));

// Get current status for Web Console (GET endpoint)
router.get('/status', mgwController.getStatus.bind(mgwController));

// Get raw status data
router.get('/raw', mgwController.getRawStatus.bind(mgwController));

// Get status history
router.get('/history', mgwController.getHistory.bind(mgwController));

// Get health metrics
router.get('/health', mgwController.getHealth.bind(mgwController));

// Clear all data
router.delete('/data', mgwController.clearData.bind(mgwController));

export default router;
