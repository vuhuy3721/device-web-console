import { Router } from 'express';
import aboutController from '../controllers/aboutController';

const router = Router();

router.get('/', aboutController.getAboutInfo);

export default router;