// Pro-intro transition card.

export function renderProIntroSlide({ pro, n, total }) {
  const section = document.createElement('section');
  section.className = 'slide';
  const accent = pro.accentColor;
  if (accent) section.style.setProperty('--accent-hi', accent);

  const parts = (pro.name || '').split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');

  section.innerHTML = `
    <div class="kicker">
      <span class="num">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
      <span>Acompanya el teu progrés</span>
      <span class="rule"></span>
      <span>La Mola · Serveis</span>
    </div>
    <div class="proIntro">
      <div class="stack">
        <div class="n">${String(n).padStart(2, '0')} · ${esc(pro.specialtyShort || pro.specialty || '')}</div>
        <div class="nm">${esc(firstName)} <em>${esc(lastName)}</em></div>
        <div class="sp">${esc(pro.specialty || '')}</div>
      </div>
    </div>
  `;
  return section;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
