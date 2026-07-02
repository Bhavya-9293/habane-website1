/* HABÄNE — account / auth page */

(function () {
  const H = window.HABANE;
  const $ = s => document.querySelector(s);
  const EMAIL_RE = /^\S+@\S+\.\S+$/;
  // ?next= must be a plain local page — never a full URL (open-redirect guard)
  const NEXT_RE = /^[a-z0-9-]+\.html$/;

  document.addEventListener('DOMContentLoaded', () => {
    H.initShared();

    const forms = $('#authForms');
    const dash = $('#authDash');
    const loginForm = $('#loginForm');
    const signupForm = $('#signupForm');
    const title = $('#authTitle');
    const sub = $('#authSub');
    const tabLogin = $('#tabLogin');
    const tabSignup = $('#tabSignup');
    const params = new URLSearchParams(location.search);

    /* ---- tabs ---- */
    function setMode(mode) {
      const signup = mode === 'signup';
      tabLogin.classList.toggle('is-active', !signup);
      tabSignup.classList.toggle('is-active', signup);
      tabLogin.setAttribute('aria-selected', !signup);
      tabSignup.setAttribute('aria-selected', signup);
      loginForm.hidden = signup;
      signupForm.hidden = !signup;
      title.textContent = signup ? 'JOIN THE CARRY' : 'WELCOME BACK';
      sub.textContent = signup
        ? 'One account — wishlist, faster checkout and first dibs on drops.'
        : 'Log in to your bag, wishlist and order history.';
      (signup ? signupForm : loginForm).querySelector('input')?.focus();
    }
    tabLogin.addEventListener('click', () => setMode('login'));
    tabSignup.addEventListener('click', () => setMode('signup'));

    /* ---- show / hide password ---- */
    document.querySelectorAll('[data-eye]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        btn.innerHTML = `<i data-lucide="${show ? 'eye-off' : 'eye'}"></i>`;
        H.refreshIcons(btn);
      });
    });

    /* ---- signup password strength ---- */
    const bar = $('#pwdBar');
    signupForm.password.addEventListener('input', () => {
      const v = signupForm.password.value;
      const score = (v.length >= 8) + /[A-Z]/.test(v) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v);
      bar.style.width = v ? `${Math.max(score, 1) * 25}%` : '0';
      bar.style.background = ['#8e2f3f', '#8e2f3f', '#c7a24b', '#8fd4ec', '#2e9e5b'][score];
    });

    /* ---- validation helpers ---- */
    function fail(el, input, msg) {
      el.textContent = msg;
      input.classList.add('is-invalid');
      input.focus();
      return false;
    }
    function clearErr(form, el) {
      el.textContent = '';
      form.querySelectorAll('.is-invalid').forEach(i => i.classList.remove('is-invalid'));
      return true;
    }

    /* ---- session handoff ----
       Demo session only: a real backend would be called here (POST /auth/login).
       The password is validated but never stored anywhere. */
    function afterAuth() {
      const next = params.get('next');
      if (next && NEXT_RE.test(next)) { location.href = next; return; }
      render();
      scrollTo({ top: 0, behavior: 'smooth' });
    }

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const err = $('#loginErr');
      clearErr(loginForm, err);
      const email = loginForm.email.value.trim();
      if (!EMAIL_RE.test(email)) return fail(err, loginForm.email, 'Enter a valid email address.');
      if (loginForm.password.value.length < 6) return fail(err, loginForm.password, 'Password must be at least 6 characters.');
      const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      H.setUser({ name, email, since: Date.now() });
      H.toast('Welcome back ✦');
      afterAuth();
    });

    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const err = $('#signupErr');
      clearErr(signupForm, err);
      const name = signupForm.name.value.trim();
      const email = signupForm.email.value.trim();
      if (name.length < 2) return fail(err, signupForm.name, 'Tell us your name.');
      if (!EMAIL_RE.test(email)) return fail(err, signupForm.email, 'Enter a valid email address.');
      if (signupForm.password.value.length < 8) return fail(err, signupForm.password, 'Password must be at least 8 characters.');
      H.setUser({ name, email, since: Date.now() });
      H.toast(`Welcome to Habäne, ${name.split(' ')[0]} ✦`);
      afterAuth();
    });

    $('#forgotBtn').addEventListener('click', () => {
      const email = loginForm.email.value.trim();
      if (!EMAIL_RE.test(email)) { fail($('#loginErr'), loginForm.email, 'Enter your email first — we\'ll send the reset link there.'); return; }
      H.toast(`Reset link sent to ${email}`);
    });

    document.querySelectorAll('[data-social]').forEach(btn => {
      btn.addEventListener('click', () => H.toast(`${btn.dataset.social} sign-in is coming soon`));
    });

    /* ---- logged-in dashboard ---- */
    function renderDash(u) {
      const esc = H.esc;
      const first = (u.name || 'Traveller').trim().split(/\s+/)[0];
      dash.innerHTML = `
        <div class="auth-dash__avatar">${esc(first.charAt(0).toUpperCase())}</div>
        <div class="auth-head">
          <h1>HEY, ${esc(first.toUpperCase())}</h1>
          <p>${esc(u.email)} · member since ${new Date(u.since).getFullYear()}</p>
        </div>
        <div class="auth-dash__stats">
          <div class="auth-dash__stat"><strong>${H.cartQty()}</strong><span>items in your bag</span></div>
          <div class="auth-dash__stat"><strong>${H.wishData.length}</strong><span>saved to wishlist</span></div>
        </div>
        <div class="auth-dash__actions">
          <a class="tech-cta" href="shop.html">CONTINUE SHOPPING</a>
          <button class="ghost-btn" type="button" id="logoutBtn">Log out <i>→</i></button>
        </div>
        <div class="auth-trust">
          <span><i data-lucide="truck"></i>FREE SHIPPING ₹4,999+</span>
          <span><i data-lucide="rotate-ccw"></i>7-DAY RETURNS</span>
          <span><i data-lucide="shield-check"></i>LIFETIME ZIPPER WARRANTY</span>
        </div>`;
      H.refreshIcons(dash);
      dash.querySelector('#logoutBtn').addEventListener('click', () => {
        H.logout();
        H.toast('Logged out — see you soon');
      });
    }

    function render() {
      const u = H.getUser();
      forms.hidden = !!u;
      dash.hidden = !u;
      if (u) renderDash(u);
    }

    H.events.addEventListener('user:update', render);
    H.events.addEventListener('cart:update', () => { if (H.getUser()) renderDash(H.getUser()); });

    setMode(params.get('mode') === 'signup' ? 'signup' : 'login');
    render();
  });
})();
