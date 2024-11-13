import express, { Request, Response } from 'express';
import cors from 'cors';
import { pool } from './common/db';
import customerRoutes from './handlers/customers';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use('/api/v1/customers', customerRoutes)

app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).json({
    uptime: process.uptime()
  });
});

app.post('/api/v1/claims', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT claim_number, claim_date, amount_claimed, amount_approved, status FROM claim');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
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
