import { Router } from 'express';
import { translationPractice } from '../controllers/openAIcontrollers';

const router = Router();

router.post('/translationPractice', translationPractice)

export default router;
