import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Your database connection

export const POST = async (req) => {
  try {
    const textData = await req.text();
    const params = new URLSearchParams(textData);

    const transactionId = params.get("tran_id");
    const status = params.get("status");
    const amount = params.get("amount");
    const email = params.get("value_a"); // Custom field

    console.log("IPN Received:", { transactionId, status, amount, email });

    // Save payment info to the database
    await db.payment.create({
      data: { transactionId, status, amount, email },
    });

    return NextResponse.json({ success: true, message: "IPN received & recorded." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
