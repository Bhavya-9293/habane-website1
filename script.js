/* ============================================================
   HABÄNE — ecommerce front-end
   cart · quick-view · search · sort · wishlist (localStorage)
   ============================================================ */

const FREE_SHIP = 4999;

const PRODUCTS = [
  { id:'p1', name:'Skyline Duffel', cat:'duffel', catLabel:'Duffel', price:6499, was:7999,
    img:'assets/products/p1-olive-skyline-duffel.jpg', img2:'assets/products/alt-white-duffel.jpg', badge:'BESTSELLER', stars:5, new:false,
    colors:[{name:'Olive',hex:'#5a6b3f'},{name:'Midnight',hex:'#0b1240'},{name:'Silver',hex:'#9a9ea8'}],
    sizes:['35L','45L','55L'],
    desc:'Our hero carry. Hand-drawn skyline print on water-repellent canvas, leather-trim handles and a vault-grade zipper. Made for the people who never really unpack.' },

  { id:'p2', name:'Metropolitan Duffel', cat:'duffel', catLabel:'Duffel', price:6999, was:null,
    img:'assets/products/p2-navy-metropolitan-duffel.jpg', img2:'assets/products/alt-steel-duffel.jpg', badge:'NEW', stars:5, new:true,
    colors:[{name:'Navy',hex:'#0b1240'},{name:'Ice',hex:'#bfe8f5'}],
    sizes:['40L','50L'],
    desc:'Midnight navy with an ice-blue cityscape and contrast webbing handles. Cabin-friendly, shoulder-strap included, and roomy enough for a long weekend.' },

  { id:'p3', name:'Voyager Duffel', cat:'duffel', catLabel:'Duffel', price:6799, was:null,
    img:'assets/products/p3-navy-voyager-duffel.jpg', img2:'assets/products/p2-navy-metropolitan-duffel.jpg', badge:null, stars:4, new:true,
    colors:[{name:'Navy',hex:'#0b1240'},{name:'Sky',hex:'#8fd4ec'}],
    sizes:['40L','50L'],
    desc:'A nautical line-art print across deep navy canvas. The travel duffel that looks as good in the overhead bin as it does on the boat deck.' },

  { id:'p4', name:'SMART Duffel — Ivory', cat:'smart', catLabel:'Smart Series', price:12999, was:14999,
    img:'assets/products/p4-smart-duffel-ivory.jpg', img2:'assets/products/alt-white-duffel.jpg', badge:'SMART', stars:5, new:true,
    colors:[{name:'Ivory',hex:'#f6f7f9'},{name:'Navy',hex:'#0b1240'}],
    sizes:['45L'],
    desc:'The bag that thinks. 10,000mAh fast-charge core, reactive RGB trim, a touch media strip and a smart check-in panel for phone · watch · buds. Tech canvas, water-repellent.' },

  { id:'p5', name:'Steel Weekender', cat:'duffel', catLabel:'Duffel', price:5999, was:null,
    img:'assets/products/p5-steel-blue-weekender.jpg', img2:'assets/products/alt-steel-duffel.jpg', badge:null, stars:4, new:false,
    colors:[{name:'Steel Blue',hex:'#4a6b8a'},{name:'Tan',hex:'#8e6b4a'}],
    sizes:['38L','48L'],
    desc:'Vintage-washed canvas with full-grain leather handles and an antique-brass crossbody strap. Breaks in beautifully, lasts forever.' },

  { id:'p6', name:'Midnight Rolltop', cat:'backpack', catLabel:'Backpack', price:5499, was:6499,
    img:'assets/products/p6-midnight-rolltop.jpg', img2:'assets/products/alt-black-backpack.jpg', badge:'SALE', stars:5, new:false,
    colors:[{name:'Midnight',hex:'#0b1240'},{name:'Charcoal',hex:'#14163a'}],
    sizes:['18L','24L'],
    desc:'A roll-top commuter with a padded 16" laptop sleeve, magnetic buckle and hidden anti-theft zip. Expands when the day demands more.' },

  { id:'p7', name:'Heritage Backpack', cat:'backpack', catLabel:'Backpack', price:6299, was:null,
    img:'assets/products/p7-heritage-backpack.jpg', img2:'assets/products/alt-black-backpack-art.jpg', badge:null, stars:4, new:false,
    colors:[{name:'Olive',hex:'#5a6b3f'},{name:'Tan',hex:'#8e6b4a'}],
    sizes:['20L','28L'],
    desc:'Waxed canvas, dual cargo pockets and leather buckle straps. Built like luggage from another era, sized for your everyday now.' },

  { id:'p8', name:'City Sling', cat:'sling', catLabel:'Sling', price:3499, was:4299,
    img:'assets/products/p8-grey-sling.jpg', img2:'assets/products/alt-black-crossbody.jpg', badge:'SALE', stars:4, new:false,
    colors:[{name:'Grey',hex:'#7d818c'},{name:'Navy',hex:'#0b1240'}],
    sizes:['One Size'],
    desc:'Compact crossbody for the essentials run — phone, wallet, keys, charger. Canvas body, leather flap, antique-brass hardware.' },

  /* ---- sample additions ---- */
  { id:'p9', name:'Aero Gym Duffel', cat:'duffel', catLabel:'Duffel', price:4999, was:5999,
    img:'assets/products/p1-olive-skyline-duffel.jpg', img2:'assets/products/alt-white-duffel.jpg', badge:'SALE', stars:4, new:true,
    colors:[{name:'Olive',hex:'#5a6b3f'},{name:'Black',hex:'#14163a'}],
    sizes:['30L','40L'],
    desc:'Lightweight gym-to-office duffel with a ventilated shoe garage and wet pocket. Carries your fit and your sweat, separately.' },

  { id:'p10', name:'Transit Daypack', cat:'backpack', catLabel:'Backpack', price:4799, was:null,
    img:'assets/products/p6-midnight-rolltop.jpg', img2:'assets/products/alt-black-backpack.jpg', badge:'NEW', stars:5, new:true,
    colors:[{name:'Midnight',hex:'#0b1240'},{name:'Ice',hex:'#bfe8f5'}],
    sizes:['16L','22L'],
    desc:'Minimal everyday daypack with a quick-access top pocket, USB pass-through and a luggage pass-through strap for travel days.' },

  { id:'p11', name:'Voyager Smart Edition', cat:'smart', catLabel:'Smart Series', price:13999, was:null,
    img:'assets/products/p3-navy-voyager-duffel.jpg', img2:'assets/products/p2-navy-metropolitan-duffel.jpg', badge:'SMART', stars:5, new:true,
    colors:[{name:'Navy',hex:'#0b1240'},{name:'Sky',hex:'#8fd4ec'}],
    sizes:['45L'],
    desc:'The Voyager, upgraded. Integrated power bank, GPS tracker pocket and reactive trim lighting. For the traveller who likes a head start.' },

  { id:'p12', name:'Compact Sling Mini', cat:'sling', catLabel:'Sling', price:2799, was:3499,
    img:'assets/products/p8-grey-sling.jpg', img2:'assets/products/alt-black-crossbody-front.jpg', badge:'SALE', stars:4, new:false,
    colors:[{name:'Grey',hex:'#7d818c'},{name:'Tan',hex:'#8e6b4a'}],
    sizes:['One Size'],
    desc:'Even smaller. The going-out sling for nights when you only need the essentials and your phone on 2%.' },

  { id:'p13', name:'Metropolitan XL', cat:'duffel', catLabel:'Duffel', price:7999, was:null,
    img:'assets/products/p2-navy-metropolitan-duffel.jpg', img2:'assets/products/alt-steel-duffel.jpg', badge:null, stars:5, new:false,
    colors:[{name:'Navy',hex:'#0b1240'},{name:'Ice',hex:'#bfe8f5'}],
    sizes:['60L','70L'],
    desc:'The big-trip version of our Metropolitan. Two-week capacity, compression straps and a separate base compartment for shoes.' },

  { id:'p14', name:'Trailhead Backpack', cat:'backpack', catLabel:'Backpack', price:5899, was:null,
    img:'assets/products/p7-heritage-backpack.jpg', img2:'assets/products/alt-black-backpack-art.jpg', badge:null, stars:4, new:true,
    colors:[{name:'Olive',hex:'#5a6b3f'},{name:'Charcoal',hex:'#14163a'}],
    sizes:['24L','32L'],
    desc:'Weekend-trail ready: hydration sleeve, top-load main and weatherproof base. Equal parts city pack and weekend escape kit.' },
];

