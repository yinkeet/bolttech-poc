import { Request, Response } from 'express';
import { pool } from '../../common/db';
import { validationResult } from 'express-validator';
import { customAlphabet } from 'nanoid';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 14);

// Define the type for the claim creation request
interface CreateClaimRequest {
    policy_id: number;
    coverage_id: number;
    amount_claimed: number;
}

export const createClaim = async (req: Request, res: Response) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const {
        policy_id,
        coverage_id,
        amount_claimed
    } = req.body as CreateClaimRequest;

    // Check if policy_id and coverage_id exists and amount_claimed is not over the limit
    try {
        const query = `
        SELECT coverage_limit_override AS coverage_limit, start_date, end_date 
        FROM policy_coverage 
        WHERE policy_id = ? AND coverage_id = ?
        `
        const [rows] = await pool.query<RowDataPacket[]>(query, [policy_id, coverage_id]);

        if (rows.length == 0) {
            res.status(404).json({
                message: 'Policy Coverage not found'
            });
            return;
        }

        const { coverage_limit, end_date } = rows[0]
        // Over limit
        if (amount_claimed > coverage_limit) {
            res.status(404).json({
                message: 'Amount claimed more than coverage limit'
            });
            return;
        }

        // Expired
        if (Date.now() > Date.parse(end_date)) {
            res.status(404).json({
                message: 'Coverage expired'
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            message: 'Database query failed',
            error: error
        });
        return;
    }

    const claim_number = nanoid();


    try {
        const query = `
            INSERT INTO claim (
                policy_id, coverage_id, claim_number, amount_claimed
            ) VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.execute<ResultSetHeader>(query, [
            policy_id,
            coverage_id,
            claim_number,
            amount_claimed
        ]);

        res.status(201).json({
            message: 'Claim created successfully',
            claimId: result.insertId
        });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
                message: 'Claim already exists',
                error: error
            });
            return;
        }

        res.status(500).json({
            message: 'Failed to create claim',
            error: error
        });
    }
};
