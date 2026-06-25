/* HABÄNE — shop page */

(function () {
  const H = window.HABANE;
  let currentFilter = 'all';
  let currentSort = 'featured';
  let priceMin = 0;
  let priceMax = 20000;
  let searchQ = '';
  let layout = 'grid';

  function visibleProducts() {
    let list = [...H.PRODUCTS];
    if (currentFilter !== 'all') list = list.filter(p => p.cat === currentFilter);
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);
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

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();
    const params = new URLSearchParams(location.search);
    if (params.get('cat')) {
      currentFilter = params.get('cat');
      document.querySelectorAll('#shopFilters .pill').forEach(p => {
        p.classList.toggle('is-active', p.dataset.filter === currentFilter);
      });
    }
    const grid = document.getElementById('shopGrid');
    H.bindGrid(grid);

    document.getElementById('shopFilters')?.addEventListener('click', e => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      document.querySelectorAll('#shopFilters .pill').forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentFilter = btn.dataset.filter;
      render();
    });

    document.getElementById('shopSort')?.addEventListener('change', e => {
      currentSort = e.target.value;
      render();
    });

    document.getElementById('shopSearch')?.addEventListener('input', e => {
      searchQ = e.target.value;
      render();
    });

    const priceRange = document.getElementById('priceRange');
    const priceLabel = document.getElementById('priceLabel');
    priceRange?.addEventListener('input', e => {
      priceMax = Number(e.target.value);
      if (priceLabel) priceLabel.textContent = `Up to ${H.inr(priceMax)}`;
      render();
    });

    document.querySelectorAll('[data-layout]').forEach(btn => {
      btn.addEventListener('click', () => {
        layout = btn.dataset.layout;
        document.querySelectorAll('[data-layout]').forEach(b => b.classList.toggle('is-active', b.dataset.layout === layout));
        render();
      });
    });

    render();
  });
})();
