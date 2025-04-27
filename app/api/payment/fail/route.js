import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const textData = await req.text();
    const params = new URLSearchParams(textData);

    console.log("Payment fail:", params.get("tran_id"));

    // Return an HTML page that reloads & redirects
    return new NextResponse(
      `<html>
        <head>
          <meta http-equiv="refresh" content="0;url=/payment/fail" />
        </head>
        <body>
          <p>Redirecting...</p>
          <script>window.location.href = "/payment/fail";</script>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
