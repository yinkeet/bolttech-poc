import { Request, Response } from 'express';
import { pool } from '../../common/db';
import { RowDataPacket } from 'mysql2';
import fs from 'fs';

export const deleteClaimDoc = async (req: Request, res: Response) => {
    const { claimId, docId } = req.params;

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

        const filepath = rows[0].path
        if (!fs.existsSync(filepath)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        fs.unlinkSync(filepath);

        await pool.execute(`DELETE FROM claim_document WHERE claim_id = ? and id = ?`, [claimId, docId]);

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'Failed to delete claim document', error: error });
    }
};