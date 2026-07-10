function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

function flashMiddleware(req, res, next) {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  // justLoggedIn dùng cùng kiểu cờ một-lần-rồi-xoá như flash: bật ở POST /login,
  // đọc xong xoá ngay nên chỉ trang đầu tiên sau khi đăng nhập thấy true.
  res.locals.justLoggedIn = !!req.session.justLoggedIn;
  delete req.session.justLoggedIn;

  res.locals.setFlash = (type, message) => setFlash(req, type, message);
  next();
}

module.exports = flashMiddleware;
module.exports.setFlash = setFlash;
