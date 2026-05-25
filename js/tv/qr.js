// QR SVG generator wrapping qrcode-generator (window.qrcode global).
// Returns an SVG element ready to drop into the DOM. Black on white for max camera contrast.

const CELL_SIZE = 6;
const MARGIN = 0;

export function makeQrSvg(text, { size = 220, ecLevel = 'M' } = {}) {
  if (typeof window.qrcode !== 'function') {
    console.error('[qr] qrcode-generator lib not loaded');
    return placeholderSvg(size);
  }
  let qr;
  try {
    qr = window.qrcode(0, ecLevel);
    qr.addData(text);
    qr.make();
  } catch (err) {
    console.error('[qr] encode failed', err);
    return placeholderSvg(size);
  }

  const count = qr.getModuleCount();
  const dim = (count + MARGIN * 2) * CELL_SIZE;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${dim} ${dim}`);
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Codi QR per agendar visita');

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', dim); bg.setAttribute('height', dim);
  bg.setAttribute('fill', '#ffffff');
  svg.appendChild(bg);

  let d = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        const x = (c + MARGIN) * CELL_SIZE;
        const y = (r + MARGIN) * CELL_SIZE;
        d += `M${x} ${y}h${CELL_SIZE}v${CELL_SIZE}h-${CELL_SIZE}z`;
      }
    }
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', '#100e0b');
  svg.appendChild(path);
  return svg;
}

function placeholderSvg(size) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('width', size); svg.setAttribute('height', size);
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('width', '100'); rect.setAttribute('height', '100');
  rect.setAttribute('fill', '#ffffff');
  svg.appendChild(rect);
  return svg;
}

export function whatsappUrl(phone, message) {
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(message || '');
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ''}`;
}

export function formatPhone(p) {
  if (!p) return '';
  const s = String(p).replace(/\D/g, '');
  if (s.startsWith('34') && s.length === 11) {
    return `+34 ${s.slice(2, 5)} ${s.slice(5, 8)} ${s.slice(8)}`;
  }
  return `+${s}`;
}
