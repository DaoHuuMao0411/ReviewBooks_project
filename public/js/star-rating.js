document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-star-input]').forEach((fieldset) => {
    const live = fieldset.querySelector('[data-star-live]');
    if (!live) return;

    fieldset.addEventListener('change', (event) => {
      if (event.target.matches('input[type=radio]')) {
        live.textContent = `Bạn đã chọn ${event.target.value} sao`;
      }
    });
  });
});
