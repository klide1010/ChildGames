'use strict';

/* ---------- Salvataggio (localStorage, con protezione) ---------- */
const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* niente */ } },
};

/* ---------- Suoni sintetizzati (nessun file audio) ---------- */
const Sound = {
  ac: null,
  on: Store.get('cg_sound', true),
  unlock() {
    try {
      if (!this.ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) this.ac = new A(); }
      if (this.ac && this.ac.state === 'suspended') this.ac.resume();
    } catch (e) { /* niente */ }
  },
  tone(f, d = 0.12, type = 'sine', v = 0.15, delay = 0) {
    if (!this.on || !this.ac) return;
    try {
      const t = this.ac.currentTime + delay;
      const o = this.ac.createOscillator(), g = this.ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(this.ac.destination);
      o.start(t); o.stop(t + d + 0.02);
    } catch (e) { /* niente */ }
  },
  good() { this.tone(660, 0.1, 'triangle'); this.tone(990, 0.15, 'triangle', 0.15, 0.07); },
  bad() { this.tone(200, 0.25, 'sawtooth', 0.07); this.tone(140, 0.3, 'sawtooth', 0.07, 0.1); },
  pop() { this.tone(500 + Math.random() * 300, 0.07, 'square', 0.05); },
  slice() { this.tone(1200, 0.06, 'triangle', 0.08); this.tone(700, 0.08, 'triangle', 0.06, 0.03); },
  ring() { this.tone(1318, 0.08, 'square', 0.05); this.tone(1760, 0.12, 'square', 0.05, 0.06); },
  note(f) { this.tone(f, 0.35, 'triangle', 0.22); },
  win() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.15, i * 0.12)); },
};

/* ---------- Utilità ---------- */
const U = {
  rand: (a, b) => a + Math.random() * (b - a),
  ri: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; },
  el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; },
  esc: s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  fmt(sec) { sec = Math.max(0, Math.floor(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); },
  vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* niente */ } },
  hearts: (n, max = 3) => '❤️'.repeat(Math.max(0, n)) + '🤍'.repeat(Math.max(0, max - n)),
};

