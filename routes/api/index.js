const express = require('express');

const router = express.Router();

router.use('/books', require('./booksApi'));
router.use('/categories', require('./categoriesApi'));
router.use('/reviews', require('./commentsApi'));
router.use('/contact', require('./contactApi'));
router.use('/auth', require('./authApi'));

router.use((req, res) => {
  res.status(404).json({ error: 'API endpoint không tồn tại.' });
});

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Có lỗi xảy ra ở máy chủ.' });
});

module.exports = router;
