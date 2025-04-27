// app/auth/login.js

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid credentials or not an admin.');
    } else {
      router.push('/admin/panel');
    }
  };

  return (
    <div className="bg-gradient-to-t from-base-100 to-base-200 flex flex-col items-center justify-center min-h-screen">
      <div className=" shadow-sm px-7 py-10 rounded-md w-100 text-neutral-content bg-success/70 shadow-success-content/70">
        <h3 className="text-xl mb-4 text-center font-bold"> Admin-Panel Login</h3>
        {error && <p className="text-warning text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className=" mb-5 mt-5 btn shadow-lg p-2 rounded-md w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
