import { Router } from 'express';
import mediaController from '../controllers/mediaController';

const router = Router();

router.get('/', mediaController.getListMedia.bind(mediaController));
router.post('/play', mediaController.playMedia.bind(mediaController));
router.post('/pause', mediaController.pauseMedia.bind(mediaController));
router.post('/stop', mediaController.stopMedia.bind(mediaController));
router.delete('/delete', mediaController.deleteMedia.bind(mediaController));

export default router;