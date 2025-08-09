import User from '../models/user.model.js';
import { clerkClient } from '@clerk/express';
import asyncHandler from 'express-async-handler';

export const ensureUserExists = asyncHandler(async (req, res, next) => {
  const { userId, sessionClaims } = req.auth;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const username = clerkUser.username || email.split('@')[0];
    const imageUrl = clerkUser.imageUrl;
    const role = clerkUser.publicMetadata?.role || 'user';

    user = new User({
      clerkId: userId,
      email,
      username,
      profileImg: imageUrl,
      role,
    });

    await user.save();
  }

  next();
});
