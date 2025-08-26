import Book from '../models/book.model.js';
import cloudinary from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

const EXTERNAL_BOOKS_API = 'https://openlibrary.org/trending/weekly.json';

export const allBooks = asyncHandler(async (req, res) => {
  const dbBooks = await Book.find();

  const { data } = await axios.get(EXTERNAL_BOOKS_API);

  const apiBooks = await Promise.all(
    (data.works || []).map(async (book) => {
      let description = null;
      try {
        const workRes = await axios.get(
          `https://openlibrary.org${book.key}.json`
        );
        if (typeof workRes.data.description === 'string') {
          description = workRes.data.description;
        } else if (workRes.data.description?.value) {
          description = workRes.data.description.value;
        }
      } catch (error) {}

      return {
        title: book.title,
        author: book.author_name ? book.author_name.join(', ') : 'Unknown',
        cover: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : null,
        description,
        source: 'API books',
      };
    })
  );

  const allBooks = [...dbBooks.map((b) => ({ ...b._doc })), ...apiBooks];

  res.status(200).json({
    count: allBooks.length,
    books: allBooks,
  });
});

export const searchBooks = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim() === '') {
    return res
      .status(400)
      .json({ success: false, message: 'No search term provided' });
  }
  const adminBooksRaw = await Book.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { author: { $regex: query, $options: 'i' } },
    ],
  });
  const adminBooks = adminBooksRaw.map((book) => ({
    title: book.title,
    author: book.author,
    coverURI: book.cover || null,
    source: 'Database',
  }));

  let externalBooks = [];
  try {
    const externalRes = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );

    externalBooks = await Promise.all(
      (externalRes.data.docs || []).map(async (book) => {
        let description = null;
        try {
          const workRes = await axios.get(
            `https://openlibrary.org${book.key}.json`
          );
          if (typeof workRes.data.description === 'string') {
            description = workRes.data.description;
          } else if (workRes.data.description?.value) {
            description = workRes.data.description.value;
          }
        } catch (error) {}

        return {
          title: book.title,
          author: book.author_name ? book.author_name.join(', ') : 'Unknown',
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : null,
          description,
          source: 'API books',
        };
      })
    );
  } catch (error) {
    console.error('Error fetching external books:', error.message);
  }

  const results = [...adminBooks, ...externalBooks];
  res.json({ success: true, books: results });
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
      console.log('Error deleting book:', error);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
  });
});
