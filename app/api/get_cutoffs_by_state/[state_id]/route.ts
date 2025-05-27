import { query } from '@/lib/db'; // Uses pg (PostgreSQL client)
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { state_id: string } }
) {
    try {
        const stateId = params.state_id;

        // Step 1: Get top cutoffs per category in the given state
        const cutoffs = await query(
            `
            SELECT c.*
            FROM cutoffs c
            INNER JOIN (
                SELECT category, MAX(closing_rank) AS max_rank
                FROM cutoffs
                WHERE state_id = $1
                GROUP BY category
            ) m ON c.category = m.category AND c.closing_rank = m.max_rank
            WHERE c.state_id = $1
            `,
            [stateId]
        );

        // Step 2: Extract unique college IDs
        const collegeIds = [...new Set(cutoffs.map((cutoff: any) => cutoff.college_id))];

        if (collegeIds.length > 0) {
            // PostgreSQL allows passing an array and using ANY
            const collegeNames = await query(
                `SELECT id, name FROM colleges WHERE id = ANY($1)`,
                [collegeIds]
            );

            // Map college_id ➝ college name
            const collegeMap = new Map<number, string>();
            for (const college of collegeNames) {
                collegeMap.set(college.id, college.name);
            }

            // Attach college names
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
