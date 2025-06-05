// app/api/user/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/user/[id]
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('GET user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user/[id]
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  try {
    const result = await query(
      `UPDATE users SET 
        name = $1,
        email = $2,
        registration_no = $3,
        date_of_birth = $4,
        role = $5
       WHERE id = $6
       RETURNING *`,
      [
        data.name,
        data.email,
        data.registrationNo,
        new Date(data.dateOfBirth),
        data.role,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("PUT user error:", error);

    if (error.code === '23505' && error.constraint === 'User_email_key') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/user/[id]
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
