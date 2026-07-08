document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-validate-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (form.checkValidity()) return;
      event.preventDefault();

      form.querySelectorAll('.field-error').forEach((el) => el.remove());

      let firstInvalid = null;
      Array.from(form.elements).forEach((el) => {
        if (typeof el.checkValidity !== 'function' || el.checkValidity()) return;
        if (!firstInvalid) firstInvalid = el;

        const message = document.createElement('div');
        message.className = 'field-error';
        message.textContent = el.validationMessage;
        el.insertAdjacentElement('afterend', message);
      });

      if (firstInvalid) firstInvalid.focus();
    });
  });
});
