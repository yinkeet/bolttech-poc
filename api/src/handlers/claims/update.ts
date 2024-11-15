import { Request, Response } from 'express';
import { pool } from '../../common/db';
import { ResultSetHeader } from 'mysql2';

interface EditClaimRequest {
    amount_claimed: number;
}

export const updateClaim = async (req: Request, res: Response) => {
    const { claimId } = req.params;

    const {
        amount_claimed
    } = req.body as EditClaimRequest;

    try {
        const query = `UPDATE claim SET amount_claimed = ? WHERE id = ?`
        const [rows] = await pool.query<ResultSetHeader>(query, [amount_claimed, claimId]);

        if (rows.affectedRows == 0) {
            res.status(404).json({
                message: 'Document not found'
            });
            return;
        }

        res.status(200).json({ message: 'Claim updated successfully' });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'Failed to update claim', error: error });
    }
};