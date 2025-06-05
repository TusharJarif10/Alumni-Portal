import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { email, name } = await req.json();
    const transactionId = "TXN_" + Date.now();

    const data = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWD,
      total_amount: 500,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
      cus_name: name,
      cus_email: email,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",  
      cus_country: "bangla",
      cus_phone: "01711111198",
      shipping_method: "NO",
      product_name: "Alumni Portal Access",
      product_category: "Digital",
      product_profile: "general",
      value_a: email,
    };

    // Convert data to URL-encoded form
    const formData = new URLSearchParams();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();

    if (result?.GatewayPageURL) {
      return NextResponse.json({ url: result.GatewayPageURL });
    } else {
      return NextResponse.json({ error: "Failed to get payment URL", details: result }, { status: 500 });
    }
  } catch (error) {
    console.error("SSLCOMMERZ INIT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
