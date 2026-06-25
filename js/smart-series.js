/* HABÄNE — smart series page */

(function () {
  const H = window.HABANE;

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    const grid = document.getElementById('featGrid');
    if (!grid) return;

    grid.innerHTML = H.SMART_FEATURES.map((f, i) => `
      <article class="feat-card" data-index="${i}">
        <div class="feat-card__icon">${H.icon(f.icon)}</div>
        <h3 class="feat-card__title">${f.title}</h3>
        <p class="feat-card__desc">${f.desc}</p>
      </article>`).join('');

    H.refreshIcons(grid);

    if (window.gsap) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.feat-card', {
        scrollTrigger: { trigger: grid, start: 'top 85%' },
        y: 36, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      });
      gsap.from('.ss-hero__copy > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    }
  });
})();
