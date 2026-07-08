const express = require('express');
const categoryService = require('../../services/categoryService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await categoryService.listNames();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
