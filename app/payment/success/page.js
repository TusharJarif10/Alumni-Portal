import Link from 'next/link'; // Import Link from next/link

export default function SuccessPage() {
  return (
    <div className="text-center justify-center items-center p-10 mt-20">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p>Thank you for your payment.</p>
      <Link href="/">  {/* Use Link component to navigate to the homepage */}
        <button className="btn btn-secondary mt-10">Return to Homepage</button>
      </Link>
    </div>
  );
}
