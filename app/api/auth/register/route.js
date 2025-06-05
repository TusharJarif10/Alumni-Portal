import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db"; // Import your PostgreSQL query function

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: "User already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await query(
      `INSERT INTO users (email, password, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id, email`,
      [email, hashedPassword]
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "User registered successfully",
        user: result.rows[0] 
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Registration failed" 
      }, 
      { status: 500 }
    );
  }
};