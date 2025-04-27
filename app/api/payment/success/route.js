
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req) => {
  try {
    // Parse form-urlencoded data instead of JSON
    const formData = await req.text(); // Read raw text body
    const params = new URLSearchParams(formData); // Convert to URL params

    const transactionId = params.get("tran_id"); // Get transaction ID
    const status = params.get("status"); // Get payment status

    if (!transactionId) {
      return NextResponse.json({ success: false, error: "Transaction ID not found" }, { status: 400 });
    }

    if (status === "VALID") {
      // Update user status to ACTIVE after successful payment
      await db.user.updateMany({
        where: { transactionId },
        data: { status: "ACTIVE" },
      });

       return new NextResponse(
        `<html>
          <head>
            <meta http-equiv="refresh" content="0;url=/payment/success" />
          </head>
          <body>
            <p>Redirecting...</p>
            <script>window.location.href = "/payment/success";</script>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    } else {
      return NextResponse.json({ success: false, error: "Payment was not successful" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};



      // Return an HTML page that reloads & redirects
     

   
