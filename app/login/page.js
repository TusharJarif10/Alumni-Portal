"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard"); // Redirect after login
    }
  };

  return (
    <div className="bg-base-100 flex flex-col items-center justify-center min-h-screen">
      <div className=" shadow-md px-7 py-10 rounded-md w-100 border-base-200 text-white/70 bg-gradient-to-r from-base-200 to-secondary">
        <h3 className="text-xl mb-4 text-center font-bold"> Alumni accociation</h3>
        <h3 className="text-2xl mb-4 text-center font-bold">Memebers Portal Login</h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md p-2 w-full mb-4 mt-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2 w-full mb-4"
            required
          />
          <button type="submit" className=" mb-5 mt-5 bg-neutral/60 text-warning-content shadow-lg p-2 rounded-md w-full">
            Login
          </button>
        </form>
        <p>can't access our members portal? 
        
          <span onClick={() => router.push("/register")} className="text-warning cursor-pointer"> register now!</span>
        </p>
      </div>
    </div>
  );
}
