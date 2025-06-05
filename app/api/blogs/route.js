import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Fetch all blogs
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Supabase error fetching blogs:", error);
      return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
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

    // Insert new blog post
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, authorEmail, createdAt: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating blog:", error);

      // Check for unique violation (adjust based on your Supabase/Postgres config)
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
