import Book from '../models/book.model.js';
import cloudinary from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';

export const allBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  if (!books) {
    return res.status(404).json({ message: 'No books found' });
  }

  res.status(200).json({
    count: books.length,
    books,
  });
});

export const authorBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ author: req.params.authorName });

  if (!books || books.length === 0) {
    return res.status(404).json({ message: 'No books found for this author' });
  }

  res.status(200).json({
    count: books.length,
    books,
  });
});

export const addBook = asyncHandler(async (req, res) => {
  const { title, author, description, coverURI } = req.body;
  if (!title || !author || !description || !coverURI) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const isBookExist = await Book.findOne({
    title: { $regex: new RegExp(`^${title}$`, 'i') },
  });

  if (isBookExist)
    return res.status(400).json({ message: 'Book already exists' });

  const uploadRes = await cloudinary.uploader.upload(coverURI);
  const imageURI = uploadRes.secure_url;
  const newBook = new Book({
    title,
    author,
    description,
    coverURI: imageURI,
  });

  await newBook.save();
  res.status(201).json({
    message: 'Book added successfully',
    book: newBook,
  });
});

export const editBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newTitle, newAuthor, newDescription, newCoverURI } = req.body;
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  if (newTitle) book.title = newTitle;
  if (newAuthor) book.author = newAuthor;
  if (newDescription) book.description = newDescription;
  if (newCoverURI && newCoverURI !== book.coverURI) {
    const uploadRes = await cloudinary.uploader.upload(newCoverURI, {
      folder: 'book-covers',
    });
    book.coverURI = uploadRes.secure_url;
  }

  await book.save();

  res.status(200).json({
    message: 'Book updated successfully',
    book,
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bookToDelete = await Book.findByIdAndDelete(id);
  if (!bookToDelete) return res.status(404).json({ message: 'Book not found' });
  if (bookToDelete.coverURI && bookToDelete.coverURI.includes('cloudinary')) {
    try {
      const publicId = bookToDelete.coverURI.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch (error) {
      console.log('Error deleting book:', deleteError);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
  });
});
