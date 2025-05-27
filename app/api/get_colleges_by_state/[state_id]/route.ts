import { query } from '@/lib/db'; // Should use pg for PostgreSQL
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { state_id: string } }
) {
    try {
        const stateId = params.state_id;

        const colleges = await query(
            'SELECT * FROM colleges WHERE state_id = $1 ORDER BY name',
            [stateId]
        );

        return NextResponse.json({ colleges });
    } catch (error) {
        console.error('Error fetching colleges by state:', error);
        return NextResponse.json({ colleges: [] }, { status: 500 });
    }
}
