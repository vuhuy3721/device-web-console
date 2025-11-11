import { Router } from 'express';
import mediaController from '../controllers/mediaController';

const router = Router();

router.get('/media', mediaController.getMediaInfo);
router.post('/media/play', mediaController.playMedia);
router.post('/media/pause', mediaController.pauseMedia);
router.post('/media/stop', mediaController.stopMedia);

export default router;