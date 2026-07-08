const express = require('express');
const bookService = require('../../services/bookService');
const commentService = require('../../services/commentService');
const { validateComment } = require('../../utils/validation');
const { requireLoginApi } = require('../../middleware/apiAuth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', category = '', sort = 'newest', page } = req.query;
    const { books, pagination } = await bookService.searchBooks({ search, category, sort, page, perPage: 6 });
    res.json({ books, pagination });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Không tìm thấy sách.' });
    const rating = await commentService.getRatingStats(req.params.id);
    res.json({ book, rating });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Không tìm thấy sách.' });
    const comments = await commentService.listForBook(req.params.id);
    res.json({ comments });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/comments', requireLoginApi, async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Không tìm thấy sách.' });

    const { errors, values } = validateComment(req.body);
    if (errors.length) return res.status(400).json({ errors });

    await commentService.createComment({
      bookId: req.params.id,
      userId: req.session.user.id,
      name: req.session.user.username,
      email: req.session.user.email,
      content: values.content,
      rating: values.rating
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
