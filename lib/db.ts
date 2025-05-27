import Database from 'better-sqlite3';

// Connect to SQLite database (or create it if it doesn't exist)
const db = new Database('app/database/cutoffs-database.db'); // replace with your actual .db path

// Helper function to execute a query
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
    const start = Date.now();
    try {
        const stmt = db.prepare(text);
        const result = stmt.all(...params);
        const duration = Date.now() - start;
        console.log(`Executed query in ${duration}ms`);
        return result as T[]; // <-- fix here
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}




// Helper functions for specific database operations
export function getStates() {
    return query('SELECT * FROM states ORDER BY name');
}

export function getColleges() {
    return query('SELECT * FROM colleges ORDER BY name');
}

export function getCollegesByState(stateId: string) {
    return query('SELECT * FROM colleges WHERE state_id = ?', [stateId]);
}

export async function getCategoriesByState(stateId: string) {
    const results = await query<{ category: string }>(
        'SELECT DISTINCT category FROM cutoffs WHERE state_id = ?',
        [stateId]
    );
    return results.map(row => row.category);
}

// Original helper functions for response formatting
export function rowToObject(row: any) {
    if (!row) return null;
    return { ...row };
}

export function rowsToObjects(rows: any[]) {
    if (!rows) return [];
    return rows.map(row => ({ ...row }));
}
