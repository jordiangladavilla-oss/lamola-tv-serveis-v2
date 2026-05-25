// Pro-intro transition card.

export function renderProIntroSlide({ pro, n, total }) {
  const section = document.createElement('section');
  section.className = 'slide';
  const accent = pro.accentColor;
  if (accent) section.style.setProperty('--accent-hi', accent);

  section.innerHTML = `
    <div class="kicker">
      <span class="num">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
      <span>Acompanya el teu progrés</span>
      <span class="rule"></span>
      <span>La Mola · Serveis</span>
    </div>
    <div class="proIntro">
      <div class="stack">
        <div class="n">${String(n).padStart(2, '0')} · ELS NOSTRES SERVEIS</div>
        <div class="nm">${renderSpecialtyMarkup(pro.specialty)}</div>
        <div class="sp">amb ${esc(pro.name || '')}</div>
      </div>
    </div>
  `;
  return section;
}

function renderSpecialtyMarkup(spec) {
  if (!spec) return '';
  const parts = spec.trim().split(/\s+/);
  if (parts.length >= 2) {
    return esc(parts[0]) + ' <em>' + esc(parts.slice(1).join(' ')) + '</em>';
  }
  // Compound single words with editorial italic split
  if (/^Fisioteràpia$/i.test(spec)) return 'Fisio<em>teràpia</em>';
  return esc(spec);
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
