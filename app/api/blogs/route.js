import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this exists in lib/prisma.js

// Fetch all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// Create a new blog post
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, content, authorEmail } = body;

    if (!title || !content || !authorEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: { title, content, authorEmail },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
