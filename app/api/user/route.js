// app/api/user/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // PostgreSQL query helper

export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM users `
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
