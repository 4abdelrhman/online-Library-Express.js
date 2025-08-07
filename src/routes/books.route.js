import express from 'express';
import {
  allBooks,
  addBook,
  editBook,
  deleteBook,
  authorBooks,
} from '../controllers/books.controller.js';
import { borrowBook, addToFav } from '../controllers/user.controller.js';
import { requireAuth } from '@clerk/express';
import { isAdmin } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

//Admin and user can see the books
router.get('/', requireAuth(), allBooks);
router.get('/author/:authorName', requireAuth(), authorBooks);

//Only users can borrow books
router.post('/borrow/:id', requireAuth(), borrowBook);
//Only users can add to favourites
router.post('/favorite/:id', requireAuth(), addToFav);

//Only admins can add books
router.post('/', requireAuth(), isAdmin, addBook);
//Only admins can edit the books
router.put('/:id', requireAuth(), isAdmin, editBook);
//Only admins can delete books
router.delete('/:id', requireAuth(), isAdmin, deleteBook);

export default router;
