/* ==========================================================================
   LUMORA — script.js
   Vanilla JS powering: particle background, preloader, sticky nav,
   mobile menu, dark/light toggle, scroll reveal, ripple buttons,
   wishlist, cart badge + cart page logic, coupon code, quantity selectors.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ *
   * 1. PRELOADER
   * ------------------------------------------------------------------ */
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2200);

  /* ------------------------------------------------------------------ *
   * 2. FLOATING PARTICLE CANVAS
   * ------------------------------------------------------------------ */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const COLORS = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#a78bfa'];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    function createParticles() {
      const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.2
      }));
    }
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }
    resizeCanvas();
    createParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
  }

  /* ------------------------------------------------------------------ *
   * 3. STICKY NAVBAR SHADOW ON SCROLL
   * ------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 30;
    navbar && navbar.classList.toggle('scrolled', scrolled);
    backToTop && backToTop.classList.toggle('show', window.scrollY > 500);
  });

  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ *
   * 4. MOBILE MENU TOGGLE
   * ------------------------------------------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. DARK / LIGHT MODE TOGGLE  (persisted in-memory for the session)
   * ------------------------------------------------------------------ */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  function applyStoredTheme() {
    if (window.__lumoraTheme === 'light') document.body.classList.add('light-mode');
  }
  applyStoredTheme();
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      window.__lumoraTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    });
  });

  /* ------------------------------------------------------------------ *
   * 6. SCROLL REVEAL (IntersectionObserver)
   * ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ------------------------------------------------------------------ *
   * 7. BUTTON RIPPLE EFFECT
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.btn, .add-cart-btn, .icon-btn, .category-chip').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ------------------------------------------------------------------ *
   * 8. TOAST NOTIFICATIONS
   * ------------------------------------------------------------------ */
  let toastWrap = document.querySelector('.toast-wrap');
  if (!toastWrap) {
    toastWrap = document.createElement('div');
    toastWrap.className = 'toast-wrap';
    document.body.appendChild(toastWrap);
  }
  function showToast(message, icon = 'fa-circle-check') {
    const toast = document.createElement('div');
    toast.className = 'toast glass';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toastWrap.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 350);
    }, 2600);
  }
  window.lumoraToast = showToast;

  /* ------------------------------------------------------------------ *
   * 9. WISHLIST TOGGLE
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.classList.replace('fa-regular', 'fa-solid');
        showToast('Added to wishlist', 'fa-heart');
      } else {
        icon.classList.replace('fa-solid', 'fa-regular');
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * 10. CART BADGE (shared across pages via localStorage-free session var)
   * ------------------------------------------------------------------ */
  const cartBadge = document.querySelector('.cart-badge');
  let cartCount = window.__lumoraCartCount || (cartBadge ? parseInt(cartBadge.textContent, 10) || 0 : 0);

  function updateCartBadge() {
    window.__lumoraCartCount = cartCount;
    document.querySelectorAll('.cart-badge').forEach(b => b.textContent = cartCount);
  }
  updateCartBadge();

  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount++;
      updateCartBadge();
      showToast('Added to cart', 'fa-cart-shopping');
    });
  });

  /* ------------------------------------------------------------------ *
   * 11. QUANTITY SELECTORS (cart page)
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.qty-selector').forEach(sel => {
    const minus = sel.querySelector('.qty-minus');
    const plus = sel.querySelector('.qty-plus');
    const display = sel.querySelector('.qty-value');
    if (!minus || !plus || !display) return;

    minus.addEventListener('click', () => {
      let val = parseInt(display.textContent, 10);
      if (val > 1) {
        display.textContent = val - 1;
        recalcCartTotals();
      }
    });
    plus.addEventListener('click', () => {
      let val = parseInt(display.textContent, 10);
      display.textContent = val + 1;
      recalcCartTotals();
    });
  });

  /* ------------------------------------------------------------------ *
   * 12. REMOVE CART ITEM
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cart-item');
      if (!item) return;
      item.style.transition = 'opacity .35s ease, transform .35s ease';
      item.style.opacity = '0';
      item.style.transform = 'translateX(30px)';
      setTimeout(() => {
        item.remove();
        recalcCartTotals();
        showToast('Item removed from cart', 'fa-trash');
        checkEmptyCart();
      }, 350);
    });
  });

  /* ------------------------------------------------------------------ *
   * 13. CART TOTALS + COUPON LOGIC
   * ------------------------------------------------------------------ */
  const SHIPPING_FLAT = 6.99;
  const TAX_RATE = 0.08;
  let couponDiscount = 0;

  function recalcCartTotals() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    items.forEach(item => {
      const price = parseFloat(item.dataset.price || '0');
      const qty = parseInt(item.querySelector('.qty-value')?.textContent || '1', 10);
      subtotal += price * qty;
      const lineEl = item.querySelector('.cart-item-price');
      if (lineEl) lineEl.textContent = '$' + (price * qty).toFixed(2);
    });

    const shipping = items.length ? SHIPPING_FLAT : 0;
    const discountAmt = subtotal * couponDiscount;
    const taxable = subtotal - discountAmt;
    const tax = taxable > 0 ? taxable * TAX_RATE : 0;
    const grandTotal = Math.max(taxable + tax + shipping, 0);

    setText('.summary-subtotal', '$' + subtotal.toFixed(2));
    setText('.summary-shipping', shipping ? '$' + shipping.toFixed(2) : '$0.00');
    setText('.summary-tax', '$' + tax.toFixed(2));
    setText('.summary-total', '$' + grandTotal.toFixed(2));

    const discountRow = document.querySelector('.summary-row.discount');
    if (discountRow) {
      if (discountAmt > 0) {
        discountRow.style.display = 'flex';
        setText('.summary-discount', '-$' + discountAmt.toFixed(2));
      } else {
        discountRow.style.display = 'none';
      }
    }
  }
  function setText(sel, val) {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  }

  function checkEmptyCart() {
    const cartList = document.querySelector('.cart-list');
    const items = document.querySelectorAll('.cart-item');
    const emptyState = document.querySelector('.cart-empty');
    if (!cartList) return;
    if (items.length === 0 && emptyState) {
      emptyState.style.display = 'block';
    }
  }

  const couponBtn = document.querySelector('.coupon-row button');
  const couponInput = document.querySelector('.coupon-row input');
  const couponMsg = document.querySelector('.coupon-msg');
  if (couponBtn && couponInput) {
    couponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'LUMORA10') {
        couponDiscount = 0.10;
        couponMsg.textContent = 'Coupon applied — 10% off your order!';
        couponMsg.className = 'coupon-msg success';
        showToast('Coupon applied successfully', 'fa-tag');
      } else if (code === '') {
        couponMsg.textContent = 'Please enter a coupon code.';
        couponMsg.className = 'coupon-msg error';
      } else {
        couponDiscount = 0;
        couponMsg.textContent = 'Invalid or expired coupon code.';
        couponMsg.className = 'coupon-msg error';
      }
      recalcCartTotals();
    });
  }

  recalcCartTotals();
  checkEmptyCart();

  /* ------------------------------------------------------------------ *
   * 14. PRODUCTS PAGE — sort & view toggle (front-end only demo)
   * ------------------------------------------------------------------ */
  const viewToggleBtns = document.querySelectorAll('.view-toggle button');
  const productGrid = document.querySelector('.products-layout .product-grid');
  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (productGrid) {
        productGrid.classList.toggle('list-view', btn.dataset.view === 'list');
      }
    });
  });

  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(productGrid.querySelectorAll('.product-card'));
      const sorted = cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        if (sortSelect.value === 'low-high') return priceA - priceB;
        if (sortSelect.value === 'high-low') return priceB - priceA;
        return 0;
      });
      sorted.forEach(card => productGrid.appendChild(card));
      showToast('Products sorted', 'fa-arrow-down-wide-short');
    });
  }

  /* ------------------------------------------------------------------ *
   * 15. NEWSLETTER FORM
   * ------------------------------------------------------------------ */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        showToast('Thanks for subscribing!', 'fa-envelope-circle-check');
        input.value = '';
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 16. CATEGORY CHIP ACTIVE STATE
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ------------------------------------------------------------------ *
   * 17. COLOR SWATCH ACTIVE STATE (filters)
   * ------------------------------------------------------------------ */
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('active'));
  });

});