const byId = id => PRODUCTS.find(p => p.id === id);
const inr = n => '₹' + n.toLocaleString('en-IN');
const stars = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
const $ = s => document.querySelector(s);

// deterministic “urgency” so it stays consistent per product
function urgency(p){
  const n = parseInt(p.id.slice(1), 10);
  const lowStock = [1,4,6,8,12,14].includes(n);
  return { stock: lowStock ? 2 + (n % 4) : null, viewers: 7 + (n * 13 % 34) };
}

/* ============================================================
   STATE  (localStorage)
   ============================================================ */
let cart = load('habane_cart', []);          // [{key,id,color,size,qty}]
let wish = load('habane_wish', []);          // [id]
let promo = load('habane_promo', null);      // {code,type:'pct'|'ship',value}

function load(k, fb){ try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
function save(){
  localStorage.setItem('habane_cart', JSON.stringify(cart));
  localStorage.setItem('habane_wish', JSON.stringify(wish));
  localStorage.setItem('habane_promo', JSON.stringify(promo));
}
const discountValue = sub => (promo && promo.type==='pct' && promo.value>0 && sub>0) ? Math.round(sub*promo.value/100) : 0;

const cartQty = () => cart.reduce((s, i) => s + i.qty, 0);
const cartSubtotal = () => cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);

