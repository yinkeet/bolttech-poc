import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'user',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'dev',
});

app.use(cors());

app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).json({
    uptime: process.uptime()
  });
});

app.get('/api/v1/claims', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT claim_number, claim_date, amount_claimed, amount_approved, status FROM claim');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
