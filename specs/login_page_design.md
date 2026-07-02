# Login / Account Page — Technical Design

## Scope
A themed login + signup page (`account.html`) for the Habäne static ecommerce site,
reachable from the nav profile menu, the legacy auth popup, and the mobile drawer.

## Constraint
The site is fully static (no server). Auth is therefore a **demo session**: the same
`localStorage` pattern already used for cart/wishlist (`js/store.js`). The form submit
handler in `js/account.js` is the single integration seam for a future real backend
(POST /auth/login, POST /auth/register).

## Frontend
- `account.html` — mirrors contact.html shell (nav, ribbon, drawer, cart/search overlays, footer).
- Split layout: left = navy duffel imagery + member perks (premium luggage feel),
  right = auth card with LOG IN / CREATE ACCOUNT tabs, social buttons, trust badges.
- Logged-in state renders a member dashboard (bag & wishlist counts, logout).
- `js/account.js` — tab switching (`?mode=signup` deep link), show/hide password,
  password strength meter, inline validation errors, session handoff.
- `styles.css` — new `ACCOUNT / AUTH PAGE` section using existing tokens
  (--navy, --ice, Conthrax/Montserrat, tech-cta buttons).

## Shared components (`js/components.js`)
- Profile dropdown becomes state-aware: logged out → Log In / Sign Up (links to page);
  logged in → greeting, My Account, Log Out.
- Legacy `.auth-pop` buttons route to `account.html` instead of dead-ending.
- Mobile drawer gains an Account link (profile icon is hidden ≤520px).

## Security
- Passwords are validated client-side but **never persisted** (no localStorage, no cookie).
- Only `{ name, email, since }` is stored for the demo session.
- All user-provided strings are HTML-escaped (`H.esc`) before being injected into
  the profile menu / dashboard (XSS).
- `?next=` post-login redirect is allowlisted to `^[a-z0-9-]+\.html$` (no open redirect).
- Real credential checks, rate limiting, and session tokens are explicitly out of scope
  until a backend exists; noted at the integration seam.