/* ============================================================
   PRODUCT GRID
   ============================================================ */
const grid = $('#grid');
let currentFilter = 'all';
let currentSort = 'featured';

function visibleProducts(){
  let list = currentFilter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.cat === currentFilter);
  switch (currentSort){
    case 'low':    list.sort((a,b)=>a.price-b.price); break;
    case 'high':   list.sort((a,b)=>b.price-a.price); break;
    case 'rating': list.sort((a,b)=>b.stars-a.stars); break;
    case 'new':    list.sort((a,b)=>(b.new?1:0)-(a.new?1:0)); break;
  }
  return list;
}

function cardHTML(p){
  const badge = p.badge ? `<span class="card__badge ${p.badge==='SMART'?'card__badge--smart':''}">${p.badge}</span>` : '';
  const was = p.was ? `<s>${inr(p.was)}</s>` : '';
  const liked = wish.includes(p.id);
  const sw = p.colors.map(c=>`<span class="sw" title="${c.name}" style="background:${c.hex}"></span>`).join('');
  const u = urgency(p);
  const back = p.img2 ? `<img class="card__img card__img--back" src="${p.img2}" alt="" loading="lazy" data-qv />` : '';
  return `
  <article class="card ${p.img2?'has-alt':''}" data-cat="${p.cat}" data-id="${p.id}">
    <div class="card__media">
      ${badge}
      <button class="card__wish ${liked?'liked':''}" data-wish aria-label="Wishlist">${liked?'♥':'♡'}</button>
      <img class="card__img card__img--front" src="${p.img}" alt="${p.name}" loading="lazy" data-qv />
      ${back}
      <div class="card__quick">
        <button class="card__view" data-qv>QUICK VIEW</button>
        <button class="card__add" data-add>QUICK ADD · ${inr(p.price)}</button>
      </div>
    </div>
    <div class="card__body" data-qv>
      <span class="card__cat">${p.catLabel}</span>
      <h3 class="card__name">${p.name}</h3>
      <div class="card__row">
        <span class="card__price">${inr(p.price)} ${was}</span>
        <span class="card__stars">${stars(p.stars)}</span>
      </div>
      <div class="card__row"><div class="card__swatches">${sw}</div>
        ${u.stock ? `<span class="card__stock">🔥 Only ${u.stock} left</span>`
                  : `<span class="card__stock card__stock--view">👀 ${u.viewers} viewing</span>`}
      </div>
    </div>
  </article>`;
}

function renderGrid(){
  const list = visibleProducts();
  grid.innerHTML = list.map(cardHTML).join('');
  $('#resultCount').textContent = `${list.length} style${list.length!==1?'s':''}`;
  observeCards();
}

/* filters */
$('#filters').addEventListener('click', e=>{
  const btn = e.target.closest('.pill'); if(!btn) return;
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('is-active'));
  btn.classList.add('is-active');
  currentFilter = btn.dataset.filter;
  renderGrid();
});

/* sort */
$('#sortSelect').addEventListener('change', e=>{ currentSort = e.target.value; renderGrid(); });

