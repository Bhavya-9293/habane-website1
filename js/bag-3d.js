/* HABÄNE — 3D bag icon animation for CTAs */

(function () {
  const H = window.HABANE;

  function bagHTML() {
    return `
      <div class="bag3d-scene" aria-hidden="true">
        <div class="bag3d-scene__shadow"></div>
        <div class="bag3d">
          <div class="bag3d__body">
            <div class="bag3d__front"></div>
            <div class="bag3d__back"></div>
            <div class="bag3d__left"></div>
            <div class="bag3d__right"></div>
            <div class="bag3d__bottom"></div>
            <div class="bag3d__top"></div>
            <div class="bag3d__handle bag3d__handle--l"></div>
            <div class="bag3d__handle bag3d__handle--r"></div>
            <div class="bag3d__zip"></div>
          </div>
        </div>
      </div>`;
  }

  function initBag3d(container, opts = {}) {
    if (!container) return;
    container.insertAdjacentHTML('afterbegin', bagHTML());
    const bag = container.querySelector('.bag3d');
    const shadow = container.querySelector('.bag3d-scene__shadow');
    if (!bag) return;

    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(bag, {
        rotateY: 360,
        duration: opts.speed || 8,
        repeat: -1,
        ease: 'none',
      });
      gsap.to(bag, {
        y: -6,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(shadow, {
        scale: 0.85,
        opacity: 0.4,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    } else {
      bag.style.animation = 'bag3dSpin 8s linear infinite';
    }
  }

  H.initBag3d = initBag3d;
})();
