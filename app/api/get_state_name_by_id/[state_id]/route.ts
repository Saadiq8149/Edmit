import { query } from '@/lib/db'; // Should use PostgreSQL client (e.g. pg)
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { state_id: string } }
) {
    try {
        const stateId = params.state_id;

        const results = await query(
            'SELECT name FROM states WHERE id = $1',
            [stateId]
        );

        const state = results.length > 0 ? results[0] : null;

        return NextResponse.json({ state_name: state ? state.name : null });
    } catch (error) {
        console.error('Error fetching state name:', error);
        return NextResponse.json({ state_name: null }, { status: 500 });
    }
}
