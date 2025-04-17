import { Router } from 'express';
import { getLatestRecords } from '../controllers/latest';

const router = Router();

router.get('/', getLatestRecords);

export default router;