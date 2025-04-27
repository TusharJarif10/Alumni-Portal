import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import if your prisma client lives elsewhere

// GET /api/user/[id]
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user/[id]


export async function PUT(request, { params }) {
  const { id } = params;  // Get the user ID from the URL params
  const data = await request.json();  // Get the updated user data

  try {

  
    // Find and update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        registrationNo: data.registrationNo,
        dateOfBirth: new Date(data.dateOfBirth),  // Ensure it's a valid Date
        role: data.role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}


// DELETE /api/user/[id]
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
