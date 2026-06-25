/* HABÄNE — 3D coin toss animation (CSS 3D + GSAP) */

(function () {
  const H = window.HABANE;

  function initCoin(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="coin-scene" aria-hidden="true">
        <div class="coin-scene__shadow"></div>
        <div class="coin coin--lg" id="habaneCoin">
          <div class="coin__edge"></div>
          <div class="coin__face coin__face--front">
            <div class="coin__shine"></div>
            <div class="coin__brand">
              <img src="assets/brand/logo-white.png" alt="" class="coin__logo">
              <span class="coin__word">HABÄNE</span>
            </div>
          </div>
          <div class="coin__face coin__face--back">
            <div class="coin__shine"></div>
            <div class="coin__bag-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="22" width="40" height="32" rx="6" stroke="currentColor" stroke-width="2.5"/>
                <path d="M22 22V18a10 10 0 0 1 20 0v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="12" y1="34" x2="52" y2="34" stroke="currentColor" stroke-width="2" opacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>`;

    const coin = container.querySelector('#habaneCoin');
    const shadow = container.querySelector('.coin-scene__shadow');

    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });
      tl.to(coin, {
        rotateX: 720,
        rotateY: 360,
        y: -36,
        duration: 2.4,
        ease: 'power1.inOut',
      })
        .to(coin, { y: 0, duration: 2.4, ease: 'power1.inOut' }, '-=2.4')
        .to(shadow, { scale: 0.7, opacity: 0.3, duration: 1.2, yoyo: true, repeat: 1 }, 0);
    } else {
      coin.style.animation = 'coinSpin 4s ease-in-out infinite';
    }
  }

  H.initCoin = initCoin;
})();
