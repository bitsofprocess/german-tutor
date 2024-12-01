import { Router } from 'express';
import { listVerbs, extract, conceptPractice } from '../controllers/openAIcontrollers';

const router = Router();

router.post('/verbs', listVerbs);
router.post('/extract', extract);
router.post('/concept', conceptPractice)

export default router;
