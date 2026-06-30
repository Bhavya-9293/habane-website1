/* HABÄNE — shared UI components */

(function () {
  const H = window.HABANE;
  H.events = H.events || new EventTarget();
  const { byId, inr, FREE_SHIP, discountValue, cartQty, cartSubtotal } = H;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ---- Lucide icons ---- */
  function icon(name, cls = '') {
    return `<i data-lucide="${name}" class="icon ${cls}" aria-hidden="true"></i>`;
  }

  function refreshIcons(root) {
    if (!window.lucide) return;
    if (root) window.lucide.createIcons({ attrs: { class: 'icon' }, nameAttr: 'data-lucide', root });
    else window.lucide.createIcons({ attrs: { class: 'icon' }, nameAttr: 'data-lucide' });
  }
  H.icon = icon;
  H.refreshIcons = refreshIcons;

  /* ---- Toast ---- */
  const toastEl = () => document.getElementById('toast');
  let toastT;
  function toast(msg) {
    const el = toastEl();
    if (!el) return;
    el.innerHTML = msg;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 2800);
  }
  H.toast = toast;

  /* ---- Modals ---- */
  function openModal(el) {
    if (!el) return;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  function closeModal(el) {
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.qv.open,.cart.open,.search-pop.open,.done.open,.wheel.open,.auth-pop.open'))
      document.body.classList.remove('no-scroll');
  }
  H.openModal = openModal;
  H.closeModal = closeModal;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
      $$('.qv.open,.cart.open,.search-pop.open,.done.open,.wheel.open,.auth-pop.open').forEach(closeModal);
  });

  /* ---- Nav scroll transparency ---- */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('shrink', scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile drawer ---- */
  function initDrawer() {
    const burger = $('#burger');
    const drawer = $('#drawer');
    if (!burger || !drawer) return;
    const close = () => { burger.classList.remove('open'); drawer.classList.remove('open'); };
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    H.closeDrawer = close;
  }

  /* ---- Profile dropdown ---- */
  function initProfile() {
    const btn = $('#profileBtn');
    const menu = $('#profileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('[data-auth]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        openModal($('#authPop'));
        menu.classList.remove('open');
      });
    });
    $('#authClose')?.addEventListener('click', () => closeModal($('#authPop')));
    $('#authCloseOverlay')?.addEventListener('click', () => closeModal($('#authPop')));
  }

  /* ---- Wishlist button ---- */
  function initWishNav() {
    const btn = $('#wishBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const ids = H.wishData;
      if (!ids.length) { toast('Your wishlist is empty'); return; }
      openModal($('#searchPop'));
      runSearch('');
      $('#searchInput').value = '';
      $('#searchResults').innerHTML = `<p class="search-pop__hint">Wishlist</p>` +
        ids.map(id => {
          const p = byId(id);
          return searchRowHTML(p);
        }).join('');
    });
    H.events.addEventListener('wish:update', syncWishCount);
    syncWishCount();
  }

  function syncWishCount() {
    const n = H.wishData.length;
    const el = $('#wishCount');
    if (el) { el.textContent = n; el.hidden = n === 0; }
  }

  /* ---- Location selector (floating, bottom-left) ---- */
  function flagImg(code, cls) {
    return `<img class="${cls}" src="https://flagcdn.com/${code.toLowerCase()}.svg" alt="" width="24" height="18" loading="lazy">`;
  }

  function initLocation() {
    const wrap = $('#locSelect');
    if (!wrap) return;
    // float it on the page, not inside the nav
    if (wrap.parentElement !== document.body) document.body.appendChild(wrap);
    const btn = wrap.querySelector('.loc-select__btn');
    const panel = wrap.querySelector('.loc-select__panel');
    const search = wrap.querySelector('.loc-select__search');
    const list = wrap.querySelector('.loc-select__list');
    let current = H.getLocation();

    function render(filter = '') {
      const q = filter.toLowerCase();
      const items = H.COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q));
      list.innerHTML = items.map(c => `
        <button type="button" class="loc-select__item ${c.code === current.code ? 'is-active' : ''}" data-code="${c.code}">
          ${flagImg(c.code, 'loc-select__flag-img')}
          <span class="loc-select__name">${c.name}</span>
          <span class="loc-select__cur">${c.currency}</span>
        </button>`).join('');
    }

    function updateBtn() {
      btn.innerHTML = `${flagImg(current.code, 'loc-select__flag-img')}<span>${current.currency}</span>${icon('chevron-down', 'loc-select__chev')}`;
      refreshIcons(btn);
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      wrap.classList.toggle('open');
      if (wrap.classList.contains('open')) { render(); search.focus(); }
    });
    search.addEventListener('input', () => render(search.value));
    list.addEventListener('click', e => {
      const item = e.target.closest('.loc-select__item');
      if (!item) return;
      current = H.COUNTRIES.find(c => c.code === item.dataset.code);
      H.setLocation(current);
      updateBtn();
      wrap.classList.remove('open');
      toast(`Region set to ${current.name}`);
    });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });
    H.events.addEventListener('location:update', e => { current = e.detail; updateBtn(); });
    updateBtn();
    render();
  }

  /* ---- Search ---- */
  function searchRowHTML(p) {
    return `<button class="search-row" data-id="${p.id}" type="button">
      <img src="${p.img}" alt="">
      <span><strong>${p.name}</strong><em>${p.catLabel} · ${inr(p.price)}</em></span>
      ${icon('arrow-up-right', 'search-row__arrow')}
    </button>`;
  }

  function runSearch(q) {
    q = q.trim().toLowerCase();
    const list = !q ? H.PRODUCTS.slice(0, 4)
      : H.PRODUCTS.filter(p => (p.name + ' ' + p.catLabel + ' ' + p.desc).toLowerCase().includes(q));
    const res = $('#searchResults');
    if (!res) return;
    if (!list.length) {
      res.innerHTML = `<p class="search-pop__none">No matches for "${q}". Try "duffel" or "smart".</p>`;
      return;
    }
    res.innerHTML = (q ? '' : '<p class="search-pop__hint">Popular right now</p>') + list.map(searchRowHTML).join('');
    refreshIcons(res);
  }

  function initSearch() {
    const pop = $('#searchPop');
    const btn = $('#searchBtn');
    if (!btn || !pop) return;
    btn.addEventListener('click', () => {
      openModal(pop);
      setTimeout(() => $('#searchInput')?.focus(), 60);
      runSearch('');
    });
    $('#searchClose')?.addEventListener('click', () => closeModal(pop));
    pop.addEventListener('click', e => { if (e.target === pop) closeModal(pop); });
    $('#searchInput')?.addEventListener('input', e => runSearch(e.target.value));
    $('#searchResults')?.addEventListener('click', e => {
      const row = e.target.closest('.search-row');
      if (!row) return;
      closeModal(pop);
      window.location.href = `product.html?id=${row.dataset.id}`;
    });
  }

  /* ---- Cart drawer ---- */
  function lineHTML(i) {
    const p = byId(i.id);
    return `
    <div class="line" data-key="${i.key}">
      <div class="line__img"><img src="${p.img}" alt="${p.name}"></div>
      <div class="line__info">
        <h4>${p.name}</h4>
        <span class="line__meta">${i.color} · ${i.size}</span>
        <div class="line__bottom">
          <div class="line__qty">
            <button data-dec type="button" aria-label="Decrease">${icon('minus')}</button>
            <span>${i.qty}</span>
            <button data-inc type="button" aria-label="Increase">${icon('plus')}</button>
          </div>
          <span class="line__price">${inr(p.price * i.qty)}</span>
        </div>
      </div>
      <button class="line__rm" data-rm type="button" aria-label="Remove">${icon('x')}</button>
    </div>`;
  }

  function syncCart() {
    const cart = H.cartData;
    const qty = cartQty();
    const countEls = $$('#cartCount, .drawer-cart-count');
    countEls.forEach(el => { if (el) el.textContent = qty; });
    const itemsEl = $('#cartItems');
    if (itemsEl) itemsEl.textContent = `(${qty})`;

    const body = $('#cartBody');
    const empty = $('#cartEmpty');
    const foot = $('#cartFoot');
    const ship = document.querySelector('.cart__ship');
    const cartEl = $('#cart');

    if (!body) return;

    if (!cart.length) {
      body.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      if (foot) foot.style.display = 'none';
      if (ship) ship.style.display = 'none';
    } else {
      if (empty) empty.style.display = 'none';
      if (foot) foot.style.display = 'block';
      if (ship) ship.style.display = 'block';
      body.innerHTML = cart.map(lineHTML).join('');
      refreshIcons(body);
      const sub = cartSubtotal();
      const subEl = $('#cartSubtotal');
      if (subEl) subEl.textContent = inr(sub);

      const promo = H.promoData;
      const disc = discountValue(sub);
      const promoBox = $('#cartPromo');
      const discRow = $('#cartDiscRow');
      const totalRow = $('#cartTotalRow');
      if (promo && promoBox) { promoBox.hidden = false; $('#cartPromoChip').textContent = promo.code; }
      else if (promoBox) promoBox.hidden = true;
      if (disc > 0) {
        if (discRow) { discRow.hidden = false; $('#cartDisc').textContent = '−' + inr(disc); }
        if (totalRow) { totalRow.hidden = false; $('#cartTotal').textContent = inr(sub - disc); }
      } else {
        if (discRow) discRow.hidden = true;
        if (totalRow) totalRow.hidden = true;
      }

      const pct = Math.min(100, Math.round(sub / FREE_SHIP * 100));
      const bar = $('#shipBar');
      if (bar) bar.style.width = pct + '%';
      const msg = $('#shipMsg');
      if (msg) {
        msg.innerHTML = sub >= FREE_SHIP
          ? 'You unlocked <strong>free shipping</strong>'
          : `Add <strong>${inr(FREE_SHIP - sub)}</strong> more for <strong>free shipping</strong>`;
      }
    }
    refreshIcons(cartEl);
  }

  function bumpCart() {
    const el = $('#cartCount');
    if (!el?.animate) return;
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }],
      { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
  }

  function initCart() {
    const cartEl = $('#cart');
    $('#cartBtn')?.addEventListener('click', () => openModal(cartEl));
    $('#drawerCartLink')?.addEventListener('click', e => {
      e.preventDefault();
      H.closeDrawer?.();
      openModal(cartEl);
    });
    cartEl?.addEventListener('click', e => {
      if (e.target.closest('[data-cart-close]')) closeModal(cartEl);
    });
    $('#cartBody')?.addEventListener('click', e => {
      const line = e.target.closest('.line');
      if (!line) return;
      const key = line.dataset.key;
      if (e.target.closest('[data-inc]')) H.changeQty(key, 1);
      if (e.target.closest('[data-dec]')) H.changeQty(key, -1);
      if (e.target.closest('[data-rm]')) H.removeItem(key);
    });
    $('#checkoutBtn')?.addEventListener('click', () => {
      if (!H.cartData.length) return;
      window.location.href = 'checkout.html';
    });
    H.events.addEventListener('cart:update', syncCart);
    syncCart();
  }

  H.syncCart = syncCart;
  H.bumpCart = bumpCart;
  H.runSearch = runSearch;

  H.addToCartUI = function (id, color, size, qty) {
    const p = H.addToCart(id, color, size, qty);
    toast(`Added "${p.name}"`);
    bumpCart();
    openModal($('#cart'));
  };

  /* ---- Product card HTML ---- */
  H.cardHTML = function (p, opts = {}) {
    let badgeClass = 'card__badge--black';
    if (p.badge === 'BESTSELLER' || p.badge === 'SALE' || p.badge === 'TRENDING') {
      badgeClass = 'card__badge--red';
    }
    const badge = p.badge ? `<span class="card__badge ${badgeClass}">${p.badge}</span>` : '';
    const was = p.was ? `<span class="card__was">${inr(p.was)}</span>` : '';
    const liked = H.isWish(p.id);
    const back = p.img2 ? `<img class="card__img card__img--back" src="${p.img2}" alt="" loading="lazy">` : '';
    return `
    <article class="card ${p.img2 ? 'has-alt' : ''}" data-cat="${p.cat}" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="card__link">
        <div class="card__media">
          ${badge}
          <button class="card__wish ${liked ? 'liked' : ''}" data-wish type="button" aria-label="Wishlist">${icon('heart')}</button>
          <img class="card__img card__img--front" src="${p.img}" alt="${p.name}" loading="lazy">
          ${back}
          <div class="card__quick">
            <span class="card__view">VIEW DETAILS</span>
            <button class="card__add" data-add type="button">QUICK ADD</button>
          </div>
        </div>
        <div class="card__body">
          <div class="card__info">
            <div class="card__info-left">
              <h3 class="card__name">${p.name.toUpperCase()}</h3>
              <span class="card__cat">${p.catLabel}</span>
            </div>
            <div class="card__info-right">
              <span class="card__price">${inr(p.price)}</span>
              ${was}
            </div>
          </div>
        </div>
      </a>
    </article>`;
  };

  H.bindGrid = function (gridEl) {
    if (!gridEl) return;
    gridEl.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (!card) return;
      const id = card.dataset.id;
      if (e.target.closest('[data-wish]')) {
        e.preventDefault();
        e.stopPropagation();
        const liked = H.toggleWish(id);
        const btn = e.target.closest('[data-wish]');
        btn.classList.toggle('liked', liked);
        btn.innerHTML = icon('heart');
        refreshIcons(btn);
        toast(liked ? 'Saved to wishlist' : 'Removed from wishlist');
        return;
      }
      if (e.target.closest('[data-add]')) {
        e.preventDefault();
        e.stopPropagation();
        const p = byId(id);
        H.addToCartUI(id, p.colors[0].name, p.sizes[0], 1);
      }
    });
  };

  H.observeCards = function () {
    const io = new IntersectionObserver(ents => {
      ents.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add('in'), i * 60);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.card').forEach(c => io.observe(c));
  };

  /* ---- Ribbon / marquee (seamless, gap-proof) ---- */
  const RIBBON_PHRASE = 'FREE SHIPPING OVER ₹4,999  ·  LIFETIME ZIPPER WARRANTY  ·  7-DAY EASY RETURNS  ·  COD AVAILABLE NATIONWIDE  ·  CARRY THE CITY  ·  ';
  function fillRibbon(track) {
    const phrase = track.dataset.phrase || RIBBON_PHRASE;
    const span = document.createElement('span');
    track.innerHTML = '';
    track.appendChild(span);
    let txt = phrase;
    span.textContent = txt;
    let guard = 0;
    // repeat until one copy is wider than the viewport → -50% loop never shows a gap
    while (span.offsetWidth < window.innerWidth + 200 && guard < 30) {
      txt += phrase;
      span.textContent = txt;
      guard++;
    }
    track.appendChild(span.cloneNode(true));
  }
  function initRibbon() {
    const tracks = $$('.ribbon__track');
    if (!tracks.length) return;
    tracks.forEach(fillRibbon);
    let rt;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => tracks.forEach(fillRibbon), 200);
    });
  }

  /* ---- Rayred-style footer (every page except the homepage) ---- */
  function initFooter() {
    const foot = document.querySelector('.foot');
    if (!foot || document.body.dataset.page === 'home') return;
    foot.innerHTML = `
      <div class="foot__top">
        <div class="foot__brand">
          <img src="assets/brand/wordmark-silver.png" alt="Habäne" class="foot__word">
          <p class="foot__tag">Carry the city. Leave the baggage.</p>
          <div class="foot__social">
            <a href="#" aria-label="Instagram">${icon('instagram')}</a>
            <a href="#" aria-label="YouTube">${icon('youtube')}</a>
            <a href="#" aria-label="Twitter">${icon('twitter')}</a>
          </div>
        </div>
        <div class="foot__col">
          <h4>Shop</h4>
          <a href="shop.html">All Products</a>
          <a href="shop.html?cat=duffel">Duffels</a>
          <a href="shop.html?cat=backpack">Backpacks</a>
          <a href="smart-series.html">Smart Series</a>
        </div>
        <div class="foot__col">
          <h4>About Us</h4>
          <a href="index.html#story">Our Story</a>
          <a href="contact.html">Contact Us</a>
          <a href="showroom.html">3D Showroom</a>
        </div>
        <div class="foot__col">
          <h4>Help</h4>
          <a href="#">Track Your Order</a>
          <a href="#">Returns &amp; Exchange</a>
          <a href="#">Shipping Info</a>
        </div>
      </div>
      <div class="foot__bottom">
        <p>© <span id="yr"></span> Habäne. All rights reserved.</p>
        <a href="index.html" class="foot__vibe">Back to home</a>
      </div>`;
    refreshIcons(foot);
  }

  /* ---- Floating 3D Showroom button (bottom-right) ---- */
  function initShowroomFab() {
    if (document.body.dataset.page === 'showroom') return;
    if (document.querySelector('.showroom-fab')) return;
    const a = document.createElement('a');
    a.href = 'showroom.html';
    a.className = 'showroom-fab';
    a.setAttribute('aria-label', 'Open 3D Showroom');
    a.innerHTML = `${icon('box')}<span>3D Showroom</span>`;
    document.body.appendChild(a);
    refreshIcons(a);
  }

  /* ---- Boot shared UI ---- */
  H.initShared = function () {
    initNav();
    initDrawer();
    initProfile();
    initWishNav();
    initLocation();
    initSearch();
    initCart();
    initRibbon();
    initFooter();
    initShowroomFab();
    const yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();
    refreshIcons();
  };
})();
