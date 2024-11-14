import { Request, Response } from 'express';
import { pool } from '../../common/db';

export const getClaims = async (req: Request, res: Response) => {
    try {
        const query = `
        SELECT claim_number, policy_number, coverage.name AS coverage_name, claim_date, amount_claimed, amount_approved, claim.status AS status
        FROM claim
        JOIN policy ON policy_id = policy.id
        JOIN coverage ON coverage_id = coverage.id
        `
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database query failed', error: error });
    }
};