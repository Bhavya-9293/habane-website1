/* HABÄNE — smart series page */

(function () {
  const H = window.HABANE;

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();

    // Buyable Smart Series products
    const shop = document.getElementById('ssProducts');
    if (shop) {
      const smart = H.PRODUCTS.filter(p => p.cat === 'smart');
      shop.innerHTML = smart.map(p => H.cardHTML(p)).join('');
      H.bindGrid(shop);
      H.refreshIcons(shop);
    }

    // All 12 features as compact, scannable chips
    const grid = document.getElementById('featGrid');
    if (grid && H.SMART_FEATURES) {
      grid.innerHTML = H.SMART_FEATURES.map((f, i) => `
        <a href="feature.html?id=${f.id}" class="ss-feat-chip" data-index="${i}">
          <span class="ss-feat-chip__icon">${H.icon(f.icon)}</span>
          <span class="ss-feat-chip__label">${f.title}</span>
          <i data-lucide="arrow-up-right" class="ss-feat-chip__arrow"></i>
        </a>`).join('');
      H.refreshIcons(grid);
    }

    H.observeCards();

    if (window.gsap) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.ss-hero2__copy > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
      gsap.from('.ss-benefit', {
        scrollTrigger: { trigger: '.ss-benefits', start: 'top 85%' },
        y: 36, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
      });
      gsap.from('.ss-feat-chip', {
        scrollTrigger: { trigger: grid, start: 'top 88%' },
        y: 20, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out',
      });
    }
  });
})();
