import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Fetch all blogs
export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM blogs 
      ORDER BY "createdAt" DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// Create a new blog post
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, content, authorEmail } = body;

    if (!title || !content || !authorEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO blogs (title, content, "authorEmail", "createdAt")    
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [title, content, authorEmail]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: "Blog with this title already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}