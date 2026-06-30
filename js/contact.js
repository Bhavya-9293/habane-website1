/* HABÄNE — contact page */

(function () {
  const H = window.HABANE;

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    const form = document.getElementById('contactForm');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const done = document.getElementById('contactDone');
      if (done) done.textContent = "Thanks — your message is on its way. We'll reply within 24 hours.";
      form.reset();
      H.toast('Message sent ✦');
    });
  });
})();
