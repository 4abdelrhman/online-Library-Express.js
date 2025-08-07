import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Book from '../models/book.model.js';

export const borrowBook = asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  const bookId = req.params.id;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const index = user.borrowedBooks.indexOf(bookId);
  if (index > -1) {
    user.borrowedBooks.splice(index, 1);
    await user.save();
    return res.status(200).json({ message: 'Book returned successfully' });
  } else {
    user.borrowedBooks.push(bookId);
    await user.save();
    return res.status(200).json({ message: 'Book borrowed successfully' });
  }
});

export const addToFav = asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  const bookId = req.params.id;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const index = user.favorites.indexOf(bookId);
  if (index > -1) {
    user.favorites.splice(index, 1);
    await user.save();
    return res.status(200).json({ message: 'Book removed from favorites' });
  } else {
    user.favorites.push(bookId);
    await user.save();
    return res.status(200).json({ message: 'Book added to favorites' });
  }
});
