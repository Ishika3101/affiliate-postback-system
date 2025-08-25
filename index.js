console.log("Starting backend server...");

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'affiliate_system',
  password: 'Ishika3101*', // update this
  port: 5432,
});

// Middleware to parse URL query parameters
app.use(express.urlencoded({ extended: true }));

// Test root endpoint
app.get('/', (req, res) => {
  res.send('Affiliate Postback System Backend Running!');
});

// Click tracking endpoint
// Example: GET /click?affiliate_id=1&campaign_id=10&click_id=abc123
app.get('/click', async (req, res) => {
  console.log("Received GET request to /click");
  const { affiliate_id, campaign_id, click_id } = req.query;

  // Validate input
  if (!affiliate_id || !campaign_id || !click_id) {
    return res.status(400).json({ status: 'error', message: 'Missing required query parameters' });
  }

  try {
    // Insert click into database
    const query = `
      INSERT INTO clicks (affiliate_id, campaign_id, click_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (affiliate_id, campaign_id, click_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [affiliate_id, campaign_id, click_id]);

    if (rows.length > 0) {
      res.json({ status: 'success', message: 'Click tracked', data: rows[0] });
    } else {
      res.json({ status: 'success', message: 'Click already tracked' });
    }
  } catch (err) {
    console.error('Error storing click:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Postback endpoint
// Example: GET /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
app.get('/postback', async (req, res) => {
  const { affiliate_id, click_id, amount, currency } = req.query;

  // Validate input
  if (!affiliate_id || !click_id || !amount || !currency) {
    return res.status(400).json({ status: 'error', message: 'Missing required query parameters' });
  }

  try {
    // Verify click exists for given affiliate_id and click_id
    const clickQuery = `
      SELECT id FROM clicks 
      WHERE affiliate_id = $1 AND click_id = $2
    `;
    const clickResult = await pool.query(clickQuery, [affiliate_id, click_id]);

    if (clickResult.rowCount === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid affiliate_id or click_id' });
    }

    const clickDbId = clickResult.rows[0].id;

    // Insert conversion
    const conversionQuery = `
      INSERT INTO conversions (click_id, amount, currency) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const conversionResult = await pool.query(conversionQuery, [clickDbId, amount, currency]);

    res.json({ status: 'success', message: 'Conversion tracked', data: conversionResult.rows[0] });
  } catch (err) {
    console.error('Error storing conversion:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// API endpoint to get all clicks
app.get('/api/clicks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clicks ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching clicks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get all conversions
app.get('/api/conversions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conversions ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching conversions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
