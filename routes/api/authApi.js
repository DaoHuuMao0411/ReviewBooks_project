const express = require('express');
const { validateUser } = require('../../utils/validation');
const { requireLoginApi } = require('../../middleware/apiAuth');
const authService = require('../../services/authService');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { confirmPassword } = req.body;
    const { errors, values } = validateUser(req.body, 'create');
    if (values.password !== confirmPassword) errors.push('Mật khẩu xác nhận không khớp.');
    if (errors.length) return res.status(400).json({ errors });

    await authService.register(values);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Tên đăng nhập hoặc email đã tồn tại.' });
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const username = (req.body.username || '').trim();
    const password = req.body.password || '';
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const user = await authService.login(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    req.session.user = user;
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get('/me', requireLoginApi, (req, res) => {
  res.json({ user: req.session.user });
});

module.exports = router;
