import express from 'express';
import { getClaims, getClaimDocs } from './list';
import { createClaim } from './create';
import { validateCreateClaim, validateUpdateClaim } from './validators';
import { upload, createClaimDocument } from './upload';
import { getClaimDocFile } from './details';
import { deleteClaimDoc } from './delete';
import { updateClaim } from './update';

const router = express.Router();

router.get('/', getClaims);
router.post('/', validateCreateClaim, createClaim);
router.put('/:claimId', validateUpdateClaim, updateClaim);
router.post('/:claimId/docs', upload.single('file'), createClaimDocument);
router.get('/:claimId/docs', getClaimDocs);
router.get('/:claimId/docs/:docId', getClaimDocFile);
router.delete('/:claimId/docs/:docId', deleteClaimDoc);

export default router;
