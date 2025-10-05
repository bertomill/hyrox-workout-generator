import { Pool } from 'pg';

// Create a PostgreSQL connection pool
// For Supabase, we prefer the non-pooling URL for better pg library compatibility
// Fallback order: DATABASE_URL → POSTGRES_URL_NON_POOLING → POSTGRES_URL
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('No database connection string found in environment variables');
}

// Configure SSL for Supabase and other cloud databases
// Remove sslmode parameter from connection string if present (we'll handle SSL in config)
const cleanConnectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: isLocalhost 
    ? false 
    : {
        rejectUnauthorized: false, // Required for Supabase
      },
});

// Export query function for database operations
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

// Export pool for direct access if needed
export default pool;
