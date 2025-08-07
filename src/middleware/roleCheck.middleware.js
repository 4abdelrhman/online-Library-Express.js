export const isAdmin = (req, res, next) => {
  const { userId, sessionClaims } = req.auth;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found.' });
  }

  const role = sessionClaims?.publicMetadata?.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  next();
};
