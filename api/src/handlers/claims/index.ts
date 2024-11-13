import express from 'express';
import { createClaim } from './create';
import { validateCreateClaim } from './validators';

const router = express.Router();

router.post('/', validateCreateClaim, createClaim);

export default router;
