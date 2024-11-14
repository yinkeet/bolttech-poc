import { Request, Response } from 'express';
import { pool } from '../../common/db';
import { validationResult } from 'express-validator';
import { customAlphabet } from 'nanoid';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import multer from 'multer';
import fs from 'fs';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 14);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directory = `/claims/${req.params.claimId}`

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }
        cb(null, directory); // Save files to the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}-${nanoid()}`);
    }
});

export const upload = multer({ storage });

export const createClaimDocument = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return
    }

    const { claimId } = req.params

    // File metadata
    const { originalname, mimetype, size, filename } = req.file;
    const { description } = req.body; // Assuming additional metadata is sent in request

    try {
        // Save metadata to MySQL database
        const query = `INSERT INTO claim_document (claim_id, type, path, original_filename) VALUES (?, ?, ?)`;
        const [result] = await pool.execute<ResultSetHeader>(query, [claimId, mimetype, `/claims/${claimId}/${filename}`, originalname])

        res.status(201).json({
            message: 'File uploaded and metadata saved',
            file: {
                filename,
                originalname,
                mimetype,
                size,
                description,
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error saving claim document', error: error });
    }
};
