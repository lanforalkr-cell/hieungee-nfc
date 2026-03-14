/**
 * products.js — Product grid with category filtering
 */
const ProductShop = (() => {
  const DEFAULT_CONFIG = {
    jsonPath: 'data/products.json',
    gridId: 'productGrid',
    filtersId: 'productFilters',
  };

  let config = { ...DEFAULT_CONFIG };
  let allProducts = [];

  async function fetchProducts() {
    const res = await fetch(config.jsonPath);
    if (!res.ok) throw new Error(`Failed to load ${config.jsonPath}`);
    return res.json();
  }

  function renderGrid(products) {
    const grid = document.getElementById(config.gridId);
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `<p class="feed-empty">${t('products.empty')}</p>`;
      return;
    }

    grid.innerHTML = products.map(p => {
      const name = localizeField(p, 'name');
      const nameKo = p.name_ko || p.name;
      return `
      <a href="${p.url}" target="_blank" rel="noopener" class="product-card" data-category="${p.category}">
        <div class="product-card__img">
          ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
          ${p.image
            ? `<img src="${p.image}" alt="${name}" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="product-card__placeholder" style="display:none">
                <span class="product-card__icon">${nameKo.charAt(0)}</span>
              </div>`
            : `<div class="product-card__placeholder">
                <span class="product-card__icon">${nameKo.charAt(0)}</span>
              </div>`
          }
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${name}</h3>
          <p class="product-card__name-kr">${nameKo}</p>
          <div class="product-card__bottom">
            <span class="product-card__price">$${p.price.toFixed(2)}</span>
            <span class="product-card__shop">${t('products.shopnow')}</span>
          </div>
        </div>
      </a>
    `;}).join('');
  }

  function setupFilters() {
    const filtersEl = document.getElementById(config.filtersId);
    if (!filtersEl) return;

    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const filtered = filter === 'All'
          ? allProducts
          : allProducts.filter(p => p.category === filter);
        renderGrid(filtered);
      });
    });
  }

  async function init(options = {}) {
    config = { ...DEFAULT_CONFIG, ...options };
    try {
      allProducts = await fetchProducts();
      renderGrid(allProducts);
      setupFilters();
    } catch (err) {
      console.warn('Product load failed:', err.message);
    }
  }

  return { init };
})();
