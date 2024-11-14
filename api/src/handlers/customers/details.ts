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
        const query = `
        SELECT 
            policy_id,
            coverage_id,
            policy_number, 
            premium, 
            policy.start_date, 
            policy.end_date, 
            policy.status,
            coverage.name,
            policy_coverage.coverage_limit_override
        FROM policy 
        JOIN policy_coverage ON policy_id = policy.id
        JOIN coverage ON coverage_id = coverage.id
        WHERE customer_id = ? AND device_id = ?
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query, [customerId, deviceId]);
        
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

// export const getCustomerDevicePolicyCoverages = async (req: Request, res: Response) => {
//     const { customerId, deviceId, policyId } = req.params;

//     try {
//         const query = `
//         SELECT policy_id, coverage_id, policy_number, premium, start_date, end_date, status 
//         FROM policy_coverage 
//         JOIN coverage ON coverage_id = id 
//         WHERE customer_id = ? AND device_id = ? AND policy_id = ?
//         `;
//         const [rows] = await pool.query<RowDataPacket[]>(query, [customerId, deviceId, policyId]);
        
//         if (rows.length == 0) {
//             res.status(404).json({
//                 message: 'Policy not found'
//             });
//             return;
//         }

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Database query failed',
//             error: error
//         });
//     }
// };