import express from 'express';
import { getClaims, getClaimDocs } from './list';
import { createClaim } from './create';
import { validateCreateClaim } from './validators';
import { upload, createClaimDocument } from './upload';
import { getClaimDocFile } from './details'

const router = express.Router();

router.get('/', getClaims);
router.post('/', validateCreateClaim, createClaim);
router.post('/:claimId/docs', upload.single('file'), createClaimDocument);
router.get('/:claimId/docs', getClaimDocs);
router.get('/:claimId/docs/:docId', getClaimDocFile);

export default router;
