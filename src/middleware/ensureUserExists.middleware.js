import User from '../models/user.model.js';

export const ensureUserExists = async (req, res, next) => {
  const { userId, sessionClaims } = req.auth;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const { email, username, imageUrl, publicMetadata } = sessionClaims;

    user = new User({
      clerkId: userId,
      email,
      userName: username || email.split('@')[0],
      profileImg: imageUrl,
      role: publicMetadata?.role || 'user',
    });

    await user.save();
  }

  next();
};
