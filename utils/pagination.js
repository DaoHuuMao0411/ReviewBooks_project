function toPositiveInt(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function paginate({ page, totalItems, perPage = 6 }) {
  const requestedPage = toPositiveInt(page, 1);
  const totalPages = Math.ceil(totalItems / perPage);
  const currentPage = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);
  const offset = totalPages === 0 ? 0 : (currentPage - 1) * perPage;

  return {
    requestedPage,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    offset,
    hasPagination: totalPages > 1,
    hasPrevious: totalPages > 1 && currentPage > 1,
    hasNext: totalPages > 1 && currentPage < totalPages,
    isOutOfRange: totalPages > 0 && requestedPage > totalPages
  };
}

function getPagination(req, totalItems, perPage = 6) {
  return paginate({ page: req.query.page, totalItems, perPage });
}

function buildPageUrl(req, page) {
  const query = new URLSearchParams(req.query || {});
  query.set('page', String(page));
  const qs = query.toString();
  return `${req.path}${qs ? `?${qs}` : ''}`;
}

// Querystring hiện tại (search/filter/sort...) nhưng bỏ "page" — dùng để infinite
// scroll tự ghép "&page=N" khi tải thêm, không lặp lại tham số page cũ.
function buildFilterQuery(req, extra = {}) {
  const params = { ...req.query, ...extra };
  delete params.page;
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value);
  });
  return qs.toString();
}

module.exports = {
  paginate,
  getPagination,
  buildPageUrl,
  buildFilterQuery
};
