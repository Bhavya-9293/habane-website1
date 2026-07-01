/* HABÄNE — product detail page */

(function () {
  const H = window.HABANE;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  let state = { color: null, size: null, qty: 1, imgIndex: 0 };

  function render(p) {
    if (!p) {
      document.querySelector('.pd')?.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Product not found.', className: 'pd__missing' }));
      return;
    }

    document.title = `${p.name} — HABÄNE`;
    state.color = p.colors[0].name;
    state.size = p.sizes[0];

    const imgs = p.images || [p.img, p.img2].filter(Boolean);
    const mainImg = document.getElementById('pdMainImg');
    const thumbs = document.getElementById('pdThumbs');
    if (mainImg) { mainImg.src = imgs[0]; mainImg.alt = p.name; }
    if (thumbs) {
      thumbs.innerHTML = imgs.map((src, i) =>
        `<button type="button" class="pd__thumb ${i === 0 ? 'is-active' : ''}" data-i="${i}"><img src="${src}" alt=""></button>`).join('');
    }

    document.getElementById('pdCat').textContent = p.catLabel;
    document.getElementById('pdName').textContent = p.name;
    const crumb = document.getElementById('pdNameCrumb');
    if (crumb) crumb.textContent = p.name;
    document.getElementById('pdStars').innerHTML = H.stars(p.stars);
    document.getElementById('pdDesc').textContent = p.desc;
    document.getElementById('pdPrice').innerHTML = `<span data-inr="${p.price}">${H.inr(p.price)}</span>${p.was ? ` <s data-inr="${p.was}">${H.inr(p.was)}</s>` : ''}`;

    const badge = document.getElementById('pdBadge');
    if (badge) {
      badge.textContent = p.badge || '';
      badge.hidden = !p.badge;
    }

    document.getElementById('pdColors').innerHTML = p.colors.map((c, i) =>
      `<button type="button" class="pd__color ${i === 0 ? 'on' : ''}" data-color="${c.name}" title="${c.name}" style="--c:${c.hex}"></button>`).join('');
    document.getElementById('pdColorName').textContent = p.colors[0].name;

    document.getElementById('pdSizes').innerHTML = p.sizes.map((s, i) =>
      `<button type="button" class="pd__size ${i === 0 ? 'on' : ''}" data-size="${s}">${s}</button>`).join('');

    document.getElementById('pdQty').textContent = '1';

    const specs = document.getElementById('pdSpecs');
    if (specs && p.specs) {
      specs.innerHTML = Object.entries(p.specs).map(([k, v]) =>
        `<div class="pd__spec"><span>${k}</span><strong>${v}</strong></div>`).join('');
    }

    const feats = document.getElementById('pdSmartFeats');
    if (feats) {
      const list = (p.smartFeatures || []).map(fid => H.SMART_FEATURES.find(f => f.id === fid)).filter(Boolean);
      feats.innerHTML = list.length
        ? list.map(f => `<div class="pd__feat"><span class="pd__feat-icon">${H.icon(f.icon)}</span><div><strong>${f.title}</strong><p>${f.desc}</p></div></div>`).join('')
        : '<p class="pd__no-smart">Classic carry — no smart electronics in this model.</p>';
      H.refreshIcons(feats);
    }

    const wishBtn = document.getElementById('pdWish');
    if (wishBtn) {
      const liked = H.isWish(p.id);
      wishBtn.classList.toggle('liked', liked);
      wishBtn.innerHTML = H.icon('heart') + (liked ? ' Saved' : ' Wishlist');
      H.refreshIcons(wishBtn);
    }
  }

  function renderRelated(p) {
    const track = document.getElementById('relatedGrid');
    if (!track) return;
    const same = H.PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat);
    const others = H.PRODUCTS.filter(x => x.id !== p.id && x.cat !== p.cat);
    const rel = [...same, ...others].slice(0, 10);
    track.innerHTML = rel.map(x => H.cardHTML(x)).join('');
    H.bindGrid(track);
    H.observeCards();
    H.refreshIcons(track);

    const step = () => {
      const card = track.querySelector('.card');
      const w = card ? card.getBoundingClientRect().width + 20 : 320;
      return Math.max(w, Math.round(track.clientWidth * 0.8));
    };
    document.getElementById('relPrev')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    document.getElementById('relNext')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* Amazon-style hover-to-zoom on the main product image (desktop only) */
  function initZoom() {
    const box = document.querySelector('.pd__main');
    const img = document.getElementById('pdMainImg');
    if (!box || !img) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    box.classList.add('pd__main--zoom');
    if (!box.querySelector('.pd__zoom-hint')) {
      box.insertAdjacentHTML('beforeend',
        `<span class="pd__zoom-hint">${H.icon('zoom-in')} Hover to zoom</span>`);
      H.refreshIcons(box);
    }
    const ZOOM = 2.3;
    box.addEventListener('mousemove', e => {
      const r = box.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = `scale(${ZOOM})`;
    });
    box.addEventListener('mouseenter', () => box.classList.add('is-zooming'));
    box.addEventListener('mouseleave', () => {
      box.classList.remove('is-zooming');
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    const p = H.byId(id);
    render(p);
    if (!p) return;
    renderRelated(p);
    initZoom();

    document.getElementById('pdThumbs')?.addEventListener('click', e => {
      const t = e.target.closest('.pd__thumb');
      if (!t) return;
      const imgs = p.images || [p.img];
      document.getElementById('pdMainImg').src = imgs[t.dataset.i];
      document.querySelectorAll('.pd__thumb').forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
    });

    document.querySelector('.pd')?.addEventListener('click', e => {
      const col = e.target.closest('[data-color]');
      const siz = e.target.closest('[data-size]');
      const step = e.target.closest('[data-step]');
      if (col) {
        state.color = col.dataset.color;
        document.querySelectorAll('.pd__color').forEach(b => b.classList.remove('on'));
        col.classList.add('on');
        document.getElementById('pdColorName').textContent = col.dataset.color;
      }
      if (siz) {
        state.size = siz.dataset.size;
        document.querySelectorAll('.pd__size').forEach(b => b.classList.remove('on'));
        siz.classList.add('on');
      }
      if (step) {
        state.qty = Math.max(1, state.qty + Number(step.dataset.step));
        document.getElementById('pdQty').textContent = state.qty;
      }
    });

    document.getElementById('pdAdd')?.addEventListener('click', () => {
      H.addToCartUI(p.id, state.color, state.size, state.qty);
    });

    document.getElementById('pdBuy')?.addEventListener('click', () => {
      H.addToCart(p.id, state.color, state.size, state.qty);
      H.syncCart();
      location.href = 'checkout.html';
    });

    document.getElementById('pdWish')?.addEventListener('click', () => {
      const liked = H.toggleWish(p.id);
      const btn = document.getElementById('pdWish');
      btn.classList.toggle('liked', liked);
      btn.innerHTML = H.icon('heart') + (liked ? ' Saved' : ' Wishlist');
      H.refreshIcons(btn);
      H.toast(liked ? 'Saved to wishlist' : 'Removed from wishlist');
    });

    if (window.gsap) {
      gsap.from('.pd__gallery, .pd__info', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    }
  });
})();
