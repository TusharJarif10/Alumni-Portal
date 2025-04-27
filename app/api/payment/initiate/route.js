import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { name, registrationNo, dateOfBirth, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const transactionId = "T" + new Date().getTime(); // Unique transaction ID

    console.log("📢 Creating user in database with Transaction ID:", transactionId);

    await db.user.create({
      data: {
        name,
        registrationNo,
        dateOfBirth: new Date(dateOfBirth), // ← Convert string to Date
        email,
        password: hashedPassword,
        transactionId,
        status: "PENDING",
      },
    });

    // SSLCOMMERZ Credentials
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWD;

    if (!store_id || !store_passwd) {
      throw new Error("⚠️ SSLCOMMERZ credentials missing");
    }

    const post_data = {
      store_id,
      store_passwd,
      total_amount: "500",
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
      cus_name: name,
      cus_email: email,
      product_name: "Alumni Registration",
      product_category: "Registration",
      product_profile: "general",
      cus_country: "Bangladesh",
    };

    console.log("📢 Sending request to SSLCOMMERZ with data:", post_data);

    // Send request to SSLCOMMERZ
    const sslRes = await fetch("https://sandbox.sslcommerz.com/gwprocess/v3/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(post_data).toString(),
    });

    console.log("📢 SSLCOMMERZ Response Status:", sslRes.status);

    const sslResJSON = await sslRes.json();
    console.log("📢 SSLCOMMERZ Response JSON:", sslResJSON);

    if (sslResJSON?.GatewayPageURL) {
      return NextResponse.json({ success: true, url: sslResJSON.GatewayPageURL });
    } else {
      throw new Error(sslResJSON?.error || "Failed to get payment URL");
    }
  } catch (error) {
    console.error("❌ Error in Payment API:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
