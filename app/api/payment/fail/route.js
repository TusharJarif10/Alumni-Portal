import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // Import your PostgreSQL query function

export const POST = async (req) => {
  try {
    const textData = await req.text();
    const params = new URLSearchParams(textData);
    const transactionId = params.get("tran_id");
    const failedReason = params.get("failedreason") || "Unknown reason";

    console.log(`Payment failed - Transaction ID: ${transactionId}, Reason: ${failedReason}`);

    // Update payment status in PostgreSQL
    if (transactionId) {
      await query(
        `UPDATE payments 
         SET status = 'FAILED', 
             failure_reason = $1,
             updated_at = NOW() 
         WHERE transaction_id = $2`,
        [failedReason, transactionId]
      );
    }

    // Return redirect page with transaction ID for reference
    return new NextResponse(
      `<html>
        <head>
          <title>Payment Failed</title>
          <meta http-equiv="refresh" content="0;url=/payment/fail?transaction_id=${transactionId || ''}&reason=${encodeURIComponent(failedReason)}" />
        </head>
        <body>
          <p>Redirecting to payment failure page...</p>
          <script>
            window.location.href = "/payment/fail?transaction_id=${transactionId || ''}&reason=${encodeURIComponent(failedReason)}";
          </script>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Payment failure handler error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: "Failed to process payment failure" 
      }, 
      { status: 500 }
    );
  }
};