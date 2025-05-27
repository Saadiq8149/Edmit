import { Pool } from 'pg';

// Create a standard Postgres connection pool
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_naB9YjuC5ldP@ep-rough-silence-a1qredzg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false // for development, consider true for production
    }
});

// Helper function to execute a query
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`Executed query in ${duration}ms`);
        return result.rows as T[];
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Helper functions for specific database operations
export async function getStates() {
    return query('SELECT * FROM states ORDER BY name');
}

export async function getColleges() {
    return query('SELECT * FROM colleges ORDER BY name');
}

export async function getCollegesByState(stateId: string) {
    return query('SELECT * FROM colleges WHERE state_id = $1', [stateId]);
}

export async function getCategoriesByState(stateId: string) {
    const results = await query<{ category: string }>(
        'SELECT DISTINCT category FROM cutoffs WHERE state_id = $1',
        [stateId]
    );
    return results.map(row => row.category);
}

// Helper functions for response formatting
export function rowToObject(row: any) {
    if (!row) return null;
    return { ...row };
}

export function rowsToObjects(rows: any[]) {
    if (!rows) return [];
    return rows.map(row => ({ ...row }));
}
