// HH:MM:SS clock + optional burn-in HUD drift (1px matrix)

export function startClock(el) {
  if (!el) return;
  const update = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    el.innerHTML = `${hh}:${mm}<span class="ms">:${ss}</span>`;
  };
  update();
  setInterval(update, 1000);
}

export function startBurnInDrift({ intervalMs = 60_000 } = {}) {
  const seq = [[0,0],[2,0],[2,2],[0,2],[-2,2],[-2,0],[-2,-2],[0,-2]];
  let i = 0;
  setInterval(() => {
    const [x, y] = seq[(i++) % seq.length];
    document.documentElement.style.setProperty('--safe-x', x + 'px');
    document.documentElement.style.setProperty('--safe-y', y + 'px');
  }, intervalMs);
}
