import { Router } from 'express';
import { listVerbs, extract } from '../controllers/openAIcontrollers';

const router = Router();

router.post('/verbs', listVerbs);
router.post('/extract', extract)

export default router;
