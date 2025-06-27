import { query } from '@/lib/db'; // Ensure this uses pg for PostgreSQL
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const colleges = await query('SELECT * FROM colleges ORDER BY name');
        return NextResponse.json({ colleges });
    } catch (error) {
        console.error('Error fetching colleges:', error);
        return NextResponse.json({ colleges: [] }, { status: 500 });
    }
}
