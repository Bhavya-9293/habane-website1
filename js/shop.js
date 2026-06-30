/* HABÄNE — shop page */

(function () {
  const H = window.HABANE;
  let currentFilter = 'all';
  let currentSort = 'featured';
  let priceMin = 0;
  let priceMax = 20000;
  let searchQ = '';
  let layout = 'grid';
  let currentColor = 'all';

  function visibleProducts() {
    let list = [...H.PRODUCTS];
    if (currentFilter !== 'all') list = list.filter(p => p.cat === currentFilter);
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);
    if (currentColor !== 'all') {
      list = list.filter(p => (p.colors || []).some(c => c.name === currentColor));
    }
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(p => (p.name + ' ' + p.catLabel + ' ' + p.desc).toLowerCase().includes(q));
    }
    switch (currentSort) {
      case 'low': list.sort((a, b) => a.price - b.price); break;
      case 'high': list.sort((a, b) => b.price - a.price); break;
      case 'new': list.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0)); break;
      case 'bestselling': list.sort((a, b) => (b.bestSelling ? 1 : 0) - (a.bestSelling ? 1 : 0)); break;
      default: break;
    }
    return list;
  }

  function render() {
    const grid = document.getElementById('shopGrid');
    const count = document.getElementById('shopCount');
    if (!grid) return;
    const list = visibleProducts();
    grid.classList.toggle('grid--list', layout === 'list');
    grid.innerHTML = list.length
      ? list.map(p => H.cardHTML(p)).join('')
      : `<p class="shop-empty">No products match your filters.</p>`;
    if (count) count.textContent = `${list.length} style${list.length !== 1 ? 's' : ''}`;
    H.bindGrid(grid);
    H.observeCards();
    H.refreshIcons();
  }

  const CAT_INFO = {
    all: {
      title: "ALL PRODUCTS",
      desc: "Built for everyday and everywhere travel. Habäne smart bags are engineered with premium materials, active charging systems, and modular organization."
    },
    duffel: {
      title: "SMART DUFFELS",
      desc: "High-capacity smart duffels built in metallic silver and midnight navy. Featuring dedicated clothes compression, shoe compartments, and quick travel accessibility."
    },
    backpack: {
      title: "TECH BACKPACKS",
      desc: "Sleek and secure rolltop daypacks and heritage backpacks. Perfect for daily commutes or weekend trips, with suspended laptop guards and anti-theft storage."
    },
    smart: {
      title: "SMART SERIES",
      desc: "The cutting edge of travel technology. Biometric fingerprint scanners, active RGB indicator lights, built-in device check-in panel, and charging cores."
    },
    sling: {
      title: "CITY SLINGS",
      desc: "Compact, weather-resistant crossbody bags for your everyday essentials. Safeguard your phone, cards, and keys with RFID-blocking liners and hidden pockets."
    }
  };

  function updateHeader() {
    const titleEl = document.getElementById('shopTitle');
    const descEl = document.getElementById('shopDesc');
    const info = CAT_INFO[currentFilter] || CAT_INFO.all;
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;
  }

  function buildColorFilter() {
    const wrap = document.getElementById('colorFilters');
    if (!wrap) return;
    const seen = new Map();
    H.PRODUCTS.forEach(p => (p.colors || []).forEach(c => { if (!seen.has(c.name)) seen.set(c.name, c.hex); }));
    wrap.innerHTML =
      `<button class="color-swatch is-active" data-color="all" type="button" title="All colours"><span class="color-swatch__all">All</span></button>` +
      [...seen.entries()].map(([name, hex]) =>
        `<button class="color-swatch" data-color="${name}" type="button" title="${name}"><span style="background:${hex}"></span></button>`).join('');
    wrap.addEventListener('click', e => {
      const btn = e.target.closest('.color-swatch');
      if (!btn) return;
      currentColor = btn.dataset.color;
      wrap.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    buildColorFilter();
    const params = new URLSearchParams(location.search);
    if (params.get('cat')) {
      currentFilter = params.get('cat');
      document.querySelectorAll('#shopFilters .pill').forEach(p => {
        p.classList.toggle('is-active', p.dataset.filter === currentFilter);
      });
    }
    updateHeader();
    const grid = document.getElementById('shopGrid');
    H.bindGrid(grid);

    // Filter categories click
    document.getElementById('shopFilters')?.addEventListener('click', e => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      document.querySelectorAll('#shopFilters .pill').forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentFilter = btn.dataset.filter;
      updateHeader();
      render();
    });

    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceLabel = document.getElementById('priceLabel');
    priceRange?.addEventListener('input', e => {
      priceMax = Number(e.target.value);
      if (priceLabel) priceLabel.textContent = `Up to ${H.inr(priceMax)}`;
      render();
    });

    // Sort Toggle dropdown
    const sortToggle = document.getElementById('sortToggle');
    const sortDropdown = document.getElementById('sortDropdown');
    const sortVal = document.getElementById('sortVal');
    
    sortToggle?.addEventListener('click', e => {
      e.stopPropagation();
      sortDropdown?.classList.toggle('open');
    });

    sortDropdown?.addEventListener('click', e => {
      const opt = e.target.closest('.sort-option');
      if (!opt) return;
      currentSort = opt.dataset.sort;
      if (sortVal) sortVal.textContent = opt.textContent;
      sortDropdown.querySelectorAll('.sort-option').forEach(o => o.classList.remove('is-active'));
      opt.classList.add('is-active');
      sortDropdown.classList.remove('open');
      render();
    });

    // Filter sidebar drawer (mobile)
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');
    filterToggle?.addEventListener('click', e => {
      e.stopPropagation();
      filterPanel?.classList.toggle('open');
      filterToggle.classList.toggle('is-active');
    });
    document.getElementById('filterClose')?.addEventListener('click', () => {
      filterPanel?.classList.remove('open');
      filterToggle?.classList.remove('is-active');
    });

    // Clear all filters
    document.getElementById('filterClear')?.addEventListener('click', () => {
      currentFilter = 'all';
      currentColor = 'all';
      priceMax = 15000;
      document.querySelectorAll('#shopFilters .pill').forEach(p => p.classList.toggle('is-active', p.dataset.filter === 'all'));
      document.querySelectorAll('#colorFilters .color-swatch').forEach(b => b.classList.toggle('is-active', b.dataset.color === 'all'));
      if (priceRange) priceRange.value = 15000;
      if (priceLabel) priceLabel.textContent = `Up to ${H.inr(15000)}`;
      updateHeader();
      render();
    });

    // Click outside to close sort dropdown
    document.addEventListener('click', () => {
      sortDropdown?.classList.remove('open');
    });

    render();
  });
})();
