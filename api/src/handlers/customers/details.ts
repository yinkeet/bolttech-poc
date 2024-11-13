import { Request, Response } from 'express';
import { pool } from '../../common/db';
import { RowDataPacket } from 'mysql2';

export const getCustomerDevices = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, type, brand, model FROM device WHERE customer_id = ?', [customerId]);
        
        if (rows.length == 0) {
            res.status(404).json({
                message: 'Customer not found'
            });
            return;
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Database query failed',
            error: error
        });
    }
};

export const getCustomerDevicePolicy = async (req: Request, res: Response) => {
    const { customerId, deviceId } = req.params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, policy_number, premium, start_date, end_date, status FROM policy WHERE customer_id = ? AND device_id = ?', [customerId, deviceId]);
        
        if (rows.length == 0) {
            res.status(404).json({
                message: 'Policy not found'
            });
            return;
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'Database query failed',
            error: error
        });
    }
};