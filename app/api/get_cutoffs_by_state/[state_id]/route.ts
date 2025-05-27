import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { state_id: string } }
) {
    try {
        const stateId = params.state_id;

        // Query for max closing_rank per category in the state
        const cutoffs = await query(`
      SELECT c.*
      FROM cutoffs c
      INNER JOIN (
        SELECT category, MAX(closing_rank) as max_rank
        FROM cutoffs
        WHERE state_id = ?
        GROUP BY category
      ) m ON c.category = m.category AND c.closing_rank = m.max_rank
      WHERE c.state_id = ?
    `, [stateId, stateId]);

        // Extract unique college IDs
        const collegeIds = [...new Set(cutoffs.map((cutoff: any) => cutoff.college_id))];

        if (collegeIds.length > 0) {
            // Build dynamic placeholders for SQLite IN clause
            const placeholders = collegeIds.map(() => '?').join(',');

            // Query all relevant colleges by IDs
            const collegeNames = await query(
                `SELECT id, name FROM colleges WHERE id IN (${placeholders})`,
                collegeIds
            );

            // Create a map from college id to name
            const collegeMap = new Map<number, string>();
            for (const college of collegeNames) {
                collegeMap.set(college.id, college.name);
            }

            // Attach college names to each cutoff
            for (const cutoff of cutoffs) {
                cutoff.college_name = collegeMap.get(cutoff.college_id) || 'Unknown';
            }
        }

        return NextResponse.json({ cutoffs });
    } catch (error) {
        console.error('Error fetching cutoffs by state:', error);
        return NextResponse.json({ cutoffs: [] }, { status: 500 });
    }
}
