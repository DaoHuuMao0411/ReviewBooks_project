document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-infinite-scroll]').forEach((tbody) => {
    const baseUrl = tbody.dataset.url;
    const colspan = tbody.dataset.colspan || '10';
    const paramsStr = tbody.dataset.params || '';
    const totalItems = Number(tbody.dataset.total || '0');
    let nextPage = Number(tbody.dataset.nextPage || '2');
    let hasMore = tbody.dataset.hasMore === 'true';
    let loading = false;
    let observer = null;

    const statusRow = document.createElement('tr');
    statusRow.className = 'infinite-status';
    const statusCell = document.createElement('td');
    statusCell.colSpan = colspan;
    statusRow.appendChild(statusCell);
    tbody.appendChild(statusRow);

    // Chỉ đổi chữ, KHÔNG ẩn dòng này — phần tử không có layout (display:none) sẽ
    // không bao giờ được IntersectionObserver bắt sự kiện "cuộn tới".
    function setStatus(text) {
      statusCell.textContent = text;
    }

    function finish() {
      hasMore = false;
      setStatus(totalItems === 0 ? 'Chưa có dữ liệu.' : 'Đã hiển thị tất cả.');
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }

    // Luôn tạo observer MỚI sau mỗi lần tải xong, thay vì tái dùng observer cũ.
    // IntersectionObserver chỉ gọi callback khi trạng thái giao nhau THAY ĐỔI —
    // nếu dòng cảm biến vẫn còn trong vùng nhìn sau khi thêm dòng mới (màn hình
    // cao, cuộn nhanh...), observer cũ sẽ không báo lại và việc tải thêm sẽ dừng
    // giữa chừng. Gọi lại .observe() luôn kiểm tra trạng thái hiện tại ngay lập
    // tức, nên sẽ tự tải tiếp nếu dòng cảm biến vẫn đang hiển thị.
    function watchSentinel() {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) load();
      }, { rootMargin: '400px 0px' });
      observer.observe(statusRow);
    }

    if (!hasMore) {
      finish();
      return;
    }

    watchSentinel();

    async function load() {
      loading = true;
      if (observer) observer.disconnect();
      setStatus('Đang tải thêm...');

      try {
        const qs = `${paramsStr ? paramsStr + '&' : ''}page=${nextPage}`;
        const res = await fetch(`${baseUrl}?${qs}`, { headers: { 'X-Requested-With': 'fetch-partial' } });
        if (!res.ok) throw new Error('bad status');
        const html = await res.text();
        hasMore = res.headers.get('X-Has-More') === '1';
        statusRow.insertAdjacentHTML('beforebegin', html);
        nextPage += 1;
      } catch (err) {
        setStatus('Không tải thêm được, thử cuộn lại.');
        loading = false;
        watchSentinel();
        return;
      }

      loading = false;
      if (!hasMore) {
        finish();
      } else {
        setStatus('');
        watchSentinel();
      }
    }
  });
});
