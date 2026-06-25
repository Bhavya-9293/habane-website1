# HABÄNE Website

Premium smart travel bag e-commerce site (static HTML/CSS/JS).

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero with 3D coin, 3 featured products, Smart Series split, 3D showroom, FAQ carousel |
| Shop | `shop.html` | Full catalog with filters, sort, search, grid/list views |
| Product | `product.html?id=p1` | Product detail with specs, smart features, cart actions |
| Smart Series | `smart-series.html` | Feature cards for all smart capabilities |
| Checkout | `checkout.html` | Checkout UI (demo — no real payments) |

## Scripts

- `js/data.js` — Products, FAQ, countries, smart features
- `js/store.js` — Cart, wishlist, location (localStorage)
- `js/components.js` — Nav, cart drawer, search, location selector, shared UI
- `js/coin-3d.js` — Hero 3D coin animation (GSAP)
- `js/home.js` / `shop.js` / `product.js` / `smart-series.js` / `checkout.js` — Page logic

## Run locally

```bash
cd habane-website
python -m http.server 8080
```

Open `http://localhost:8080`

> Use a local server (not `file://`) so 3D models and CDN scripts load correctly.

## Legacy

`script.js` is the previous monolithic bundle — superseded by the `js/` modules.
