import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Use the query helper function for consistency across routes
        const states = await query('SELECT * FROM states ORDER BY name');

        return NextResponse.json({ states });
    } catch (error) {
        console.error('Error fetching states:', error);
        // Return empty array to prevent client-side mapping errors
        return NextResponse.json({ states: [] }, { status: 500 });
    }
}
