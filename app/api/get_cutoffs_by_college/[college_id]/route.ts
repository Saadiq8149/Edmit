import { query } from '@/lib/db'; // Ensure this is PostgreSQL-backed
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { college_id: string } }
) {
    try {
        const collegeId = params.college_id;

        const cutoffs = await query(
            'SELECT * FROM cutoffs WHERE college_id = $1',
            [collegeId]
        );

        return NextResponse.json({ cutoffs });
    } catch (error) {
        console.error('Error fetching cutoffs by college:', error);
        return NextResponse.json({ cutoffs: [] }, { status: 500 });
    }
}
