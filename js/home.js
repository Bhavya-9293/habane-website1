/* HABÄNE — homepage */

(function () {
  const H = window.HABANE;

  function initFeatured() {
    const track = document.getElementById('grid');
    if (!track) return;
    // show a fuller range in the carousel (featured + best-sellers first)
    const priority = H.PRODUCTS.filter(p => p.featured || p.bestSelling);
    const rest = H.PRODUCTS.filter(p => !p.featured && !p.bestSelling);
    const list = [...priority, ...rest].slice(0, 12);
    track.innerHTML = list.map(p => H.cardHTML(p)).join('');
    H.bindGrid(track);
    H.observeCards();
    H.refreshIcons();

    // left/right carousel controls
    const prev = document.getElementById('rangePrev');
    const next = document.getElementById('rangeNext');
    const step = () => {
      const card = track.querySelector('.card');
      const w = card ? card.getBoundingClientRect().width + 20 : 320;
      return Math.max(w, Math.round(track.clientWidth * 0.8));
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  function initSmartSplit() {
    const section = document.querySelector('.smart-split');
    if (!section || !window.gsap) return;
    gsap.from('.smart-split__panel', {
      scrollTrigger: { trigger: section, start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    });
  }

  function initFaqCarousel() {
    const track = document.getElementById('faqTrack');
    const prev = document.getElementById('faqPrev');
    const next = document.getElementById('faqNext');
    if (!track) return;

    track.innerHTML = H.FAQ_ITEMS.map((item, i) => `
      <article class="faq-card" data-index="${i}">
        <div class="faq-card__media">
          <img src="${item.img}" alt="">
        </div>
        <div class="faq-card__body">
          <span class="faq-card__tag">${item.tag}</span>
          <h3 class="faq-card__q">"${item.q.toUpperCase()}"</h3>
          <p class="faq-card__a">${item.a}</p>
          <div class="faq-card__nav">
            <button type="button" class="faq-card__arrow" data-faq-prev aria-label="Previous">${H.icon('chevron-left')}</button>
            <button type="button" class="faq-card__arrow" data-faq-next aria-label="Next">${H.icon('chevron-right')}</button>
          </div>
        </div>
      </article>`).join('');

    let index = 0;
    const cards = [...track.querySelectorAll('.faq-card')];
    const total = cards.length;

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = `translateX(calc(-${index} * (min(88vw, 720px) + 1.2rem)))`;
      cards.forEach((c, j) => c.classList.toggle('is-active', j === index));
    }

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    track.addEventListener('click', e => {
      if (e.target.closest('[data-faq-prev]')) goTo(index - 1);
      if (e.target.closest('[data-faq-next]')) goTo(index + 1);
    });

    let startX = 0;
    let dragging = false;
    track.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointerup', e => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (dx > 60) goTo(index - 1);
      else if (dx < -60) goTo(index + 1);
    });

    goTo(0);
    H.refreshIcons(track);
  }

  function initNewsletter() {
    document.getElementById('newsForm')?.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('newsDone').textContent = "You're in. Welcome to the list.";
      e.target.reset();
      H.toast('Subscribed — see you in your inbox');
    });
  }

  /* Rotating Habäne logo medallion — auto-spins, drag to control */
  function initLogo3d() {
    const el = document.getElementById('logo3d');
    if (!el) return;
    let rot = -18;          // current Y rotation (deg)
    let vel = 0.35;         // auto-spin speed (deg/frame)
    let dragging = false;
    let lastX = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function apply() { el.style.transform = `rotateX(-8deg) rotateY(${rot}deg)`; }

    function frame() {
      if (!dragging && !reduce) rot += vel;
      apply();
      requestAnimationFrame(frame);
    }

    el.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-grabbing');
    });
    el.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rot += dx * 0.6;
      vel = Math.max(-2, Math.min(2, dx * 0.15)) || vel;
      apply();
    });
    const release = () => { dragging = false; el.classList.remove('is-grabbing'); if (Math.abs(vel) < 0.1) vel = 0.35; };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);

    apply();
    requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    H.initShared();

    initLogo3d();
    initFeatured();
    initSmartSplit();
    initFaqCarousel();
    initNewsletter();
    if (window.gsap) {
      gsap.from('.hero__inner > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
    }
  });
})();
