import { Router } from 'express';
import { getHistoricalRecords } from '../controllers/history';

const router = Router();

router.get('/', getHistoricalRecords);

export default router;