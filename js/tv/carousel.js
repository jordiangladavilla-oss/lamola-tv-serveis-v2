// Carousel: build queue, drive slides, animate bottom progress dots.
import { renderIntroSlide } from './slide-intro.js';
import { renderProIntroSlide } from './slide-pro-intro.js';
import { renderProSlide } from './slide-pro.js';
import { renderMerchSlide } from './slide-merch.js';

export class Carousel {
  constructor(body, hud, { services, config }) {
    this.body = body;
    this.hud = hud; // { dots, idx, total, now, state }
    this.services = services;
    this.config = config;
    this.queue = [];
    this.idx = 0;
    this.currentEl = null;
    this.timer = null;
    this.watchdog = null;
    this.lastAt = Date.now();
  }

  start() {
    this._buildQueue();
    if (!this.queue.length) return;
    this._renderHudDots();
    this._mount(0);
    this._scheduleNext();
    this._startWatchdog();
    this._handleVisibility();
  }

  update({ services, config }) {
    this.services = services || this.services;
    this.config = config || this.config;
    const oldKey = this.queue[this.idx]?.key;
    this._buildQueue();
    this._renderHudDots();
    const newIdx = this.queue.findIndex(s => s.key === oldKey);
    this.idx = newIdx >= 0 ? newIdx : 0;
    if (newIdx < 0) this._mount(0);
    this._updateHudIdx();
  }

  _durations() {
    const d = this.config?.carousel?.slideDurations || {};
    const fallback = this.config?.carousel?.slideDurationMs || 12000;
    return {
      intro:    d.intro    ?? 6000,
      proIntro: d.proIntro ?? 4200,
      pro:      d.pro      ?? fallback,
      merch:    d.merch    ?? 18000
    };
  }

  _buildQueue() {
    const q = [];
    const s = this.services || {};
    const dur = this._durations();
    const pros = (s.professionals || [])
      .filter(p => p.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (s.intro?.active !== false) {
      q.push({
        key: 'intro', kind: 'intro', label: 'Intro · Els nostres serveis',
        durationMs: dur.intro,
        render: () => renderIntroSlide({ intro: s.intro || {}, pros, globals: s.globals || {} })
      });
    }
    pros.forEach((p, i) => {
      q.push({
        key: `proIntro-${p.id}`, kind: 'proIntro',
        label: `${String(i+1).padStart(2,'0')}/${String(pros.length).padStart(2,'0')} · Presentació`,
        durationMs: dur.proIntro,
        render: () => renderProIntroSlide({ pro: p, n: i + 1, total: pros.length })
      });
      q.push({
        key: `pro-${p.id}`, kind: 'pro',
        label: `${String(i+1).padStart(2,'0')}/${String(pros.length).padStart(2,'0')} · ${p.specialty || ''}`,
        durationMs: dur.pro,
        render: () => renderProSlide({ pro: p, n: i + 1, total: pros.length, globals: s.globals || {} })
      });
    });
    if (s.merch?.active !== false) {
      q.push({
        key: 'merch', kind: 'merch', label: `Merch · ${s.merch?.collectionName || ''}`.trim(),
        durationMs: dur.merch,
        render: () => renderMerchSlide({ merch: s.merch || {}, globals: s.globals || {} })
      });
    }
    this.queue = q;
  }

  _mount(i) {
    const item = this.queue[i];
    let el;
    try { el = item.render(); }
    catch (err) {
      console.error('[carousel] render failed', item.key, err);
      return this._skipTo(i + 1);
    }
    this.body.innerHTML = '';
    this.body.appendChild(el);
    this.currentEl = el;
    this.idx = i;
    this.lastAt = Date.now();
    this._updateHudIdx();
    this._animateDots();
  }

  _scheduleNext() {
    const ms = this.queue[this.idx]?.durationMs || 12000;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this._next(), ms);
  }

  _next() {
    const next = (this.idx + 1) % this.queue.length;
    this._mount(next);
    this._scheduleNext();
  }

  _skipTo(i) {
    const safe = ((i % this.queue.length) + this.queue.length) % this.queue.length;
    this._mount(safe);
    this._scheduleNext();
  }

  _renderHudDots() {
    const dots = this.hud.dots;
    if (!dots) return;
    dots.innerHTML = '';
    for (let i = 0; i < this.queue.length; i++) {
      const el = document.createElement('i');
      dots.appendChild(el);
    }
    if (this.hud.total) this.hud.total.textContent = String(this.queue.length).padStart(2, '0');
  }

  _animateDots() {
    const dots = this.hud.dots;
    if (!dots) return;
    const items = dots.querySelectorAll('i');
    items.forEach((el, i) => {
      el.className = i === this.idx ? 'on' : (i < this.idx ? 'done' : '');
      if (i === this.idx) el.style.setProperty('--slide-ms', (this.queue[this.idx]?.durationMs || 12000) + 'ms');
    });
  }

  _updateHudIdx() {
    if (this.hud.idx) this.hud.idx.textContent = String(this.idx + 1).padStart(2, '0');
    if (this.hud.now) this.hud.now.textContent = this.queue[this.idx]?.label || '—';
  }

  _startWatchdog() {
    const durs = this._durations();
    const longest = Math.max(durs.intro, durs.proIntro, durs.pro, durs.merch, 12000);
    if (this.watchdog) clearInterval(this.watchdog);
    this.watchdog = setInterval(() => {
      if (Date.now() - this.lastAt > longest * 2.5) {
        console.warn('[carousel] watchdog reload');
        location.reload();
      }
    }, 30_000);
  }

  _handleVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(this.timer);
      else { this.lastAt = Date.now(); this._scheduleNext(); }
    });
  }
}