/* grid clicks: quick view / add / wish */
grid.addEventListener('click', e=>{
  const card = e.target.closest('.card'); if(!card) return;
  const id = card.dataset.id;
  if(e.target.closest('[data-wish]')) return toggleWish(id, e.target.closest('[data-wish]'));
  if(e.target.closest('[data-add]'))  return addToCart(id, byId(id).colors[0].name, byId(id).sizes[0], 1);
  if(e.target.closest('[data-qv]'))   return openQuickView(id);
});

/* ============================================================
   WISHLIST
   ============================================================ */
function toggleWish(id, btn){
  const i = wish.indexOf(id);
  if(i>-1){ wish.splice(i,1); btn.classList.remove('liked'); btn.textContent='♡'; }
  else    { wish.push(id);   btn.classList.add('liked');    btn.textContent='♥'; toast('Saved to wishlist ♥'); }
  save();
}

/* ============================================================
   QUICK VIEW
   ============================================================ */
const qv = $('#quickView');
let qvState = { id:null, color:null, size:null, qty:1 };

function openQuickView(id){
  const p = byId(id);
  qvState = { id, color:p.colors[0].name, size:p.sizes[0], qty:1 };
  $('#qvImg').src = p.img; $('#qvImg').alt = p.name;
  $('#qvCat').textContent = p.catLabel;
  $('#qvName').textContent = p.name;
  $('#qvRate').innerHTML = `<span class="qv__stars">${stars(p.stars)}</span> <span class="qv__rcount">(${40+p.stars*7} reviews)</span>`;
  $('#qvPrice').innerHTML = `${inr(p.price)} ${p.was?`<s>${inr(p.was)}</s> <em class="qv__off">${Math.round((1-p.price/p.was)*100)}% off</em>`:''}`;
  const u = urgency(p);
  $('#qvDesc').innerHTML = `<span class="qv__urgency">${u.stock?`🔥 Only ${u.stock} left — selling fast`:`👀 ${u.viewers} people are viewing this right now`}</span>${p.desc}`;
  $('#qvBadge').textContent = p.badge || '';
  $('#qvBadge').style.display = p.badge ? 'inline-block' : 'none';

  $('#qvColors').innerHTML = p.colors.map((c,i)=>
    `<button class="qv__color ${i===0?'on':''}" data-color="${c.name}" title="${c.name}" style="--c:${c.hex}"></button>`).join('');
  $('#qvColorName').textContent = p.colors[0].name;
  $('#qvSizes').innerHTML = p.sizes.map((s,i)=>
    `<button class="qv__size ${i===0?'on':''}" data-size="${s}">${s}</button>`).join('');
  $('#qvQty').textContent = '1';

  openModal(qv);
}

qv.addEventListener('click', e=>{
  if(e.target.closest('[data-close]')) return closeModal(qv);
  const col = e.target.closest('[data-color]');
  const siz = e.target.closest('[data-size]');
  const step = e.target.closest('[data-step]');
  if(col){
    qvState.color = col.dataset.color;
    qv.querySelectorAll('.qv__color').forEach(b=>b.classList.remove('on')); col.classList.add('on');
    $('#qvColorName').textContent = col.dataset.color;
  }
  if(siz){
    qvState.size = siz.dataset.size;
    qv.querySelectorAll('.qv__size').forEach(b=>b.classList.remove('on')); siz.classList.add('on');
  }
  if(step){
    qvState.qty = Math.max(1, qvState.qty + Number(step.dataset.step));
    $('#qvQty').textContent = qvState.qty;
  }
});
$('#qvAdd').addEventListener('click', ()=>{
  addToCart(qvState.id, qvState.color, qvState.size, qvState.qty);
  closeModal(qv);
});

/* ============================================================
   CART
   ============================================================ */
const cartEl = $('#cart');

function addToCart(id, color, size, qty){
  const key = `${id}|${color}|${size}`;
  const found = cart.find(i=>i.key===key);
  if(found) found.qty += qty; else cart.push({ key, id, color, size, qty });
  save(); syncCart();
  const p = byId(id);
  toast(`Added “${p.name}” ✦`);
  bumpCart();
  openCart();
}

function changeQty(key, d){
  const it = cart.find(i=>i.key===key); if(!it) return;
  it.qty += d;
  if(it.qty<=0) cart = cart.filter(i=>i.key!==key);
  save(); syncCart();
}
function removeItem(key){ cart = cart.filter(i=>i.key!==key); save(); syncCart(); }

