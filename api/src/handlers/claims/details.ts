import { Request, Response } from 'express';
import { pool } from '../../common/db';
import { RowDataPacket } from 'mysql2';

export const getClaimDocFile = async (req: Request, res: Response) => {
    const { claimId, docId } = req.params
    try {
        const query = `
        SELECT 
            path
        FROM claim_document
        WHERE claim_id = ? and id = ?
        `
        const [rows] = await pool.query<RowDataPacket[]>(query, [claimId, docId]);

        if (rows.length == 0) {
            res.status(404).json({
                message: 'Document not found'
            });
            return;
        }

        res.sendFile(rows[0].path);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'Database query failed', error: error });
    }
};