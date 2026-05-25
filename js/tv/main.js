// Bootstrap kiosk V2 — editorial boutique edition.
import { DataLoader } from './data-loader.js';
import { Carousel } from './carousel.js';
import { startClock, startBurnInDrift } from './clock.js';

const isPreview = new URLSearchParams(location.search).has('preview');
if (isPreview) document.body.classList.add('is-preview');

const $ = (s) => document.querySelector(s);

const stage = $('#stage');
const body = $('#body');
const loading = $('#loading');
const errorScreen = $('#error');
const clockEl = $('#hud-clock');
const coordsEl = $('#hud-coords');
const taglineEl = $('#hud-tagline');

const hudRefs = {
  dots: $('#hud-dots'),
  idx: $('#hud-idx'),
  total: $('#hud-total'),
  now: $('#hud-now'),
  state: $('#hud-state')
};

const loader = new DataLoader();
let carousel = null;

/* Stage scaling — fit 1920x1080 design to viewport */
function fitStage() {
  if (!stage) return;
  const w = window.innerWidth, h = window.innerHeight;
  const s = Math.min(w / 1920, h / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener('resize', fitStage);
window.addEventListener('orientationchange', fitStage);
setTimeout(fitStage, 30);
setTimeout(fitStage, 200);
setTimeout(fitStage, 800);
fitStage();

function hideOverlays() {
  if (loading) { loading.style.opacity = '0'; setTimeout(() => loading.hidden = true, 700); }
  if (errorScreen) errorScreen.hidden = true;
}
function showError() {
  if (errorScreen) errorScreen.hidden = false;
  if (loading) loading.hidden = true;
}

async function bootstrap() {
  try {
    const { services, config } = await loader.load();

    if (services?.globals?.coords && coordsEl) coordsEl.textContent = services.globals.coords;
    if (services?.globals?.tagline && taglineEl) taglineEl.textContent = services.globals.tagline;

    carousel = new Carousel(body, hudRefs, { services, config });
    carousel.start();

    loader.addEventListener(DataLoader.EVENT_UPDATED, (e) => {
      console.log('[main] data updated');
      carousel.update(e.detail);
    });
    loader.startPolling(config?.data?.refetchIntervalMs || 600_000);

    if (config?.display?.showClock !== false) startClock(clockEl);
    if (config?.display?.burnInProtection !== false && !isPreview) {
      startBurnInDrift({ intervalMs: config?.display?.burnInIntervalMs || 60_000 });
    }

    hideOverlays();

    if ('serviceWorker' in navigator && !isPreview && location.protocol !== 'file:') {
      try { await navigator.serviceWorker.register('./sw.js'); } catch (e) { console.warn('[sw] register failed', e); }
    }
  } catch (err) {
    console.error('[main] bootstrap failed', err);
    showError();
    setTimeout(bootstrap, 30_000);
  }
}

bootstrap();
