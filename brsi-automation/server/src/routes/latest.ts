import { Router } from 'express';
import { getLatestRecords } from '../controllers/latest';

const router = Router();

router.get('/:aggregateLevel', getLatestRecords);

export default router;