import express from 'express';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 8080;

// Set up PostgreSQL client
// const pool = new Pool({
//   host: 'postgres',
//   user: 'postgres',
//   password: 'postgres',
//   database: 'my_database',
//   port: 5432
// });

// Example route to get data from a table
app.get('/api/v1/claims', async (req, res) => {
  try {
    res.json({
        'test': '123'
    })
    // const result = await pool.query('SELECT * FROM my_table');
    // res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
