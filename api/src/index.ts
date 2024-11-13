import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { pool } from './common/db';
import customerRoutes from './handlers/customers';
import claimRoutes from './handlers/claims';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use('/api/v1/customers', customerRoutes)
app.use('/api/v1/claims', claimRoutes)

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
