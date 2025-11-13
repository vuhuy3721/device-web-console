import { Router } from 'express';
import { WifiController } from '../controllers/wifiController';

const router = Router();
const wifiController = new WifiController();

// Test WiFi connection (without saving)
router.post('/test', wifiController.testWifiConnection.bind(wifiController));

// Connect to WiFi and save settings
router.post('/connect', wifiController.connectAndSave.bind(wifiController));

// Disconnect from WiFi
router.post('/disconnect', wifiController.disconnectWifi.bind(wifiController));

export default router;