/* ---------- Applicazione ---------- */
const App = (() => {
  const games = [];
  let cur = null;     // partita in corso
  let clock = null;   // cronometro
  const $ = s => document.querySelector(s);

  function register(g) { games.push(g); }

  /* Giocatore */
  function playerName() { return (Store.get('cg_player', '') || '').trim() || 'Giocatore'; }
  function setPlayer(name) {
    name = (name || '').trim().slice(0, 12);
    Store.set('cg_player', name);
    if (name) {
      const list = Store.get('cg_players', []).filter(n => n !== name);
      list.unshift(name);
      Store.set('cg_players', list.slice(0, 6));
    }
    renderChips();
  }
  function renderChips() {
    const box = $('#player-chips');
    const current = Store.get('cg_player', '');
    box.innerHTML = '';
    Store.get('cg_players', []).forEach(n => {
      const b = U.el('button', 'chip' + (n === current ? ' on' : ''), U.esc(n));
      b.onclick = () => { $('#player').value = n; setPlayer(n); Sound.unlock(); Sound.pop(); };
      box.appendChild(b);
    });
  }

  /* Record: i 5 migliori per ogni gioco (più punti, poi meno tempo) */
  function records(id) { return Store.get('cg_rec_' + id, []); }
  function saveRecord(id, points, time) {
    const list = records(id);
    const entry = { name: playerName(), points, time, d: Date.now() };
    list.push(entry);
    list.sort((a, b) => b.points - a.points || a.time - b.time || a.d - b.d);
    const top = list.slice(0, 5);
    Store.set('cg_rec_' + id, top);
    return { top, rank: top.indexOf(entry) };
  }

  /* Schermate */
  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  }

  function renderMenu() {
    const list = $('#game-list');
    list.innerHTML = '';
    games.forEach((g, i) => {
      const best = records(g.id)[0];
      const b = U.el('button', 'game-card');
      b.style.setProperty('--c', g.color);
      b.style.animationDelay = (i * 0.05) + 's';
      b.innerHTML = `
        <div class="gc-art">${g.art()}</div>
        <div class="gc-body">
          <h3>${g.title}</h3>
          <p>${g.desc}</p>
          <span class="gc-rec">${best ? `🏆 ${best.points} punti · ⏱ ${U.fmt(best.time)} · ${U.esc(best.name)}` : '✨ Ancora nessun record'}</span>
        </div>`;
      b.onclick = () => { history.pushState({ g: g.id }, ''); start(g.id); };
      list.appendChild(b);
    });
  }

  // Torna al menu passando dalla cronologia, così il tasto "indietro" del telefono resta coerente
  function leave() {
    if (history.state && history.state.g) history.back(); else goMenu();
  }

  function goMenu() {
    stop();
    renderMenu();
    show('menu');
  }

  /* HUD */
  function setPoints(n) { $('#hud-points').textContent = Math.floor(n); }
  function setInfo(html) { $('#hud-info').innerHTML = html || ''; }

  /* Cronometro: conto alla rovescia se il gioco ha una durata, altrimenti tempo che passa */
  function startClock(duration) {
    stopClock();
    clock = { t0: performance.now(), duration };
    clock.timer = setInterval(tick, 200);
    tick();
  }
  function elapsed() {
    if (!clock) return 0;
    const e = (performance.now() - clock.t0) / 1000;
    return clock.duration ? Math.min(clock.duration, e) : e;
  }
  function tick() {
    if (!clock) return;
    const t = $('#hud-time');
    const e = elapsed();
    if (clock.duration) {
      const rem = clock.duration - e;
      t.textContent = U.fmt(Math.ceil(rem));
      t.parentElement.classList.toggle('hurry', rem <= 10);
      if (rem <= 0) {
        stopClock(true);
        if (cur && cur.inst.timeUp) cur.inst.timeUp(); else finish({ title: 'Tempo scaduto!' });
      }
    } else {
      t.textContent = U.fmt(e);
    }
  }
  function stopClock(keep) {
    if (clock) {
      clearInterval(clock.timer);
      if (keep) clock.frozen = elapsed();
    }
    if (!keep) clock = null;
  }

  /* Avvio partita */
  function start(id) {
    stop();
    const g = games.find(x => x.id === id);
    Sound.unlock();
    show('game');
    setPoints(0);
    setInfo('');
    $('#hud-time').textContent = g.duration ? U.fmt(g.duration) : '0:00';
    $('#hud-time').parentElement.classList.remove('hurry');
    const stage = $('#stage');
    stage.innerHTML = '';
    stage.className = 'stage stage-' + g.id;
    $('#end').classList.remove('show');
    $('#end').innerHTML = '';

    const ctx = {
      stage, game: g, points: 0,
      add(n) { ctx.points = Math.max(0, ctx.points + n); setPoints(ctx.points); },
      info: setInfo,
      begin() { startClock(g.duration); },
      elapsed() { return clock ? (clock.frozen != null ? clock.frozen : elapsed()) : 0; },
      end(o) { finish(o); },
      intro: (o, cb) => intro(stage, o, cb),
      popup: (text, x, y, cls) => popup(stage, text, x, y, cls),
      canvas: () => makeCanvas(stage),
    };
    cur = { g, ctx, inst: {} };
    cur.inst = g.start(ctx) || {};
  }

  function stop() {
    if (cur && !cur.done && cur.inst.stop) cur.inst.stop();
    stopClock();
    cur = null;
  }

  /* Fine partita: punti, tempo, stelle e classifica */
  function finish(o = {}) {
    if (!cur || cur.done) return;
    const time = Math.round(cur.ctx.elapsed());
    stopClock();
    if (cur.inst.stop) cur.inst.stop();
    cur.done = true;
    const g = cur.g;
    const pts = Math.round(cur.ctx.points);
    setPoints(pts);
    const { top, rank } = saveRecord(g.id, pts, time);
    const stars = o.stars != null ? o.stars : (g.stars ? g.stars(pts) : 1);
    const end = $('#end');
    end.innerHTML = `
      <div class="end-card">
        <div class="end-stars">${[0, 1, 2].map(i => `<span class="${i < stars ? 'on' : ''}" style="animation-delay:${0.2 + i * 0.25}s">★</span>`).join('')}</div>
        <h2>${o.title || 'Bravo! 🎉'}</h2>
        ${o.msg ? `<p>${o.msg}</p>` : ''}
        <div class="end-stats">
          <div><b>${pts}</b><span>punti</span></div>
          <div><b>${U.fmt(time)}</b><span>tempo</span></div>
        </div>
        ${rank === 0 && pts > 0 ? '<div class="newrec">🏆 NUOVO RECORD! 🏆</div>' : ''}
        <h4>Classifica</h4>
        <ol class="top">${top.map((r, i) => `<li class="${i === rank ? 'me' : ''}"><span>${['🥇', '🥈', '🥉', '4.', '5.'][i]} ${U.esc(r.name)}</span><span>${r.points} pt · ${U.fmt(r.time)}</span></li>`).join('')}</ol>
        <div class="end-btns">
          <button class="btn" id="end-again">🔁 Ancora</button>
          <button class="btn alt" id="end-menu">🏠 Menu</button>
        </div>
      </div>`;
    end.classList.add('show');
    $('#end-again').onclick = () => start(g.id);
    $('#end-menu').onclick = leave;
    if (stars > 0) Sound.win(); else Sound.bad();
  }

  /* Schermata di istruzioni prima di giocare */
  function intro(stage, o, cb) {
    const box = U.el('div', 'intro');
    box.innerHTML = `
      <div class="intro-card">
        ${o.art ? `<div class="intro-art">${o.art}</div>` : ''}
        <h2>${o.title}</h2>
        <p>${o.text}</p>
        <div class="intro-btns"></div>
      </div>`;
    const btns = box.querySelector('.intro-btns');
    (o.buttons || [{ label: '▶ Via!' }]).forEach(b => {
      const e = U.el('button', 'btn big', b.label);
      e.addEventListener('click', ev => {
        ev.stopPropagation();
        Sound.unlock();
        Sound.pop();
        box.remove();
        cb(b.value);
      });
      btns.appendChild(e);
    });
    stage.appendChild(box);
  }

  /* Scritte che volano (+10, Combo! ...) */
  function popup(stage, text, x, y, cls = '') {
    const p = U.el('div', 'float ' + cls, text);
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    stage.appendChild(p);
    // tiene la scritta dentro lo schermo
    const half = p.offsetWidth / 2 + 6;
    p.style.left = Math.max(half, Math.min(stage.clientWidth - half, x)) + 'px';
    setTimeout(() => p.remove(), 1000);
  }

  /* Canvas a tutto schermo, nitido sui telefoni */
  function makeCanvas(stage) {
    const c = U.el('canvas', 'game-canvas');
    stage.appendChild(c);
    const obj = { c, g: c.getContext('2d'), W: 0, H: 0 };
    const fit = () => {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      c.style.width = r.width + 'px';
      c.style.height = r.height + 'px';
      obj.g.setTransform(dpr, 0, 0, dpr, 0, 0);
      obj.W = r.width; obj.H = r.height;
    };
    fit();
    window.addEventListener('resize', fit);
    obj.dispose = () => window.removeEventListener('resize', fit);
    obj.pos = ev => { const r = c.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; };
    return obj;
  }

  function init() {
    const input = $('#player');
    input.value = Store.get('cg_player', '');
    input.addEventListener('change', () => setPlayer(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { setPlayer(input.value); input.blur(); } });
    renderChips();

    const sb = $('#sound-btn');
    const paint = () => { sb.textContent = Sound.on ? '🔊' : '🔇'; };
    paint();
    sb.onclick = () => { Sound.on = !Sound.on; Store.set('cg_sound', Sound.on); paint(); Sound.unlock(); Sound.pop(); };

    $('#back').onclick = leave;
    // Il tasto "indietro" del telefono riporta al menu invece di chiudere il sito
    window.addEventListener('popstate', () => { if ($('#game').classList.contains('active')) goMenu(); });

    // Evita zoom con doppio tocco durante il gioco
    document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

    if (history.state && history.state.g) history.replaceState(null, '');
    renderMenu();
  }

  return { register, init, start, goMenu };
})();
