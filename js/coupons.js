/**
 * coupons.js — Coupon/promotion loader and clipboard copy
 */
const CouponManager = (() => {
  const DEFAULT_CONFIG = {
    jsonPath: 'data/coupons.json',
    containerId: 'couponList',
  };

  let config = { ...DEFAULT_CONFIG };

  async function fetchCoupons() {
    const res = await fetch(config.jsonPath);
    if (!res.ok) throw new Error(`Failed to load ${config.jsonPath}`);
    return (await res.json()).filter(c => c.active);
  }

  function render(coupons) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    if (coupons.length === 0) {
      container.innerHTML = `<p class="feed-empty">${t('coupons.empty')}</p>`;
      return;
    }

    container.innerHTML = coupons.map(coupon => `
      <div class="coupon-card">
        <div class="coupon-card__left">
          <span class="coupon-card__discount">${coupon.discount}</span>
          <span class="coupon-card__title">${localizeField(coupon, 'title')}</span>
        </div>
        <div class="coupon-card__right">
          <p class="coupon-card__desc">${localizeField(coupon, 'description')}</p>
          <button class="coupon-card__copy" data-code="${coupon.code}">
            <span class="coupon-card__code">${coupon.code}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.coupon-card__copy').forEach(btn => {
      btn.addEventListener('click', () => copyCode(btn));
    });
  }

  async function copyCode(btn) {
    const code = btn.dataset.code;
    try {
      await navigator.clipboard.writeText(code);
      btn.classList.add('copied');
      const codeEl = btn.querySelector('.coupon-card__code');
      const original = codeEl.textContent;
      codeEl.textContent = t('coupons.copied');
      setTimeout(() => {
        btn.classList.remove('copied');
        codeEl.textContent = original;
      }, 1500);
    } catch {
      // Fallback: select text
      const range = document.createRange();
      range.selectNodeContents(btn.querySelector('.coupon-card__code'));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  async function init(options = {}) {
    config = { ...DEFAULT_CONFIG, ...options };
    try {
      const coupons = await fetchCoupons();
      render(coupons);
    } catch (err) {
      console.warn('Coupon load failed:', err.message);
    }
  }

  return { init };
})();
