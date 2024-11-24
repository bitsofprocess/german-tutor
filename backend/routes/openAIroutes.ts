import { Router } from 'express';
import { listVerbs } from '../controllers/openAIcontrollers';

const router = Router();

router.post('/verbs', listVerbs);

export default router;