function lineHTML(i){
  const p = byId(i.id);
  return `
  <div class="line" data-key="${i.key}">
    <div class="line__img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="line__info">
      <h4>${p.name}</h4>
      <span class="line__meta">${i.color} · ${i.size}</span>
      <div class="line__bottom">
        <div class="line__qty">
          <button data-dec aria-label="Decrease">−</button>
          <span>${i.qty}</span>
          <button data-inc aria-label="Increase">+</button>
        </div>
        <span class="line__price">${inr(p.price*i.qty)}</span>
      </div>
    </div>
    <button class="line__rm" data-rm aria-label="Remove">✕</button>
  </div>`;
}

function syncCart(){
  const qty = cartQty();
  $('#cartCount').textContent = qty;
  document.querySelector('.drawer-cart-count').textContent = qty;
  $('#cartItems').textContent = `(${qty})`;

  const body = $('#cartBody');
  const empty = $('#cartEmpty');
  const foot = $('#cartFoot');
  const ship = cartEl.querySelector('.cart__ship');

  if(cart.length===0){
    body.innerHTML=''; empty.style.display='flex';
    foot.style.display='none'; ship.style.display='none';
  } else {
    empty.style.display='none'; foot.style.display='block'; ship.style.display='block';
    body.innerHTML = cart.map(lineHTML).join('');
    const sub = cartSubtotal();
    $('#cartSubtotal').textContent = inr(sub);

    // promo / discount
    const disc = discountValue(sub);
    const promoBox = $('#cartPromo'), discRow = $('#cartDiscRow'), totalRow = $('#cartTotalRow');
    if(promo){
      promoBox.hidden = false; $('#cartPromoChip').textContent = promo.code;
    } else { promoBox.hidden = true; }
    if(disc > 0){
      discRow.hidden = false; $('#cartDisc').textContent = '−' + inr(disc);
      totalRow.hidden = false; $('#cartTotal').textContent = inr(sub - disc);
    } else { discRow.hidden = true; totalRow.hidden = true; }

    const pct = Math.min(100, Math.round(sub/FREE_SHIP*100));
    $('#shipBar').style.width = pct + '%';
    $('#shipMsg').innerHTML = sub>=FREE_SHIP
      ? `You unlocked <strong>free shipping</strong> 🎉`
      : `Add <strong>${inr(FREE_SHIP-sub)}</strong> more for <strong>free shipping</strong> ✦`;
  }
}

$('#cartBody').addEventListener('click', e=>{
  const line = e.target.closest('.line'); if(!line) return;
  const key = line.dataset.key;
  if(e.target.closest('[data-inc]')) changeQty(key, 1);
  if(e.target.closest('[data-dec]')) changeQty(key, -1);
  if(e.target.closest('[data-rm]'))  removeItem(key);
});

function openCart(){ openModal(cartEl); }
$('#cartBtn').addEventListener('click', openCart);
$('#drawerCartLink').addEventListener('click', e=>{ e.preventDefault(); closeDrawer(); openCart(); });
cartEl.addEventListener('click', e=>{ if(e.target.closest('[data-cart-close]')) closeModal(cartEl); });

/* checkout */
$('#checkoutBtn').addEventListener('click', ()=>{
  if(cart.length===0) return;
  const order = 'HB-' + Math.random().toString(36).slice(2,8).toUpperCase();
  const sub = cartSubtotal(); const disc = discountValue(sub); const total = sub - disc;
  $('#doneOrder').textContent = order;
  $('#doneMsg').textContent = `${cartQty()} item${cartQty()!==1?'s':''} · ${inr(total)}${disc?` (you saved ${inr(disc)} 💅)`:''}. Your bags are on the way — we'll slide into your inbox with tracking.`;
  cart = []; promo = null; save(); syncCart(); updateFab();
  closeModal(cartEl);
  openModal($('#checkoutDone'));
});
$('#checkoutDone').addEventListener('click', e=>{ if(e.target.closest('[data-done-close]')) closeModal($('#checkoutDone')); });

/* ============================================================
   SEARCH
   ============================================================ */
const searchPop = $('#searchPop');
$('#searchBtn').addEventListener('click', ()=>{ openModal(searchPop); setTimeout(()=>$('#searchInput').focus(),60); runSearch(''); });
$('#searchClose').addEventListener('click', ()=>closeModal(searchPop));
searchPop.addEventListener('click', e=>{ if(e.target===searchPop) closeModal(searchPop); });
$('#searchInput').addEventListener('input', e=>runSearch(e.target.value));

