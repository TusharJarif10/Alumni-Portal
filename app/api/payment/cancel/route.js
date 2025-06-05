import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Import your PostgreSQL query function

export const POST = async (req) => {
  try {
    const textData = await req.text();
    const params = new URLSearchParams(textData);
    const transactionId = params.get("tran_id");

    console.log("Payment cancel:", transactionId);

    // Log the canceled transaction in PostgreSQL
    if (transactionId) {
      await query(
        `UPDATE payments 
         SET status = 'CANCELLED', 
             updated_at = NOW() 
         WHERE transaction_id = $1`,
        [transactionId]
      );
    }

    // Return an HTML page that redirects
    return new NextResponse(
      `<html>
        <head>
          <meta http-equiv="refresh" content="0;url=/payment/cancel" />
        </head>
        <body>
          <p>Redirecting...</p>
          <script>
            window.location.href = "/payment/cancel?transaction_id=${transactionId || ''}";
          </script>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Payment cancellation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};