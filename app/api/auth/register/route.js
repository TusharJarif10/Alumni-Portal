import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Import your database connection

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already registered" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
