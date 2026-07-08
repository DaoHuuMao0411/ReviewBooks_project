document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-main-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Menu di động riêng cho khu vực quản trị (admin-header.ejs)
  const adminToggle = document.querySelector('[data-nav-toggle]');
  const adminPanel = document.querySelector('[data-nav-panel]');

  if (adminToggle && adminPanel) {
    adminToggle.addEventListener('click', () => {
      const isOpen = adminPanel.classList.toggle('is-open');
      adminToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
});
