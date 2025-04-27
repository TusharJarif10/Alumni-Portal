// Middleware to Check Admin Access (utils/checkAdmin.js)
import { getSession } from 'next-auth/react';

export async function checkAdmin(req, res) {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
}