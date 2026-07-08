const express = require('express');
const commentService = require('../../services/commentService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { reviews, pagination } = await commentService.listReviewsFeed({ page: req.query.page, perPage: 8 });
    res.json({ reviews, pagination });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
