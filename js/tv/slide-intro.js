// Intro slide: editorial display + 2x2 tiles of professionals.

export function renderIntroSlide({ intro = {}, pros = [], globals = {} }) {
  const section = document.createElement('section');
  section.className = 'slide';

  const headline = intro.headline || 'Els nostres';
  const headlineAccent = intro.headlineAccent || 'serveis';
  const subline = intro.subline || 'Coneix els professionals del box i agenda visita.';
  const coachLine = intro.coachLine || 'BUILD STRENGTH TOGETHER';
  const coords = globals.coords || '41°38\'28"N 2°01\'04"E';
  const tagline = globals.tagline || 'LIFT. BREATHE. REPEAT.';

  const tilesHtml = pros.slice(0, 4).map((p, i) => {
    const photo = p.media?.photoSrc || p.media?.posterSrc || '';
    return `
      <div class="tile">
        ${photo ? `<img class="tile-photo" src="${esc(photo)}" alt="" onerror="this.remove()"><div class="tile-vignette"></div>` : '<div class="ph"></div>'}
        <div class="num">${String(i + 1).padStart(2, '0')}</div>
        <div class="meta">
          <div class="name">${esc(p.specialty || '')}</div>
          <div class="spec">amb ${esc(p.name || '')}</div>
        </div>
      </div>
    `;
  }).join('');

  section.innerHTML = `
    <div class="kicker">
      <span class="num">00</span>
      <span>Move with purpose</span>
      <span class="rule"></span>
      <span>Coffee Corner · Serveis</span>
    </div>

    <div class="intro">
      <div class="left">
        <div>
          <div class="eyebrow">${esc(headline)}</div>
          <h1 class="h-display">${esc(headline)}<br><em>${esc(headlineAccent)}.</em></h1>
          <p class="sub">${esc(subline)}</p>
          <div class="coachLine">${esc(coachLine)}</div>
        </div>
        <div class="foot-row">
          <div>
            <div class="label">Recepció</div>
            <div class="foot-val">${esc(coords)}</div>
          </div>
          <div style="text-align: right;">
            <div class="label">Tagline</div>
            <div class="foot-val" style="letter-spacing: 0.12em;">${esc(tagline)}</div>
          </div>
        </div>
      </div>
      <div class="right">${tilesHtml}</div>
    </div>
  `;
  return section;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
