import { Router } from 'express';
import { getBRSIRecords } from '../controllers/brsi';

const router = Router();

router.get('/:aggregateLevel', getBRSIRecords);

export default router;