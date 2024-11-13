import { Request, Response } from 'express';
import { pool } from '../../common/db';

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT id, first_name, last_name FROM customer');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Database query failed',
            error: error
        });
    }
};