function runSearch(q){
  q = q.trim().toLowerCase();
  const list = !q ? PRODUCTS.slice(0,4)
    : PRODUCTS.filter(p=>(p.name+' '+p.catLabel+' '+p.desc).toLowerCase().includes(q));
  const res = $('#searchResults');
  if(list.length===0){ res.innerHTML = `<p class="search-pop__none">No matches for “${q}”. Try ‘duffel’ or ‘smart’.</p>`; return; }
  res.innerHTML = (q?'':'<p class="search-pop__hint">Popular right now</p>') + list.map(p=>`
    <button class="search-row" data-id="${p.id}">
      <img src="${p.img}" alt="">
      <span><strong>${p.name}</strong><em>${p.catLabel} · ${inr(p.price)}</em></span>
      <i>↗</i>
    </button>`).join('');
}
$('#searchResults').addEventListener('click', e=>{
  const row = e.target.closest('.search-row'); if(!row) return;
  closeModal(searchPop); openQuickView(row.dataset.id);
});

/* ============================================================
   MODAL HELPERS (lock scroll, ESC)
   ============================================================ */
function openModal(el){ el.classList.add('open'); el.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); }
function closeModal(el){
  el.classList.remove('open'); el.setAttribute('aria-hidden','true');
  if(!document.querySelector('.qv.open,.cart.open,.search-pop.open,.done.open,.wheel.open')) document.body.classList.remove('no-scroll');
}
addEventListener('keydown', e=>{
  if(e.key==='Escape') document.querySelectorAll('.qv.open,.cart.open,.search-pop.open,.done.open,.wheel.open').forEach(closeModal);
});

/* ============================================================
   MISC: cart bump, toast, reveal, nav, drawer, newsletter
   ============================================================ */
function bumpCart(){
  $('#cartCount').animate(
    [{transform:'scale(1)'},{transform:'scale(1.6)'},{transform:'scale(1)'}],
    {duration:380, easing:'cubic-bezier(.22,1,.36,1)'}
  );
}

const toastEl = $('#toast'); let toastT;
function toast(msg){
  toastEl.textContent = msg; toastEl.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(()=>toastEl.classList.remove('show'), 2400);
}

let io;
function observeCards(){
  if(io) io.disconnect();
  io = new IntersectionObserver(ents=>{
    ents.forEach((en,i)=>{ if(en.isIntersecting){ setTimeout(()=>en.target.classList.add('in'), i*60); io.unobserve(en.target); } });
  },{threshold:.12});
  document.querySelectorAll('.card').forEach(c=>io.observe(c));
}

const nav = $('#nav');
addEventListener('scroll', ()=>nav.classList.toggle('shrink', scrollY>40));

const burger = $('#burger'), drawer = $('#drawer');
function closeDrawer(){ burger.classList.remove('open'); drawer.classList.remove('open'); }
burger.addEventListener('click', ()=>{ burger.classList.toggle('open'); drawer.classList.toggle('open'); });
drawer.querySelectorAll('a:not(#drawerCartLink)').forEach(a=>a.addEventListener('click', closeDrawer));

const newsForm = $('#newsForm');
newsForm.addEventListener('submit', e=>{
  e.preventDefault();
  $('#newsDone').textContent = "You're in. Welcome to the chaos ✦";
  newsForm.reset(); toast('Subscribed — see you in your inbox 💌');
});

$('#yr').textContent = new Date().getFullYear();

/* ============================================================
   SPIN TO WIN — discount wheel
   ============================================================ */
