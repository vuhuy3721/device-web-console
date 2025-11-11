import { Router } from 'express';
import playerController from '../controllers/playerController';

const router = Router();

router.get('/play', playerController.play);
router.get('/pause', playerController.pause);
router.get('/stop', playerController.stop);
router.get('/next', playerController.next);
router.get('/previous', playerController.previous);
router.get('/status', playerController.getStatus);

export default router;