import { Router } from 'express';
import { getBRSIRecords } from '../controllers/brsi';

const router = Router();

router.get('/', getBRSIRecords);

export default router;