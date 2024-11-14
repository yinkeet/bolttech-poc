import express from 'express';
import { getClaims } from './list';
import { createClaim } from './create';
import { validateCreateClaim } from './validators';

const router = express.Router();

router.get('/', getClaims);
router.post('/', validateCreateClaim, createClaim);

export default router;
