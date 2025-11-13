import { Router } from 'express';
import { RemoteController } from '../controllers/remoteController';

const router = Router();
const remoteController = new RemoteController();

/**
 * Remote Management Routes
 * Primary channel for device management (independent of MQTT)
 */

// Get device status (including MQTT connection state)
router.get('/status', remoteController.getStatus.bind(remoteController));

// Update device configuration
router.post('/config', remoteController.updateConfig.bind(remoteController));

// MQTT management endpoints
router.get('/mqtt/status', remoteController.getMQTTStatus.bind(remoteController));
router.post('/mqtt/config', remoteController.updateMQTTConfig.bind(remoteController));
router.post('/mqtt/reconnect', remoteController.reconnectMQTT.bind(remoteController));

// Device control
router.post('/reboot', remoteController.reboot.bind(remoteController));

export default router;
