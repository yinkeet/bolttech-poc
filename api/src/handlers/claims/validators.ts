import { body } from 'express-validator';

export const validateCreateClaim = [
    body('policy_id').isInt({ gt: 0 }).withMessage('policy_id must be an integer'),
    body('coverage_id').isInt({ gt: 0 }).withMessage('coverage_id must be an integer'),
    body('amount_claimed').isFloat({ min: 0 }).withMessage('amount_claimed must be a positive number')
];
