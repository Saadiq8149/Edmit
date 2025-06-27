import { query } from '@/lib/db'; // This should be set up to use PostgreSQL (e.g., pg)
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { college_id: string } }
) {
    try {
        const collegeId = params.college_id;

        const results = await query<{ formatted_name: string }>(
            'SELECT * FROM colleges WHERE id = $1',
            [collegeId]
        );

        const college = results.length > 0 ? results[0] : null;

        return NextResponse.json(college);
    } catch (error) {
        console.error('Error fetching college name:', error);
        return NextResponse.json({ college: null }, { status: 500 });
    }
}
