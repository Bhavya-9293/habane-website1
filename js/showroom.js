/* HABÄNE — standalone 3D Showroom page (with robust WebGL fallback) */

(function () {
  const H = window.HABANE;

  function webglOK() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  function buildFallbackGrid() {
    const grid = document.getElementById('showroomGrid');
    if (!grid || grid.childElementCount) return;
    const items = H.PRODUCTS.filter(p => p.featured).slice(0, 6);
    const list = items.length ? items : H.PRODUCTS.slice(0, 6);
    grid.innerHTML = list.map(p => H.cardHTML(p)).join('');
    H.bindGrid(grid);
    H.refreshIcons(grid);
  }

  function showFallback(reason) {
    const stage = document.getElementById('showroomStage');
    const pick = document.getElementById('modelPick');
    const fallback = document.getElementById('showroomFallback');
    const link = document.getElementById('showPhotos');
    const note = document.getElementById('fallbackNote');
    if (!fallback) return;
    buildFallbackGrid();
    fallback.hidden = false;
    if (reason === 'auto') {
      if (stage) stage.style.display = 'none';
      if (pick) pick.style.display = 'none';
      if (link) link.style.display = 'none';
      if (note) note.textContent = "3D isn't supported on this device — here's the full range in photos.";
    }
    H.refreshIcons(fallback);
    fallback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function initShowroom() {
    const viewer = document.getElementById('viewer');
    const models = window.HABANE_MODELS;

    // No WebGL at all → skip 3D, show photos immediately (the Lenovo IdeaPad case)
    if (!viewer || !models || !webglOK()) {
      showFallback('auto');
      return;
    }

    viewer.src = models.carryon;

    // If the model never loads (silent failure on weak GPUs), reveal the photo gallery
    let loaded = false;
    viewer.addEventListener('load', () => { loaded = true; }, { once: true });
    viewer.addEventListener('error', () => showFallback('auto'), { once: true });
    setTimeout(() => { if (!loaded) showFallback('auto'); }, 7000);

    document.getElementById('modelPick')?.addEventListener('click', e => {
      const btn = e.target.closest('.model-pick');
      if (!btn) return;
      const key = btn.dataset.model;
      if (!models[key]) return;
      document.querySelectorAll('.model-pick').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      viewer.src = models[key];
      viewer.cameraOrbit = '35deg 75deg 110%';
      H.toast(`Now viewing — ${btn.querySelector('.model-pick__name').textContent}`);
    });

    const spinBtn = document.getElementById('spinToggle');
    spinBtn?.addEventListener('click', () => {
      const on = viewer.hasAttribute('auto-rotate');
      if (on) viewer.removeAttribute('auto-rotate');
      else viewer.setAttribute('auto-rotate', '');
      spinBtn.classList.toggle('is-active', !on);
    });

    document.getElementById('resetView')?.addEventListener('click', () => {
      viewer.cameraOrbit = '35deg 75deg 110%';
      viewer.fieldOfView = 'auto';
      viewer.jumpCameraToGoal?.();
    });

    // Manual "view photos" toggle (always available)
    document.getElementById('showPhotos')?.addEventListener('click', () => showFallback('manual'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    initShowroom();
  });
})();