(function spinToWin(){
  const wheel = $('#wheel'), disc = $('#wheelDisc'), fab = $('#spinFab');
  if(!wheel) return;

  // segment order must match the DOM order in #wheelDisc
  const REWARDS = [
    { label:'10% OFF',  code:'HABÄNE10', type:'pct',  value:10 },
    { label:'FREE SHIP',code:'FREESHIP', type:'ship', value:0  },
    { label:'5% OFF',   code:'HABÄNE5',  type:'pct',  value:5  },
    { label:'15% OFF',  code:'HABÄNE15', type:'pct',  value:15 },
    { label:'TRY AGAIN',code:null,       type:'none', value:0  },
    { label:'20% OFF',  code:'HABÄNE20', type:'pct',  value:20 },
  ];
  // weighted winners (rigged for conversion — never lands on TRY AGAIN)
  const WEIGHTS = [ [0,38],[3,30],[2,14],[5,10],[1,8] ];
  function pickWinner(){
    const total = WEIGHTS.reduce((s,w)=>s+w[1],0);
    let r = Math.random()*total;
    for(const [seg,w] of WEIGHTS){ if((r-=w) <= 0) return seg; }
    return 0;
  }

  let spun = false;
  function openWheel(){ if(promo) return; openModal(wheel); }
  function close(){ closeModal(wheel); }
  wheel.addEventListener('click', e=>{ if(e.target.closest('[data-wheel-close]')) close(); });

  $('#wheelForm').addEventListener('submit', e=>{
    e.preventDefault();
    if(spun) return;
    spun = true;
    const seg = pickWinner();
    const turns = 5;                     // full spins for drama
    const target = turns*360 + (360 - (seg*60 + 30));  // center segment under the top pointer
    disc.style.transition = 'transform 4.4s cubic-bezier(.15,.9,.25,1)';
    disc.style.transform = `rotate(${target}deg)`;
    $('#wheelSpin').disabled = true; $('#wheelSpin').textContent = 'spinning…';

    setTimeout(()=>{
      const reward = REWARDS[seg];
      if(reward.type !== 'none'){
        promo = { code:reward.code, type:reward.type, value:reward.value };
        save(); syncCart(); updateFab();
      }
      const msg = reward.type==='pct' ? `YESSS — <strong>${reward.value}% OFF</strong> unlocked. Code <strong>${reward.code}</strong> auto-applies at checkout. 💅`
                : reward.type==='ship' ? `<strong>FREE SHIPPING</strong> unlocked, code <strong>${reward.code}</strong> is in your cart. 🚚`
                : `so close 😭 try again later.`;
      $('#wheelResult').innerHTML = msg;
      toast(reward.type!=='none' ? `Discount unlocked — ${reward.label} ✦` : 'almost! 😭');
      setTimeout(close, 2600);
    }, 4500);
  });

  // floating button + auto-open
  fab.addEventListener('click', openWheel);
  window.updateFab = function(){ fab.style.display = promo ? 'none' : 'flex'; };
  updateFab();
  if(!promo && !sessionStorage.getItem('wheelSeen')){
    sessionStorage.setItem('wheelSeen','1');
    setTimeout(openWheel, 6500);
  }
})();

/* ============================================================
   FAQ — single-open accordion
   ============================================================ */
$('#faqList')?.addEventListener('click', e=>{
  const s = e.target.closest('summary'); if(!s) return;
  const cur = s.parentElement;
  document.querySelectorAll('#faqList .faq__item[open]').forEach(d=>{ if(d!==cur) d.open=false; });
});

/* ============================================================
   3D SHOWROOM (model-viewer)
   ============================================================ */
(function init3D(){
  const viewer = $('#viewer');
  const models = window.HABANE_MODELS;
  if(!viewer || !models) return;

  // load default model (data URI avoids file:// fetch issues)
  viewer.src = models.carryon;

  // switch models
  $('#modelPick').addEventListener('click', e=>{
    const btn = e.target.closest('.model-pick'); if(!btn) return;
    const key = btn.dataset.model;
    if(!models[key]) return;
    document.querySelectorAll('.model-pick').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    viewer.src = models[key];
    viewer.cameraOrbit = '35deg 75deg 110%';
    toast(`Now viewing — ${btn.querySelector('.model-pick__name').textContent} ✦`);
  });

  // auto-spin toggle
  const spinBtn = $('#spinToggle');
  spinBtn.addEventListener('click', ()=>{
    const on = viewer.hasAttribute('auto-rotate');
    if(on) viewer.removeAttribute('auto-rotate'); else viewer.setAttribute('auto-rotate','');
    spinBtn.classList.toggle('is-active', !on);
  });

  // reset camera
  $('#resetView').addEventListener('click', ()=>{
    viewer.cameraOrbit = '35deg 75deg 110%';
    viewer.fieldOfView = 'auto';
    viewer.jumpCameraToGoal && viewer.jumpCameraToGoal();
  });
})();

/* boot */
renderGrid();
syncCart();
