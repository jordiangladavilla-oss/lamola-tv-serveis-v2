// Merch slide: collection display + numbered products list with color swatches.

export function renderMerchSlide({ merch = {}, globals = {} }) {
  const section = document.createElement('section');
  section.className = 'slide';

  const collectionName = merch.collectionName || 'Summer 2026';
  const headline = merch.headline || 'Nova col·lecció';
  const subline = merch.subline || 'Build strength together.';
  const tagline = merch.tagline || globals.tagline || 'LIFT. BREATHE. REPEAT.';
  const price = merch.price || '27€';
  const priceLabel = merch.priceLabel || 'Tots els models';
  const ctaLabel = merch.ctaLabel || 'Pregunta a recepció';
  const products = Array.isArray(merch.products) ? merch.products : [];

  const productsHtml = products.map((p, i) => {
    const swatches = (p.swatches || []).slice(0, 4).map((c, j) => `<i style="background:${escAttr(c)}" title="${escAttr(p.colors?.[j] || '')}"></i>`).join('');
    const colors = (p.colors || []).slice(0, 3).join(' · ');
    return `
      <div class="product">
        <div class="n">${String(i + 1).padStart(2, '0')}</div>
        <div>
          <div class="nm">${esc(p.name || '')}</div>
          <div class="tg">${esc(p.tagline || '')} · ${esc(colors)}</div>
        </div>
        <div class="sw">${swatches}</div>
      </div>
    `;
  }).join('');

  section.innerHTML = `
    <div class="kicker">
      <span class="num">↳</span>
      <span>Nova col·lecció · ${esc(collectionName)}</span>
      <span class="rule"></span>
      <span>${esc(tagline)}</span>
    </div>

    <div class="merch">
      <div class="head">
        <div class="eyebrow">Merchandise</div>
        <h2 class="h-display">${esc(headline)}.<br><em>${esc(collectionName)}.</em></h2>
        <div class="sub">${esc(subline)}</div>
        <div class="meta">
          <div class="price">${esc(price)}</div>
          <div>
            <div class="priceLabel">${esc(priceLabel)}</div>
            <div class="ctaLabel">${esc(ctaLabel)}</div>
          </div>
        </div>
      </div>
      <div class="products">${productsHtml}</div>
    </div>
  `;
  return section;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function escAttr(s) { return esc(s); }
