// Pro slide (editorial split layout): media left, info + QR card right.
import { makeQrSvg, whatsappUrl, formatPhone } from './qr.js';

export function renderProSlide({ pro, n, total, globals = {} }) {
  const section = document.createElement('section');
  section.className = 'slide';
  const accent = pro.accentColor;
  if (accent) section.style.setProperty('--accent-hi', accent);

  const parts = (pro.name || '').split(' ');
  const firstName = parts[0] || '';

  const message = (pro.whatsapp?.messageOverride || globals.whatsappDefaultMessage || '').trim();
  const url = whatsappUrl(pro.whatsapp?.phone, message);
  const phoneFormatted = formatPhone(pro.whatsapp?.phone);

  const media = pro.media || {};
  const videoSrc = media.type === 'video' ? media.videoSrc : null;
  const posterSrc = media.posterSrc || media.photoSrc || '';
  const photoSrc = media.photoSrc || posterSrc;

  // Inline styles guarantee object-fit/positioning on older smart-TV browsers
  // that may ignore class-based CSS for the video element after metadata loads.
  const mediaStyle = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center center;';
  const mediaInner = videoSrc
    ? `<video src="${escAttr(videoSrc)}" poster="${escAttr(posterSrc)}" muted playsinline loop autoplay preload="auto" style="${mediaStyle}"></video>`
    : photoSrc
      ? `<img src="${escAttr(photoSrc)}" alt="${escAttr(pro.name || '')}" style="${mediaStyle}">`
      : `<div class="ph">Vídeo · ${esc(pro.specialtyShort || pro.specialty || '')}</div>`;

  const bullets = Array.isArray(pro.bullets) ? pro.bullets : [];
  const bulletsHtml = bullets.map(b => `<li>${esc(b)}</li>`).join('');

  section.innerHTML = `
    <div class="pro">
      <div class="media">
        ${mediaInner}
        <div class="vignette"></div>
        <div class="badge">
          <span class="badge-dot"></span>
          <b>Recomanat</b>
          <span class="badge-soft">· per atletes La Mola</span>
        </div>
        <div class="corner-id">REF · LM-${esc((pro.id || '').toUpperCase())}-26</div>
      </div>
      <div class="right">
        <div class="kicker" style="margin-bottom: 8px;">
          <span class="num">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
          <span>${esc(pro.specialtyShort || pro.specialty || '')}</span>
          <span class="rule"></span>
          <span>Coffee Corner</span>
        </div>
        <div class="pro-credit">
          <span class="credit-label">amb</span>
          <span class="credit-name">${esc(pro.name || '')}</span>
        </div>
        <h2 class="name">${renderSpecialtyMarkup(pro.specialty)}</h2>
        <ul class="bullets">${bulletsHtml}</ul>
        <div class="qr">
          <div class="qrbox" data-qr>
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div>
            <div class="cta-eyebrow">${esc(pro.ctaLabel || 'Escaneja i agenda visita')}</div>
            <div class="cta-headline">Reserva amb ${esc(firstName)}<br>per WhatsApp.</div>
            <div class="cta-phone">
              <span class="wa">W</span>
              <span class="num"><strong>${esc(phoneFormatted)}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject QR svg
  const qrSlot = section.querySelector('[data-qr]');
  if (qrSlot) qrSlot.appendChild(makeQrSvg(url, { size: 220, ecLevel: 'M' }));

  // Video fail-safe → swap to photo
  const video = section.querySelector('video');
  if (video) {
    const swap = () => {
      if (!photoSrc) return;
      const img = document.createElement('img');
      img.src = photoSrc; img.alt = pro.name || '';
      video.replaceWith(img);
    };
    let stalledTimer = null;
    video.addEventListener('error', swap);
    video.addEventListener('stalled', () => {
      clearTimeout(stalledTimer);
      stalledTimer = setTimeout(swap, 3000);
    });
    video.addEventListener('playing', () => clearTimeout(stalledTimer));
  }

  return section;
}

function renderSpecialtyMarkup(spec) {
  return esc(spec || '');
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function escAttr(s) { return esc(s); }
