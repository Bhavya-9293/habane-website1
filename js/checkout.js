/* HABÄNE — checkout page (UI only) */

(function () {
  const H = window.HABANE;

  function renderSummary() {
    const cart = H.cartData;
    const list = document.getElementById('coItems');
    const empty = document.getElementById('coEmpty');
    if (!cart.length) {
      if (list) list.innerHTML = '';
      empty?.removeAttribute('hidden');
      return;
    }
    empty?.setAttribute('hidden', '');
    if (list) {
      list.innerHTML = cart.map(i => {
        const p = H.byId(i.id);
        return `<div class="co-line">
          <img src="${p.img}" alt="">
          <div><strong>${p.name}</strong><span>${i.color} · ${i.size} · Qty ${i.qty}</span></div>
          <em>${H.inr(p.price * i.qty)}</em>
        </div>`;
      }).join('');
    }
    const sub = H.cartSubtotal();
    const disc = H.discountValue(sub);
    document.getElementById('coSubtotal').textContent = H.inr(sub);
    const discRow = document.getElementById('coDiscRow');
    if (disc > 0) {
      discRow.hidden = false;
      document.getElementById('coDisc').textContent = '−' + H.inr(disc);
    } else discRow.hidden = true;
    document.getElementById('coTotal').textContent = H.inr(sub - disc);
  }

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    renderSummary();

    document.getElementById('coForm')?.addEventListener('submit', e => {
      e.preventDefault();
      if (!H.cartData.length) return;
      const order = 'HB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      document.getElementById('doneOrder').textContent = order;
      const sub = H.cartSubtotal();
      const disc = H.discountValue(sub);
      document.getElementById('doneMsg').textContent =
        `${H.cartQty()} item${H.cartQty() !== 1 ? 's' : ''} · ${H.inr(sub - disc)}. Your bags are on the way.`;
      H.clearCart();
      H.openModal(document.getElementById('checkoutDone'));
    });

    document.getElementById('checkoutDone')?.addEventListener('click', e => {
      if (e.target.closest('[data-done-close]')) {
        H.closeModal(document.getElementById('checkoutDone'));
        location.href = 'index.html';
      }
    });
  });
})();
