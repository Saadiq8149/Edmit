import { query } from '@/lib/db'; // Assumes this now uses pg client
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { state_id: string } }
) {
    try {
        const stateId = params.state_id;

        const results = await query<{ category: string }>(
            'SELECT DISTINCT category FROM cutoffs WHERE state_id = $1',
            [stateId]
        );

        const categories = results.map(row => row.category);

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ categories: [] }, { status: 500 });
    }
}
