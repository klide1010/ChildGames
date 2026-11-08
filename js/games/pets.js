'use strict';
/*
 * Giochi "tipo Tamagotchi": La Fattoria delle Mucche e Il Mio Panda.
 * Tutto si fa con le dita: si trascina il cibo nella mangiatoia, l'acqua nell'abbeveratoio,
 * si strofina la spazzola sull'animale, lo si accarezza, si munge muovendo il dito su e giù,
 * si lancia la palla al panda... Gli animali si muovono da soli: vanno a mangiare, a bere, a giocare.
 * Se trascurati si ammalano (ma non muoiono mai). Lo stato resta salvato sul telefono.
 */
const Pets = (() => {
  const STATS = [
    { k: 'fame', icon: '🍀', color: '#2ec27e' },
    { k: 'sete', icon: '💧', color: '#3a86ff' },
    { k: 'pulizia', icon: '🧼', color: '#c084fc' },
    { k: 'gioia', icon: '❤️', color: '#ff4d6d' },
    { k: 'energia', icon: '⚡', color: '#ffb703' },
    { k: 'salute', icon: '🩺', color: '#06d6a0' },
  ];
  const DECAY = { fame: 6, sete: 8, pulizia: 3, gioia: 4, energia: 3 }; // al minuto
  const clamp = v => Math.max(0, Math.min(100, v));
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  function newAnimal(name) {
    return { name, fame: 80, sete: 80, pulizia: 90, gioia: 80, energia: 90, salute: 100, sick: false, sleep: false, milk: 0, xp: 0, poopIn: 50 };
  }

  function register(cfg) {
    App.register({
      id: cfg.id,
      title: cfg.title,
      desc: cfg.desc,
      color: cfg.color,
      duration: null,
      art: cfg.art,
      stars: p => (p >= 400 ? 3 : p >= 150 ? 2 : p >= 30 ? 1 : 0),

      start(ctx) {
        let S = Store.get(cfg.save, null);
        const firstTime = !S;
        if (!S) S = { animals: [newAnimal(cfg.names[0])], coins: 0, poops: [], last: Date.now(), sel: 0 };
        if (S.feed == null) { S.feed = 60; S.water = 60; }
        let running = false, raf = 0, timers = [], lastFrame = performance.now();
        let parts = [];             // particelle: bolle, cuori, gocce...
        let milking = null;         // mungitura in corso
        let ball = cfg.ball ? { x: 260, y: 200, vx: 0, vy: 0, held: false } : null;
        let drag = null;            // attrezzo trascinato
        let hintT = 0;
        let ready = false;          // la scena SVG esiste già?

        /* ---------- posizione e movimento degli animali (non salvati) ---------- */
        S.animals.forEach((a, i) => placeAnimal(a, i));
        function placeAnimal(a, i) {
          const r = cfg.roam;
          a._x = r.x0 + (r.x1 - r.x0) * (0.25 + 0.5 * ((i * 0.37) % 1));
          a._y = r.y0 + (r.y1 - r.y0) * ((i * 0.61 + 0.3) % 1);
          a._tx = a._x; a._ty = a._y; a._face = i % 2 ? -1 : 1; a._mode = a.sleep ? 'sleep' : 'idle'; a._phase = 0; a._wait = 1 + i;
        }

        /* ---------- tempo passato a gioco chiuso (piano, senza far ammalare) ---------- */
        (function catchUp() {
          const min = Math.min(720, (Date.now() - (S.last || Date.now())) / 60000);
          if (min < 1) return;
          S.animals.forEach(a => {
            // mentre non c'eri hanno mangiato e bevuto da mangiatoia e abbeveratoio
            const eat = Math.min(S.feed, DECAY.fame * min * 0.25); S.feed -= eat * 0.5;
            const drink = Math.min(S.water, DECAY.sete * min * 0.25); S.water -= drink * 0.5;
            a.fame = Math.max(Math.min(a.fame, 25), a.fame - DECAY.fame * min * 0.25 + eat);
            a.sete = Math.max(Math.min(a.sete, 25), a.sete - DECAY.sete * min * 0.25 + drink);
            for (const k of ['pulizia', 'gioia']) a[k] = Math.max(Math.min(a[k], 25), a[k] - DECAY[k] * min * 0.25);
            a.fame = clamp(a.fame); a.sete = clamp(a.sete);
            a.energia = clamp(a.energia + min * 2);
            a.sleep = false; a._mode = 'idle';
            if (cfg.milk) a.milk = clamp(a.milk + min * 3);
          });
          for (let i = 0; i < Math.min(3, Math.floor(min / 30)); i++) addPoop(U.ri(0, S.animals.length - 1));
        })();

        /* ---------- interfaccia ---------- */
        const box = U.el('div', 'pet', `
          <div class="pet-scene"><div class="pet-svg"></div><div class="pet-hint"></div></div>
          <div class="pet-tabs"></div>
          <div class="pet-card"><div class="pet-name"></div><div class="pet-bars"></div></div>
          <div class="pet-tools"></div>
          <div class="pet-bottom">${cfg.buy ? '<button class="btn alt" data-b="buy"></button>' : '<span class="pet-level"></span>'}<button class="btn" data-b="save">💾 Salva ed esci</button></div>`);
        ctx.stage.appendChild(box);
        const svgBox = box.querySelector('.pet-svg');
        const hintEl = box.querySelector('.pet-hint');
        const tabs = box.querySelector('.pet-tabs');
        const nameEl = box.querySelector('.pet-name');
        const bars = box.querySelector('.pet-bars');
        const toolsEl = box.querySelector('.pet-tools');
        svgBox.innerHTML = `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg"><g class="pg-bg"></g><g class="pg-bowls"></g><g class="pg-zones"></g><g class="pg-poops"></g><g class="pg-animals"></g><g class="pg-fx"></g></svg>`;
        const svg = svgBox.querySelector('svg');
        const G = n => svg.querySelector('.pg-' + n);
        ready = true;

        const cur = () => S.animals[S.sel] || S.animals[0];
        const save = () => {
          S.last = Date.now();
          Store.set(cfg.save, S);
        };
        function hint(text, ms = 3000) { hintEl.textContent = text; hintEl.classList.add('on'); hintT = performance.now() + ms; }

        function toSvg(ev) {
          const r = svg.getBoundingClientRect();
          return { x: (ev.clientX - r.left) / r.width * 400, y: (ev.clientY - r.top) / r.height * 250, inside: ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom };
        }
        function popupSvg(text, x, y, cls = '') {
          const r = svg.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
          ctx.popup(text, r.left - s.left + x / 400 * r.width, r.top - s.top + y / 250 * r.height, cls);
        }
        const scaleOf = a => (cfg.scale ? cfg.scale(a) : 1);
        function animalAt(p) {
          let best = -1, bd = 1e9;
          S.animals.forEach((a, i) => {
            const s = scaleOf(a), h = cfg.hit;
            if (p.x > a._x - h.w * s && p.x < a._x + h.w * s && p.y > a._y - h.h * s && p.y < a._y + 8) {
              const d = dist(p.x, p.y, a._x, a._y - h.h * s / 2);
              if (d < bd) { bd = d; best = i; }
            }
          });
          return best;
        }
        function addPart(x, y, kind, n = 1) {
          for (let k = 0; k < n; k++) parts.push({ x: x + U.rand(-8, 8), y: y + U.rand(-6, 6), vx: U.rand(-15, 15), vy: kind === 'drop' ? U.rand(20, 60) : U.rand(-40, -15), life: 1, kind });
        }
        function addPoop(i) {
          if (S.poops.length >= 6) return;
          const a = S.animals[i] || S.animals[0];
          const x = a._x != null ? a._x : 200;
          S.poops.push({ x: Math.max(30, Math.min(370, x - (a._face || 1) * U.ri(40, 70))), y: Math.max(196, Math.min(240, (a._y || 210) + U.ri(4, 18))), id: Date.now() + Math.random() });
          if (ready) renderPoops();
        }
        function care(a, pts) {
          ctx.add(pts);
          const before = cfg.level ? cfg.level(a).label : null;
          a.xp += pts;
          if (cfg.level && before !== cfg.level(a).label) { Sound.win(); popupSvg(`🎉 ${cfg.level(a).label}!`, a._x, a._y - 120, 'gold'); }
        }

        /* ---------- disegno ---------- */
        let night = null;
        function renderBg() {
          const n = S.animals.every(a => a.sleep);
          if (n === night) return;
          night = n;
          G('bg').innerHTML = cfg.bg(n);
        }
        function renderBowls() { G('bowls').innerHTML = cfg.bowls(S.feed, S.water); }
        function renderPoops() {
          G('poops').innerHTML = S.poops.map(p => `<g class="poop" data-poop="${p.id}" transform="translate(${p.x} ${p.y})"><path d="M-10 0 Q-12 -8 -4 -8 Q-6 -16 2 -14 Q8 -20 8 -10 Q14 -8 10 0 Z" fill="#7a4a22" stroke="#4a2c12" stroke-width="1.5"/><circle cx="-2" cy="-6" r="1.5" fill="#fff"/><circle cx="4" cy="-6" r="1.5" fill="#fff"/><path d="M-4 -24 Q-2 -28 0 -24 M4 -26 Q6 -30 8 -26" stroke="#8d9a5b" stroke-width="1.5" fill="none"/><rect x="-16" y="-30" width="32" height="34" fill="transparent"/></g>`).join('');
        }
        function bubbleFor(a) {
          if (a.sick) return '🤒';
          if (a.sleep) return '';
          if (a.fame < 35) return S.feed < 5 ? cfg.foodIcon : '';
          if (a.sete < 35) return S.water < 5 ? '💧' : '';
          if (a.energia < 25) return '😴';
          if (a.pulizia < 35) return '🧼';
          if (a.gioia < 35) return cfg.ball ? '⚽' : '🤗';
          return '';
        }
        function renderAnimals() {
          const order = S.animals.map((a, i) => i).sort((p, q) => S.animals[p]._y - S.animals[q]._y);
          let s = '';
          order.forEach(i => {
            const a = S.animals[i];
            const sc = scaleOf(a);
            const fx = a._fxUntil > performance.now() ? a._fx : (a._mode === 'eat' ? 'eat' : a._mode === 'drink' ? 'drink' : null);
            s += `<g class="pet-animal" data-i="${i}" data-x="${a._x.toFixed(1)}" data-y="${a._y.toFixed(1)}">` + cfg.draw(a, a._x, a._y, sc, fx, i === S.sel && S.animals.length > 1, a._phase, a._face, a._mode) + '</g>';
            const b = bubbleFor(a);
            if (b) s += `<g transform="translate(${a._x + 30 * sc} ${a._y - cfg.hit.h * sc - 6})"><path d="M-18 -16 Q-20 -34 0 -34 Q20 -34 18 -16 Q18 0 0 0 L-8 8 L-6 0 Q-18 0 -18 -16 Z" fill="#fff" stroke="#555" stroke-width="1.5"/><text x="0" y="-11" font-size="16" text-anchor="middle">${b}</text></g>`;
            if (a.sleep) s += `<text x="${a._x + 24 * sc}" y="${a._y - cfg.hit.h * sc + 10 + Math.sin(performance.now() / 400) * 4}" font-size="${18 * sc}" fill="#fff" font-weight="800" stroke="#333" stroke-width=".6">Z z z</text>`;
          });
          if (milking) {
            const a = S.animals[milking.i], sc = scaleOf(a);
            const ux = a._x + cfg.udder.x * sc * a._face, uy = a._y + cfg.udder.y * sc;
            s += `<g transform="translate(${ux} ${uy + 26})"><path d="M-14 -16 L14 -16 L11 6 L-11 6 Z" fill="#adb5bd" stroke="#6c757d" stroke-width="1.5"/><rect x="-12" y="${-14 + 18 * (1 - milking.strokes / milking.need)}" width="24" height="${18 * milking.strokes / milking.need}" fill="#fff"/><path d="M-14 -16 Q0 -30 14 -16" stroke="#6c757d" stroke-width="2" fill="none"/></g>`;
            s += `<circle cx="${ux}" cy="${uy}" r="26" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 5" class="pg-pulse pet-udder" data-x="${ux}" data-y="${uy}"/>`;
          }
          if (ball) s += `<g class="pet-ball" transform="translate(${ball.x} ${ball.y})"><ellipse cx="0" cy="12" rx="12" ry="4" fill="rgba(0,0,0,.2)"/><circle r="13" fill="#ff4d6d" stroke="#fff" stroke-width="3"/><path d="M-13 0 Q0 -9 13 0 M-13 0 Q0 9 13 0" stroke="#fff" stroke-width="2" fill="none"/><circle r="26" fill="transparent"/></g>`;
          G('animals').innerHTML = s;
        }
        function renderParts(dt) {
          parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * (p.kind === 'drop' ? 1.6 : 0.9); });
          parts = parts.filter(p => p.life > 0);
          G('fx').innerHTML = parts.map(p => {
            const o = Math.max(0, Math.min(1, p.life)).toFixed(2);
            if (p.kind === 'bubble') return `<circle cx="${p.x}" cy="${p.y}" r="${6 + (1 - p.life) * 5}" fill="#e0f7ff" stroke="#9ad0ff" opacity="${o}"/>`;
            if (p.kind === 'drop') return `<ellipse cx="${p.x}" cy="${p.y}" rx="3" ry="4.5" fill="${p.color || '#4dd0ff'}" opacity="${o}"/>`;
            if (p.kind === 'hay') return `<path d="M${p.x} ${p.y} l10 -3" stroke="${p.color || '#e9c46a'}" stroke-width="2.5" opacity="${o}"/>`;
            if (p.kind === 'star') return `<text x="${p.x}" y="${p.y}" font-size="14" opacity="${o}">✨</text>`;
            return `<path d="M${p.x} ${p.y + 6} C${p.x - 9} ${p.y} ${p.x - 6} ${p.y - 8} ${p.x} ${p.y - 3} C${p.x + 6} ${p.y - 8} ${p.x + 9} ${p.y} ${p.x} ${p.y + 6} Z" fill="#ff4d6d" opacity="${o}"/>`;
          }).join('');
        }
        function renderZones() {
          if (!drag) { G('zones').innerHTML = ''; return; }
          const t = drag.tool;
          let z = '';
          if (t.kind === 'feed' || t.kind === 'water') { const Z = cfg.zones[t.kind]; z = `<circle cx="${Z.x}" cy="${Z.y}" r="${Z.r + 10}" fill="rgba(255,210,63,.25)" stroke="#ffd23f" stroke-width="3" stroke-dasharray="7 5" class="pg-pulse"/>`; }
          if (t.kind === 'drop' || t.kind === 'rub' || t.kind === 'milk') z = S.animals.map(a => { const s = scaleOf(a); return `<ellipse cx="${a._x}" cy="${a._y - cfg.hit.h * s / 2}" rx="${cfg.hit.w * s}" ry="${cfg.hit.h * s / 2 + 6}" fill="rgba(255,210,63,.15)" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="7 5"/>`; }).join('');
          if (t.kind === 'sweep') z = S.poops.map(p => `<circle cx="${p.x}" cy="${p.y - 8}" r="20" fill="none" stroke="#ffd23f" stroke-width="2.5" stroke-dasharray="6 4"/>`).join('');
          G('zones').innerHTML = z;
        }

        function renderPanel() {
          const a = cur();
          nameEl.innerHTML = `${cfg.icon} <b>${U.esc(a.name)}</b>${a.sick ? ' · 🤒 malata' : a.sleep ? ' · 😴 dorme' : ''}${cfg.level ? ` · ${cfg.level(a).label}` : ''}`;
          bars.innerHTML = STATS.map(t => `<div class="pet-bar ${a[t.k] < 25 ? 'low' : ''}"><span>${t.icon}</span><i><b style="width:${Math.round(a[t.k])}%;background:${t.color}"></b></i></div>`).join('') +
            (cfg.milk ? `<div class="pet-bar milk"><span>🥛</span><i><b style="width:${Math.round(a.milk)}%;background:#fff"></b></i></div>` : '');
          tabs.innerHTML = '';
          if (S.animals.length > 1) S.animals.forEach((x, i) => {
            const b = U.el('button', 'pet-tab' + (i === S.sel ? ' on' : ''), `${bubbleFor(x) || cfg.icon} ${U.esc(x.name)}`);
            b.onclick = () => { S.sel = i; Sound.pop(); renderPanel(); };
            tabs.appendChild(b);
          });
          ctx.info(`${cfg.milk ? `🪙 ${S.coins} · ` : ''}${cfg.icon} ${S.animals.length > 1 ? S.animals.length + ' ' + cfg.plural : U.esc(a.name)}`);
          const buy = box.querySelector('[data-b="buy"]');
          if (buy) {
            buy.textContent = S.animals.length >= cfg.names.length ? `${cfg.icon} Stalla piena!` : `➕ Nuova ${cfg.single} (${cfg.buy} 🪙)`;
            buy.disabled = S.animals.length >= cfg.names.length;
          }
          const lv = box.querySelector('.pet-level');
          if (lv && cfg.level) { const L = cfg.level(a); lv.innerHTML = `${L.label}${L.next ? ` · ⭐ ${Math.floor(a.xp)}/${L.next}` : ' · ⭐ massimo!'}`; }
          // l'attrezzo che serve "lampeggia"
          toolsEl.querySelectorAll('.pet-tool').forEach(b => {
            const t = cfg.tools.find(x => x.id === b.dataset.t);
            b.classList.toggle('need', !!(t.need && S.animals.some(x => t.need(x, S))));
            const lab = b.querySelector('small');
            if (t.label && typeof t.label === 'function') lab.textContent = t.label(cur(), S);
          });
        }

        /* ---------- attrezzi da trascinare ---------- */
        cfg.tools.forEach(t => {
          const b = U.el('button', 'pet-tool', `<span>${t.icon}</span><small>${typeof t.label === 'function' ? t.label(cur(), S) : t.label}</small>`);
          b.dataset.t = t.id;
          b.addEventListener('pointerdown', ev => startDrag(ev, t, b));
          toolsEl.appendChild(b);
        });

        function startDrag(ev, t, b) {
          if (!running) return;
          ev.preventDefault();
          try { b.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
          const ghost = U.el('div', 'pet-ghost', t.icon);
          ctx.stage.appendChild(ghost);
          drag = { tool: t, ghost, b, rub: 0, lastP: null, swept: 0 };
          moveGhost(ev);
          hint(t.tip, 4000);
          Sound.pop();
          const move = e => onDragMove(e);
          const up = e => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up); onDragEnd(e); };
          b.addEventListener('pointermove', move);
          b.addEventListener('pointerup', up);
          b.addEventListener('pointercancel', up);
        }
        function moveGhost(ev) {
          const s = ctx.stage.getBoundingClientRect();
          drag.ghost.style.left = (ev.clientX - s.left) + 'px';
          drag.ghost.style.top = (ev.clientY - s.top) + 'px';
        }
        function onDragMove(ev) {
          if (!drag) return;
          moveGhost(ev);
          const p = toSvg(ev), t = drag.tool;
          if (!p.inside) { drag.lastP = null; return; }
          if (t.kind === 'rub') {
            const i = animalAt(p);
            if (i >= 0 && drag.lastP) {
              const d = dist(p.x, p.y, drag.lastP.x, drag.lastP.y);
              drag.rub += d;
              while (drag.rub > 28) {
                drag.rub -= 28;
                const a = S.animals[i];
                t.rub(a, { part: k => addPart(p.x, p.y, k), care: n => care(a, n), popup: (tx, c) => popupSvg(tx, a._x, a._y - cfg.hit.h * scaleOf(a) - 10, c) });
                if (a.sleep && t.wakes) { a.sleep = false; a._mode = 'idle'; }
                if (Math.random() < 0.3) Sound.tone(t.freq || 900, 0.06, 'triangle', 0.05);
                a._fx = t.fx; a._fxUntil = performance.now() + 600;
                if (i !== S.sel) S.sel = i;
              }
            }
          }
          if (t.kind === 'sweep') {
            const before = S.poops.length;
            S.poops = S.poops.filter(q => dist(q.x, q.y - 8, p.x, p.y) > 24);
            if (S.poops.length < before) { for (let k = 0; k < before - S.poops.length; k++) { ctx.add(3); addPart(p.x, p.y, 'star', 2); popupSvg('✨ +3', p.x, p.y - 20); } Sound.pop(); renderPoops(); }
          }
          drag.lastP = p;
        }
        function onDragEnd(ev) {
          if (!drag) return;
          const t = drag.tool, p = toSvg(ev);
          drag.ghost.remove();
          const wasDrag = drag;
          drag = null;
          renderZones();
          if (!p.inside) return;
          if (t.kind === 'feed' || t.kind === 'water') {
            const Z = cfg.zones[t.kind];
            if (dist(p.x, p.y, Z.x, Z.y) > Z.r + 26) { Sound.tone(220, 0.1, 'sawtooth', 0.04); return hint(t.miss, 2500); }
            const key = t.kind === 'feed' ? 'feed' : 'water';
            if (S[key] >= 98) { hint(t.full, 2000); return; }
            S[key] = clamp(S[key] + 50);
            addPart(Z.x, Z.y - 10, t.kind === 'feed' ? 'hay' : 'drop', 8);
            Sound.tone(t.kind === 'feed' ? 300 : 700, 0.15, 'triangle', 0.08);
            popupSvg(t.done, Z.x, Z.y - 30);
            ctx.add(5);
            renderBowls(); save();
            return;
          }
          if (t.kind === 'drop') {
            const i = animalAt(p);
            if (i < 0) { Sound.tone(220, 0.1, 'sawtooth', 0.04); return hint(t.miss, 2500); }
            const a = S.animals[i];
            S.sel = i;
            t.drop(a, { popup: (tx, c) => popupSvg(tx, a._x, a._y - cfg.hit.h * scaleOf(a) - 10, c), care: n => care(a, n), part: k => addPart(a._x, a._y - 60, k, 6), fx: f => { a._fx = f; a._fxUntil = performance.now() + 1400; } });
            save(); renderBg(); renderPanel();
            return;
          }
          if (t.kind === 'milk') {
            const i = animalAt(p);
            if (i < 0) return hint(t.miss, 2500);
            const a = S.animals[i];
            S.sel = i;
            if (a.sleep) return popupSvg('Shhh! Sta dormendo 😴', a._x, a._y - 100);
            if (a.sick) return popupSvg('È malata, prima curala! 🤒', a._x, a._y - 100, 'bad');
            if (a.milk < 100) return popupSvg(`Il latte è al ${Math.floor(a.milk)}%... falla mangiare e bere bene!`, a._x, a._y - 100);
            milking = { i, strokes: 0, need: 8, dir: 0, lastY: null };
            a._mode = 'idle'; a._tx = a._x; a._ty = a._y;
            hint('🥛 Muovi il dito SU e GIÙ sulla mammella rosa!', 6000);
            Sound.pop();
          }
          if (wasDrag.tool.kind === 'rub' && wasDrag.rub === 0) hint(t.tip, 2500);
        }

        /* ---------- tocchi diretti nella scena ---------- */
        let ballGrab = null;
        svg.addEventListener('pointerdown', ev => {
          if (!running) return;
          const p = toSvg(ev);
          // palla del panda: si prende e si lancia
          if (ball && dist(p.x, p.y, ball.x, ball.y) < 30) {
            ev.preventDefault();
            try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
            ballGrab = { pts: [{ ...p, t: performance.now() }] };
            ball.held = true; ball.vx = 0; ball.vy = 0;
            return;
          }
          // mungitura: su e giù sulla mammella
          if (milking) {
            try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
            milking.lastY = p.y; milking.dir = 0;
            return;
          }
          const tp = ev.target.closest('[data-poop]');
          if (tp) {
            S.poops = S.poops.filter(x => String(x.id) !== tp.dataset.poop);
            ctx.add(3); Sound.pop(); popupSvg('✨ Pulito! +3', p.x, p.y - 20);
            renderPoops(); save();
            return;
          }
          const i = animalAt(p);
          if (i >= 0) {
            const a = S.animals[i];
            S.sel = i;
            if (a.sleep) { popupSvg('Zzz... 😴', a._x, a._y - 90); }
            else {
              Sound.tone(cfg.voiceFreq, 0.25, 'triangle', 0.12);
              popupSvg(cfg.voice, a._x, a._y - cfg.hit.h * scaleOf(a) - 10);
              a.gioia = clamp(a.gioia + 2);
              a._face = p.x < a._x ? -1 : 1;
            }
            renderPanel();
          }
        });
        svg.addEventListener('pointermove', ev => {
          const p = toSvg(ev);
          if (ballGrab && ball) {
            ball.x = Math.max(16, Math.min(384, p.x)); ball.y = Math.max(140, Math.min(240, p.y));
            ballGrab.pts.push({ ...p, t: performance.now() });
            if (ballGrab.pts.length > 6) ballGrab.pts.shift();
            return;
          }
          if (milking && milking.lastY != null) {
            const a = S.animals[milking.i], sc = scaleOf(a);
            const ux = a._x + cfg.udder.x * sc * a._face, uy = a._y + cfg.udder.y * sc;
            if (dist(p.x, p.y, ux, uy) > 50) return;
            const dy = p.y - milking.lastY;
            if (Math.abs(dy) < 6) return;
            const dir = Math.sign(dy);
            if (dir > 0 && milking.dir <= 0) {
              milking.strokes++;
              parts.push({ x: ux, y: uy + 4, vx: 0, vy: 70, life: 0.6, kind: 'drop', color: '#fff' });
              Sound.tone(500 + milking.strokes * 40, 0.06, 'triangle', 0.06);
              if (milking.strokes >= milking.need) {
                a.milk = 0; S.coins += 15; care(a, 20);
                popupSvg('🥛 Secchio pieno! +15 🪙', ux, uy - 70, 'gold');
                Sound.good();
                milking = null;
                hint('Bravissimo! Latte venduto al mercato. 🪙', 2500);
                save(); renderPanel();
                return;
              }
            }
            milking.dir = dir; milking.lastY = p.y;
          }
        });
        const release = () => {
          if (ballGrab && ball) {
            const a = ballGrab.pts[0], b = ballGrab.pts[ballGrab.pts.length - 1];
            const dt = Math.max(0.03, (b.t - a.t) / 1000);
            ball.vx = Math.max(-500, Math.min(500, (b.x - a.x) / dt));
            ball.vy = Math.max(-500, Math.min(500, (b.y - a.y) / dt));
            ball.held = false;
            if (Math.hypot(ball.vx, ball.vy) > 60) Sound.tone(400, 0.08, 'square', 0.05);
            ballGrab = null;
          }
          if (milking) milking.lastY = null;
        };
        svg.addEventListener('pointerup', release);
        svg.addEventListener('pointercancel', release);

        box.querySelector('.pet-bottom').addEventListener('click', ev => {
          const b = ev.target.closest('[data-b]');
          if (!b) return;
          if (b.dataset.b === 'buy') {
            if (S.animals.length >= cfg.names.length) return;
            if (S.coins < cfg.buy) { Sound.bad(); return hint(`Servono ${cfg.buy} 🪙! Mungi le mucche quando il latte è pieno.`); }
            S.coins -= cfg.buy;
            const a = newAnimal(cfg.names[S.animals.length]);
            S.animals.push(a);
            placeAnimal(a, S.animals.length - 1);
            a._x = 400; a._tx = 250;
            S.sel = S.animals.length - 1;
            ctx.add(30); Sound.win();
            popupSvg(`Benvenuta ${a.name}! 🎉`, 250, 120, 'gold');
            save(); renderPanel();
          }
          if (b.dataset.b === 'save') {
            save();
            ctx.end({
              title: `A presto! 👋`,
              msg: `${S.animals.map(x => `${cfg.icon} ${U.esc(x.name)}: ${x.sick ? 'malata 🤒' : bubbleFor(x) ? 'ha bisogno di ' + bubbleFor(x) : 'felice 😊'}`).join('<br>')}${cfg.milk ? `<br>🪙 Monete: <b>${S.coins}</b>` : ''}<br>Tutto è salvato: torna presto!`,
            });
          }
        });

        /* ---------- comportamento degli animali ---------- */
        function think(a, i, dt) {
          if (a.sleep) { a._mode = 'sleep'; return; }
          if (milking && milking.i === i) return;
          const Z = cfg.zones;
          const bowlSpot = (zone, k) => {
            const left = zone.x < 200;
            return { x: zone.x + (left ? 1 : -1) * cfg.mouthReach * scaleOf(a), y: zone.y + 6 + k * 6, face: left ? -1 : 1 };
          };
          if (a._mode === 'eat' || a._mode === 'drink') {
            const isEat = a._mode === 'eat', key = isEat ? 'feed' : 'water', stat = isEat ? 'fame' : 'sete';
            if (S[key] <= 0 || a[stat] >= 98) { a._mode = 'idle'; a._wait = 0.5; if (S[key] <= 0) popupSvg(isEat ? `${cfg.foodIcon} Finito! Riempi la ${cfg.feedName}!` : '💧 Acqua finita!', (isEat ? Z.feed : Z.water).x, 150); return; }
            a[stat] = clamp(a[stat] + (isEat ? 22 : 28) * dt);
            S[key] = Math.max(0, S[key] - (isEat ? 10 : 12) * dt);
            if (Math.random() < dt * 2) addPart(a._x + a._face * cfg.mouthReach * scaleOf(a) * 0.8, a._y - 30, isEat ? 'hay' : 'drop');
            if (Math.random() < dt * 0.6) Sound.tone(isEat ? 200 : 650, 0.05, 'triangle', 0.04);
            return;
          }
          // cosa fare adesso?
          a._wait -= dt;
          const hungry = a.fame < 75 && S.feed > 2, thirsty = a.sete < 75 && S.water > 2;
          if ((hungry || thirsty) && a._mode !== 'walkEat' && a._mode !== 'walkDrink') {
            const eat = hungry && (!thirsty || a.fame <= a.sete);
            const spot = bowlSpot(eat ? Z.feed : Z.water, i % 2);
            a._tx = spot.x; a._ty = spot.y; a._goFace = spot.face; a._mode = eat ? 'walkEat' : 'walkDrink';
            return;
          }
          if (ball && !ball.held && a._mode !== 'walkEat' && a._mode !== 'walkDrink' && a.energia > 20 && a.gioia < 98) {
            const spd = Math.hypot(ball.vx, ball.vy);
            if (spd > 20 || dist(ball.x, ball.y, a._x, a._y) < 140) { a._tx = ball.x - a._face * 10; a._ty = Math.max(cfg.roam.y0, Math.min(cfg.roam.y1, ball.y)); a._mode = 'play'; }
          }
          if (a._mode === 'idle' && a._wait <= 0) {
            const r = cfg.roam;
            a._tx = U.rand(r.x0, r.x1); a._ty = U.rand(r.y0, r.y1); a._mode = 'walk';
            a._wait = U.rand(2, 5);
          }
        }
        function move(a, dt) {
          if (a._mode === 'sleep' || a._mode === 'eat' || a._mode === 'drink' || a._mode === 'idle') { a._phase += dt * (a._mode === 'idle' ? 1.5 : 6); return; }
          const d = dist(a._x, a._y, a._tx, a._ty);
          const sp = cfg.speed * (a._mode === 'play' ? 1.6 : 1) * (a.energia < 20 ? 0.6 : 1);
          if (d < 4) {
            if (a._mode === 'walkEat') { a._mode = 'eat'; a._face = a._goFace; }
            else if (a._mode === 'walkDrink') { a._mode = 'drink'; a._face = a._goFace; }
            else if (a._mode === 'play') a._mode = 'idle';
            else { a._mode = 'idle'; a._wait = U.rand(1.5, 4); }
            return;
          }
          const k = Math.min(1, sp * dt / d);
          if (Math.abs(a._tx - a._x) > 2) a._face = a._tx > a._x ? 1 : -1;
          a._x += (a._tx - a._x) * k; a._y += (a._ty - a._y) * k;
          a._phase += dt * 10;
        }
        function moveBall(dt) {
          if (!ball || ball.held) return;
          ball.x += ball.vx * dt; ball.y += ball.vy * dt;
          const fr = Math.pow(0.35, dt);
          ball.vx *= fr; ball.vy *= fr;
          if (ball.x < 16) { ball.x = 16; ball.vx = Math.abs(ball.vx); }
          if (ball.x > 384) { ball.x = 384; ball.vx = -Math.abs(ball.vx); }
          if (ball.y < 140) { ball.y = 140; ball.vy = Math.abs(ball.vy); }
          if (ball.y > 240) { ball.y = 240; ball.vy = -Math.abs(ball.vy); }
          // il panda arriva alla palla e la calcia
          S.animals.forEach(a => {
            if (a.sleep || a._mode === 'eat' || a._mode === 'drink') return;
            if (dist(a._x + a._face * 20, a._y, ball.x, ball.y) < 34 && Math.hypot(ball.vx, ball.vy) < 120) {
              const ang = U.rand(-2.6, -0.5) * (Math.random() < 0.5 ? 1 : -1);
              ball.vx = Math.cos(ang) * U.rand(200, 320) * (a._face); ball.vy = Math.sin(ang) * U.rand(80, 160);
              a.gioia = clamp(a.gioia + 7); a.energia = clamp(a.energia - 2);
              care(a, 3);
              a._fx = 'heart'; a._fxUntil = performance.now() + 700; a._mode = 'idle'; a._wait = 0.3;
              addPart(a._x, a._y - 100, 'heart', 2);
              Sound.tone(600, 0.08, 'square', 0.06);
            }
          });
        }

        /* ---------- tempo che passa (statistiche) ---------- */
        let statT = 0;
        function stats(dt) {
          const min = dt / 60;
          S.animals.forEach((a, i) => {
            const k = a.sleep ? 0.4 : 1;
            if (a._mode !== 'eat') a.fame = clamp(a.fame - DECAY.fame * min * k);
            if (a._mode !== 'drink') a.sete = clamp(a.sete - DECAY.sete * min * k);
            a.pulizia = clamp(a.pulizia - (DECAY.pulizia + S.poops.length * 1.5) * min);
            a.gioia = clamp(a.gioia - DECAY.gioia * min * (a.sleep ? 0.3 : 1));
            if (a.sleep) {
              a.energia = clamp(a.energia + 40 * min);
              if (a.energia >= 100) { a.sleep = false; a._mode = 'idle'; popupSvg('Buongiorno! ☀️', a._x, a._y - 100); renderBg(); }
            } else a.energia = clamp(a.energia - DECAY.energia * min);
            const bad = a.fame < 20 || a.sete < 20 || a.pulizia < 25;
            if (a.sick) a.salute = Math.max(5, a.salute - 4 * min);
            else if (bad) a.salute = Math.max(5, a.salute - 2 * min);
            else if (a.fame > 50 && a.sete > 50) a.salute = clamp(a.salute + 2 * min);
            if (!a.sick && (bad || a.salute < 30) && Math.random() < (a.salute < 30 ? 0.5 : 0.25) * min) {
              a.sick = true; Sound.bad();
              popupSvg(`Oh no! ${a.name} sta male! 🤒`, a._x, a._y - 100, 'bad');
            }
            if (cfg.milk && !a.sick && a.fame > 40 && a.sete > 40 && a.milk < 100) {
              a.milk = clamp(a.milk + 10 * min);
              if (a.milk >= 100) popupSvg('🥛 Il latte è pronto!', a._x, a._y - 100, 'gold');
            }
            if (!a.sleep && a.fame > 30) {
              a.poopIn -= dt;
              if (a.poopIn <= 0) { addPoop(i); a.poopIn = U.ri(45, 90); }
            }
          });
        }

        function frame(now) {
          const dt = Math.min(0.1, (now - lastFrame) / 1000);
          lastFrame = now;
          if (running) {
            S.animals.forEach((a, i) => { think(a, i, dt); move(a, dt); });
            moveBall(dt);
            stats(dt);
            statT += dt;
            if (statT > 1) { statT = 0; renderPanel(); renderBowls(); }
          }
          if (hintT && now > hintT) { hintEl.classList.remove('on'); hintT = 0; }
          renderAnimals();
          renderParts(dt);
          if (drag) renderZones();
          raf = requestAnimationFrame(frame);
        }

        renderBg(); renderBowls(); renderPoops(); renderPanel();
        raf = requestAnimationFrame(frame);
        timers.push(setInterval(save, 5000));

        ctx.intro({
          title: cfg.title,
          art: `<span class="emo">${cfg.introArt}</span>`,
          text: firstTime ? cfg.introText : `${cfg.welcomeBack(cur().name)} Ricorda: <b>trascina</b> gli attrezzi dal basso fin dentro la scena! La nuvoletta sopra la testa ti dice cosa serve.`,
          buttons: [{ label: firstTime ? '▶ Cominciamo!' : '▶ Andiamo!' }],
        }, () => { ctx.begin(); running = true; lastFrame = performance.now(); hint(cfg.firstHint, 5000); });

        return { stop() { running = false; cancelAnimationFrame(raf); timers.forEach(clearInterval); if (drag) drag.ghost.remove(); save(); } };
      },
    });
  }

  return { register, clamp };
})();

/* ===================== LA FATTORIA DELLE MUCCHE ===================== */
(() => {
  const clamp = Pets.clamp;
  function cow(a, x, y, s, f, selected, phase, face, mode) {
    const spot = '#222';
    const body = a.sick ? '#e8f5e9' : '#fff';
    const walking = mode && mode.startsWith('walk') || mode === 'play';
    const eating = mode === 'eat' || mode === 'drink';
    const sw = walking ? Math.sin(phase) * 5 : 0;
    const bob = walking ? Math.abs(Math.sin(phase)) * 2 : 0;
    const headDown = eating ? 18 + Math.sin(phase * 1.5) * 2 : 0;
    const tail = Math.sin(phase * (walking ? 1 : 0.8)) * 8;
    const dirty = a.pulizia < 40 ? '<ellipse cx="-20" cy="-30" rx="8" ry="5" fill="#8d5a32" opacity=".7"/><ellipse cx="18" cy="-22" rx="6" ry="4" fill="#8d5a32" opacity=".7"/><ellipse cx="0" cy="-12" rx="5" ry="3" fill="#8d5a32" opacity=".7"/>' : '';
    const sad = a.gioia < 30 || a.fame < 25 || a.sete < 25;
    const blink = !a.sleep && (Math.floor(phase * 3) % 23 === 0);
    const eyes = a.sleep || blink ? '<path d="M38 -72 Q42 -68 46 -72 M52 -72 Q56 -68 60 -72" stroke="#111" stroke-width="2" fill="none"/>'
      : '<circle cx="42" cy="-73" r="3.5" fill="#111"/><circle cx="56" cy="-73" r="3.5" fill="#111"/><circle cx="43" cy="-74" r="1.2" fill="#fff"/><circle cx="57" cy="-74" r="1.2" fill="#fff"/>';
    const chew = eating && Math.sin(phase * 3) > 0;
    const mouth = chew || f === 'eat' ? '<ellipse cx="49" cy="-50" rx="6" ry="4" fill="#7a2b3a"/>' : sad ? '<path d="M44 -50 Q49 -54 54 -50" stroke="#7a2b3a" stroke-width="2" fill="none"/>' : '<path d="M44 -52 Q49 -47 54 -52" stroke="#7a2b3a" stroke-width="2" fill="none"/>';
    const fxs = {
      heart: '<g fill="#ff4d6d">' + [[-10, -86], [16, -100], [36, -92]].map(([cx, cy]) => `<path d="M${cx} ${cy + 6} C${cx - 9} ${cy} ${cx - 6} ${cy - 8} ${cx} ${cy - 3} C${cx + 6} ${cy - 8} ${cx + 9} ${cy} ${cx} ${cy + 6} Z"/>`).join('') + '</g>',
      med: '<g transform="translate(60 -84)"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="#fff" stroke="#e63946" stroke-width="2"/><path d="M0 -5 L0 5 M-5 0 L5 0" stroke="#e63946" stroke-width="3"/></g>',
    };
    const legs = [[-34, sw], [-18, -sw], [16, sw], [32, -sw]];
    const lying = a.sleep;
    return `<g transform="translate(${x} ${y - bob}) scale(${s * face} ${s})">
      ${selected ? '<ellipse cx="0" cy="2" rx="60" ry="10" fill="#ffd23f" opacity=".6"/>' : ''}
      <ellipse cx="0" cy="2" rx="52" ry="7" fill="rgba(0,0,0,.2)"/>
      <g transform="rotate(${tail} -46 -40)"><path d="M-46 -40 Q-62 -30 -58 -6" stroke="${body}" stroke-width="5" fill="none"/><path d="M-60 -8 L-56 2 L-52 -8 Z" fill="${spot}"/></g>
      ${lying ? '' : legs.map(([lx, o]) => `<g transform="rotate(${o} ${lx} -24)"><rect x="${lx - 5}" y="-26" width="10" height="26" fill="${body}" stroke="#333" stroke-width="1"/><rect x="${lx - 5}" y="-6" width="10" height="6" fill="#333"/></g>`).join('')}
      <g transform="translate(0 ${lying ? 18 : 0})">
      <ellipse cx="0" cy="-36" rx="48" ry="24" fill="${body}" stroke="#333" stroke-width="1.5"/>
      <path d="M-30 -52 Q-18 -56 -14 -44 Q-24 -34 -34 -42 Z M2 -50 Q14 -58 20 -46 Q12 -36 4 -42 Z M-8 -28 Q2 -32 6 -24 Q-2 -18 -8 -22 Z" fill="${spot}"/>
      <ellipse cx="-4" cy="-14" rx="10" ry="6" fill="#ffc2d1" stroke="#e98aa3"/>
      ${dirty}
      <g transform="translate(0 ${headDown}) rotate(${eating ? 14 : 0} 30 -60)">
      <path d="M34 -84 L28 -96 L38 -88 Z M64 -84 L70 -96 L60 -88 Z" fill="#f4e3c1" stroke="#999"/>
      <ellipse cx="30" cy="-78" rx="10" ry="5" fill="${body}" stroke="#333" transform="rotate(${-20 + Math.sin(phase) * 6} 30 -78)"/><ellipse cx="68" cy="-78" rx="10" ry="5" fill="${body}" stroke="#333" transform="rotate(20 68 -78)"/>
      <ellipse cx="49" cy="-68" rx="20" ry="22" fill="${body}" stroke="#333" stroke-width="1.5"/><path d="M40 -86 Q49 -92 58 -86 Q52 -78 44 -80 Z" fill="${spot}"/>
      <ellipse cx="49" cy="-52" rx="15" ry="10" fill="#ffb3c6" stroke="#333" stroke-width="1"/><circle cx="44" cy="-53" r="2" fill="#7a2b3a"/><circle cx="54" cy="-53" r="2" fill="#7a2b3a"/>
      ${eyes}${mouth}
      ${a.sick ? '<path d="M56 -48 L70 -40" stroke="#e63946" stroke-width="3"/><circle cx="70" cy="-40" r="2.5" fill="#e63946"/><circle cx="36" cy="-62" r="4" fill="#80ed99" opacity=".7"/><circle cx="62" cy="-62" r="4" fill="#80ed99" opacity=".7"/>' : ''}
      <path d="M49 -46 L49 -40" stroke="#c99a00" stroke-width="2"/><path d="M44 -40 L54 -40 L52 -32 L46 -32 Z" fill="#ffd23f" stroke="#c99a00"/>
      </g></g>
      ${f && fxs[f] ? fxs[f] : ''}
    </g>`;
  }

  const farmBg = night => (night
    ? '<rect width="400" height="250" fill="#1d1e4f"/>' + Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${(i * 29) % 100 + 8}" r="1.5" fill="#fff"/>`).join('') + '<circle cx="340" cy="40" r="18" fill="#fff3b0"/>'
    : '<rect width="400" height="250" fill="#8fd3ff"/><circle cx="340" cy="40" r="20" fill="#ffd23f"/><ellipse cx="80" cy="40" rx="26" ry="10" fill="#fff"/><ellipse cx="220" cy="30" rx="30" ry="10" fill="#fff"/>') +
    `<ellipse cx="90" cy="150" rx="160" ry="50" fill="${night ? '#2d6a4f' : '#80ed99'}"/><ellipse cx="320" cy="150" rx="140" ry="40" fill="${night ? '#1b4332' : '#57cc99'}"/><rect y="140" width="400" height="110" fill="${night ? '#2d6a4f' : '#7ac74f'}"/>` +
    '<path d="M4 140 L4 70 L44 40 L84 70 L84 140 Z" fill="#c1121f" stroke="#fff" stroke-width="3"/><rect x="30" y="94" width="28" height="46" fill="#fff"/><path d="M30 94 L58 140 M58 94 L30 140" stroke="#c1121f" stroke-width="3"/>' +
    Array.from({ length: 10 }, (_, i) => `<rect x="${100 + i * 30}" y="122" width="6" height="26" fill="#a0703c"/>`).join('') + '<rect x="96" y="128" width="304" height="5" fill="#a0703c"/><rect x="96" y="140" width="304" height="5" fill="#a0703c"/>';
  // mangiatoia (sinistra) e abbeveratoio (destra), con il livello che cala
  const farmBowls = (feed, water) =>
    `<g transform="translate(40 214)"><rect x="-30" y="-8" width="60" height="22" rx="4" fill="#8d5a32" stroke="#5a3418" stroke-width="2"/><rect x="-26" y="-4" width="52" height="10" fill="#5a3418"/>${feed > 0 ? `<path d="M-26 ${6 - feed / 100 * 16} Q-13 ${-2 - feed / 100 * 18} 0 ${6 - feed / 100 * 16} Q13 ${-2 - feed / 100 * 18} 26 ${6 - feed / 100 * 16} L26 6 L-26 6 Z" fill="#e9c46a" stroke="#c99a00"/>` : ''}<rect x="-34" y="14" width="8" height="10" fill="#5a3418"/><rect x="26" y="14" width="8" height="10" fill="#5a3418"/></g>` +
    `<g transform="translate(360 216)"><rect x="-32" y="-10" width="64" height="24" rx="6" fill="#8d99ae" stroke="#495057" stroke-width="2"/><rect x="-28" y="${-6 + (1 - water / 100) * 14}" width="56" height="${water / 100 * 14}" fill="#4dd0ff"/><path d="M-28 -6 L28 -6" stroke="#495057" stroke-width="1"/></g>`;

  const rubCare = (stat, amount, part, pts) => (a, g) => { a[stat] = clamp(a[stat] + amount); g.part(part); if (Math.random() < 0.35) g.care(pts); };

  Pets.register({
    id: 'mucche',
    title: 'La Fattoria delle Mucche',
    desc: 'Prenditi cura delle tue mucche con le dita: trascina il fieno, versa l’acqua, spazzolale, coccolale e mungile per guadagnare monete!',
    color: '#7ac74f',
    save: 'cg_pet_cows',
    icon: '🐄',
    single: 'mucca',
    plural: 'mucche',
    art: () => '<span class="emo">🐄</span><span class="emo">🥛</span>',
    introArt: '🐄🌾🥛',
    introText: 'Benvenuto nella tua fattoria! Hai una mucca di nome <b>Margherita</b>. In basso ci sono gli attrezzi: <b>trascinali col dito</b> nella scena! 🌾 Il fieno va nella mangiatoia, 💧 l’acqua nell’abbeveratoio: le mucche ci andranno da sole. 🧽 Strofina la spazzola sulla mucca, ✋ accarezzala, 🪣 porta il secchio sotto la mucca e mungi muovendo il dito su e giù. 🧹 Spazza via le cacche! Con 60 🪙 compri un’altra mucca.',
    welcomeBack: n => `Bentornato in fattoria! ${n} ti stava aspettando! 🐄`,
    firstHint: '👇 Trascina il 🌾 fieno nella mangiatoia a sinistra!',
    names: ['Margherita', 'Rosina', 'Bianchina', 'Stellina'],
    buy: 60,
    milk: true,
    voice: 'Muuuu! 🐄',
    voiceFreq: 140,
    foodIcon: '🌾',
    feedName: 'mangiatoia',
    roam: { x0: 110, x1: 300, y0: 176, y1: 232 },
    zones: { feed: { x: 40, y: 214, r: 34 }, water: { x: 360, y: 216, r: 36 } },
    mouthReach: 66,
    hit: { w: 60, h: 100 },
    udder: { x: -4, y: -14 },
    speed: 40,
    scale: () => 0.8,
    bg: farmBg,
    bowls: farmBowls,
    draw: cow,
    tools: [
      { id: 'fieno', icon: '🌾', label: 'Fieno', kind: 'feed', tip: 'Porta il fieno nella mangiatoia di legno a sinistra!', miss: 'Il fieno va nella mangiatoia di legno, a sinistra! 🌾', full: 'La mangiatoia è già piena!', done: '🌾 Mangiatoia piena!', need: (a, S) => S.feed < 15 },
      { id: 'acqua', icon: '🪣', label: 'Acqua', kind: 'water', tip: 'Versa l’acqua nell’abbeveratoio grigio a destra!', miss: 'L’acqua va nell’abbeveratoio grigio, a destra! 💧', full: 'L’abbeveratoio è già pieno!', done: '💧 Splash! Acqua fresca!', need: (a, S) => S.water < 15 },
      { id: 'spazzola', icon: '🧽', label: 'Spazzola', kind: 'rub', fx: 'wash', freq: 1000, tip: 'Strofina la spazzola avanti e indietro sulla mucca!', rub: rubCare('pulizia', 5, 'bubble', 1), need: a => a.pulizia < 35 },
      { id: 'coccole', icon: '✋', label: 'Coccole', kind: 'rub', fx: 'heart', freq: 300, tip: 'Accarezza la mucca muovendo il dito sopra di lei!', rub: rubCare('gioia', 5, 'heart', 1), need: a => a.gioia < 35 },
      { id: 'secchio', icon: '🥛', label: (a) => `Mungi ${Math.floor(a.milk)}%`, kind: 'milk', tip: 'Porta il secchio sulla mucca che ha il latte pronto!', miss: 'Porta il secchio sopra una mucca! 🐄', need: a => a.milk >= 100 },
      { id: 'nanna', icon: '🌙', label: 'Nanna', kind: 'drop', tip: 'Porta la luna sulla mucca per farla dormire (o per svegliarla)!', miss: 'Porta la luna sopra una mucca!', need: a => a.energia < 25 && !a.sleep, drop: (a, g) => { if (a.sleep) { a.sleep = false; a._mode = 'idle'; g.popup('Buongiorno! ☀️'); return; } if (a.energia > 85) return g.popup('Non ha sonno!'); a.sleep = true; a._mode = 'sleep'; g.popup('Buonanotte... 😴'); g.care(3); } },
      { id: 'medicina', icon: '💊', label: 'Medicina', kind: 'drop', tip: 'Porta la medicina sulla mucca malata!', miss: 'Porta la medicina sopra la mucca!', need: a => a.sick, drop: (a, g) => { if (!a.sick) return g.popup('Sta benissimo! 💪'); a.sick = false; a.salute = clamp(a.salute + 40); g.fx('med'); g.popup('💊 Guarita!', 'gold'); Sound.win(); g.care(15); } },
      { id: 'scopa', icon: '🧹', label: 'Pulisci', kind: 'sweep', tip: 'Passa la scopa sopra le cacche!', need: (a, S) => S.poops.length > 0 },
    ],
  });
})();

/* ===================== IL MIO PANDA ===================== */
(() => {
  const clamp = Pets.clamp;
  const LEVELS = [[0, '🍼 Cucciolo'], [250, '🐼 Panda giovane'], [700, '🎋 Panda grande'], [1500, '👑 Re dei Panda']];
  const level = a => {
    let i = 0;
    while (i + 1 < LEVELS.length && a.xp >= LEVELS[i + 1][0]) i++;
    return { idx: i, label: LEVELS[i][1], next: LEVELS[i + 1] ? LEVELS[i + 1][0] : null };
  };

  function panda(a, x, y, s, f, selected, phase, face, mode) {
    const L = level(a).idx;
    const walking = mode && mode.startsWith('walk') || mode === 'play';
    const eating = mode === 'eat' || mode === 'drink';
    const bob = walking ? Math.abs(Math.sin(phase)) * 4 : Math.sin(phase) * 1;
    const tilt = walking ? Math.sin(phase) * 5 : 0;
    const dirty = a.pulizia < 40 ? '<ellipse cx="-16" cy="-30" rx="7" ry="4" fill="#8d5a32" opacity=".6"/><ellipse cx="14" cy="-40" rx="6" ry="4" fill="#8d5a32" opacity=".6"/><ellipse cx="22" cy="-82" rx="5" ry="3" fill="#8d5a32" opacity=".6"/>' : '';
    const sad = a.gioia < 30 || a.fame < 25 || a.sete < 25;
    const white = a.sick ? '#e8f5e9' : '#fff';
    const blink = !a.sleep && (Math.floor(phase * 3) % 23 === 0);
    const eyes = a.sleep || blink ? '<path d="M-16 -82 Q-12 -78 -8 -82 M8 -82 Q12 -78 16 -82" stroke="#fff" stroke-width="2" fill="none"/>'
      : '<circle cx="-12" cy="-83" r="4" fill="#fff"/><circle cx="12" cy="-83" r="4" fill="#fff"/><circle cx="-11" cy="-83" r="2.2" fill="#111"/><circle cx="13" cy="-83" r="2.2" fill="#111"/>';
    const chew = eating && Math.sin(phase * 3) > 0;
    const mouth = chew ? '<ellipse cx="0" cy="-64" rx="5" ry="4" fill="#7a2b3a"/>' : sad ? '<path d="M-5 -63 Q0 -67 5 -63" stroke="#333" stroke-width="2" fill="none"/>' : '<path d="M-5 -66 Q0 -61 5 -66" stroke="#333" stroke-width="2" fill="none"/>';
    const holding = mode === 'eat' ? `<g transform="translate(22 -52) rotate(${-30 + Math.sin(phase * 3) * 8})"><rect x="-3" y="-44" width="6" height="54" fill="#80b918"/><path d="M-3 -26 L3 -26 M-3 -8 L3 -8" stroke="#55a630" stroke-width="2"/><path d="M3 -40 Q16 -48 22 -40 Q12 -38 3 -36 Z" fill="#55a630"/></g>` : '';
    const fxs = {
      heart: '<g fill="#ff4d6d">' + [[-26, -110], [0, -124], [26, -110]].map(([cx, cy]) => `<path d="M${cx} ${cy + 6} C${cx - 9} ${cy} ${cx - 6} ${cy - 8} ${cx} ${cy - 3} C${cx + 6} ${cy - 8} ${cx + 9} ${cy} ${cx} ${cy + 6} Z"/>`).join('') + '</g>',
      med: '<g transform="translate(34 -100)"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="#fff" stroke="#e63946" stroke-width="2"/><path d="M0 -5 L0 5 M-5 0 L5 0" stroke="#e63946" stroke-width="3"/></g>',
    };
    const crown = L >= 3 ? '<path d="M-14 -108 L-12 -122 L-5 -114 L0 -126 L5 -114 L12 -122 L14 -108 Z" fill="#ffd23f" stroke="#c99a00"/>' : L >= 2 ? '<g transform="translate(20 -106)"><path d="M0 0 L-10 -6 L-10 6 Z M0 0 L10 -6 L10 6 Z" fill="#ff4d6d"/><circle r="3" fill="#ff4d6d"/></g>' : '';
    const legSw = walking ? Math.sin(phase) * 6 : 0;
    return `<g transform="translate(${x} ${y - bob}) scale(${s * face} ${s}) rotate(${tilt} 0 -40)">
      ${selected ? '<ellipse cx="0" cy="2" rx="48" ry="9" fill="#ffd23f" opacity=".6"/>' : ''}
      <ellipse cx="0" cy="2" rx="44" ry="7" fill="rgba(0,0,0,.2)"/>
      <ellipse cx="${-22 + legSw}" cy="-8" rx="14" ry="10" fill="#111"/><ellipse cx="${22 - legSw}" cy="-8" rx="14" ry="10" fill="#111"/>
      <ellipse cx="0" cy="-30" rx="34" ry="30" fill="${white}" stroke="#333" stroke-width="1.5"/>
      <path d="M-34 -40 Q-50 -30 -40 -14 Q-30 -18 -26 -34 Z" fill="#111" transform="rotate(${walking ? Math.sin(phase) * 15 : 0} -30 -40)"/>
      <path d="M34 -40 Q50 -30 40 -14 Q30 -18 26 -34 Z" fill="#111" transform="rotate(${walking ? -Math.sin(phase) * 15 : eating ? -40 : 0} 30 -40)"/>
      <path d="M-30 -52 Q0 -62 30 -52 L30 -44 Q0 -54 -30 -44 Z" fill="#111"/>
      ${dirty}
      <circle cx="-24" cy="-104" r="11" fill="#111"/><circle cx="24" cy="-104" r="11" fill="#111"/>
      <ellipse cx="0" cy="-80" rx="32" ry="28" fill="${white}" stroke="#333" stroke-width="1.5"/>
      <ellipse cx="-12" cy="-82" rx="9" ry="11" fill="#111" transform="rotate(20 -12 -82)"/><ellipse cx="12" cy="-82" rx="9" ry="11" fill="#111" transform="rotate(-20 12 -82)"/>
      ${eyes}<ellipse cx="0" cy="-70" rx="5" ry="3.5" fill="#111"/>${mouth}
      <circle cx="-20" cy="-68" r="4" fill="#ff8fab" opacity=".6"/><circle cx="20" cy="-68" r="4" fill="#ff8fab" opacity=".6"/>
      ${a.sick ? '<path d="M6 -62 L20 -54" stroke="#e63946" stroke-width="3"/><circle cx="20" cy="-54" r="2.5" fill="#e63946"/>' : ''}
      ${crown}${holding}
      ${f && fxs[f] ? fxs[f] : ''}
    </g>`;
  }

  const bambooBg = night => (night
    ? '<rect width="400" height="250" fill="#1d1e4f"/>' + Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${(i * 29) % 100 + 8}" r="1.5" fill="#fff"/>`).join('') + '<circle cx="200" cy="40" r="18" fill="#fff3b0"/>'
    : '<rect width="400" height="250" fill="#c7f9cc"/><circle cx="200" cy="36" r="20" fill="#ffd23f"/>') +
    `<path d="M0 120 Q100 90 200 120 T400 110 L400 250 L0 250 Z" fill="${night ? '#1b4332' : '#95d5b2'}"/><rect y="160" width="400" height="90" fill="${night ? '#2d6a4f' : '#74c69d'}"/>` +
    [16, 40, 340, 364, 388].map((x, i) => `<rect x="${x}" y="${20 + (i % 2) * 20}" width="10" height="${150 - (i % 2) * 20}" fill="#55a630"/>` + [60, 100, 140].map(yy => `<rect x="${x - 1}" y="${yy}" width="12" height="3" fill="#2b9348"/>`).join('') + `<path d="M${x + 10} ${60 + i * 6} Q${x + 30} ${50 + i * 6} ${x + 36} ${62 + i * 6} Q${x + 24} ${62 + i * 6} ${x + 10} ${66 + i * 6} Z" fill="#80b918"/>`).join('');
  // cesto del bambù (sinistra) e ciotola dell'acqua (destra)
  const pandaBowls = (feed, water) =>
    `<g transform="translate(50 222)"><path d="M-30 -10 L30 -10 L24 12 L-24 12 Z" fill="#c47a2c" stroke="#8d5a32" stroke-width="2"/><path d="M-28 -2 L28 -2 M-26 6 L26 6" stroke="#8d5a32" stroke-width="1.5"/>${Array.from({ length: Math.ceil(feed / 20) }, (_, i) => `<rect x="${-20 + i * 9}" y="${-30 - (i % 2) * 6}" width="5" height="26" fill="#80b918" transform="rotate(${-10 + i * 5} ${-18 + i * 9} -10)"/>`).join('')}</g>` +
    `<g transform="translate(352 224)"><ellipse rx="34" ry="11" fill="#adb5bd" stroke="#6c757d" stroke-width="2"/><ellipse rx="28" ry="${Math.max(0.5, water / 100 * 7)}" fill="#4dd0ff"/></g>`;

  const rubCare = (stat, amount, part, pts) => (a, g) => { a[stat] = clamp(a[stat] + amount); g.part(part); if (Math.random() < 0.35) g.care(pts); };

  Pets.register({
    id: 'panda',
    title: 'Il Mio Panda',
    desc: 'Un cucciolo di panda tutto tuo! Dagli il bambù, fagli il bagnetto, lanciagli la palla e mettilo a nanna: crescerà fino a diventare il Re dei Panda!',
    color: '#2b2d42',
    save: 'cg_pet_panda',
    icon: '🐼',
    single: 'panda',
    plural: 'panda',
    art: () => '<span class="emo">🐼</span><span class="emo">🎋</span>',
    introArt: '🐼🎋⚽',
    introText: 'Ecco il tuo cucciolo di panda: si chiama <b>Bambù</b>! 🐼 In basso ci sono gli attrezzi: <b>trascinali col dito</b> nella scena! 🎋 Il bambù va nel cesto, 💧 l’acqua nella ciotola: il panda ci andrà da solo. 🧽 Strofina la spugna per il bagnetto, ✋ accarezzalo, e ⚽ <b>lancia la palla</b> con un colpo di dito: lui la rincorre! Più te ne prendi cura, più cresce fino a diventare il <b>Re dei Panda</b>! 👑',
    welcomeBack: n => `${n} è contentissimo di rivederti! 🐼`,
    firstHint: '👇 Trascina il 🎋 bambù nel cesto a sinistra!',
    names: ['Bambù'],
    buy: null,
    ball: true,
    voice: 'Squiii! 🐼💕',
    voiceFreq: 700,
    foodIcon: '🎋',
    feedName: 'cesta del bambù',
    roam: { x0: 110, x1: 290, y0: 190, y1: 236 },
    zones: { feed: { x: 50, y: 216, r: 34 }, water: { x: 352, y: 224, r: 36 } },
    mouthReach: 52,
    hit: { w: 44, h: 128 },
    speed: 50,
    scale: a => [0.8, 0.9, 1, 1.08][level(a).idx],
    level,
    bg: bambooBg,
    bowls: pandaBowls,
    draw: panda,
    tools: [
      { id: 'bambu', icon: '🎋', label: 'Bambù', kind: 'feed', tip: 'Porta il bambù nel cesto a sinistra!', miss: 'Il bambù va nel cesto, a sinistra! 🎋', full: 'Il cesto è già pieno!', done: '🎋 Cesto pieno!', need: (a, S) => S.feed < 15 },
      { id: 'acqua', icon: '💧', label: 'Acqua', kind: 'water', tip: 'Versa l’acqua nella ciotola a destra!', miss: 'L’acqua va nella ciotola, a destra! 💧', full: 'La ciotola è già piena!', done: '💧 Acqua fresca!', need: (a, S) => S.water < 15 },
      { id: 'spugna', icon: '🧽', label: 'Bagnetto', kind: 'rub', fx: 'wash', freq: 1000, tip: 'Strofina la spugna sul panda per fargli il bagnetto!', rub: rubCare('pulizia', 5, 'bubble', 1), need: a => a.pulizia < 35 },
      { id: 'coccole', icon: '✋', label: 'Coccole', kind: 'rub', fx: 'heart', freq: 800, tip: 'Accarezza il panda muovendo il dito sopra di lui!', rub: rubCare('gioia', 4, 'heart', 1), need: a => a.gioia < 35 },
      { id: 'nanna', icon: '🌙', label: 'Nanna', kind: 'drop', tip: 'Porta la luna sul panda per farlo dormire (o per svegliarlo)!', miss: 'Porta la luna sopra il panda!', need: a => a.energia < 25 && !a.sleep, drop: (a, g) => { if (a.sleep) { a.sleep = false; a._mode = 'idle'; g.popup('Buongiorno! ☀️'); return; } if (a.energia > 85) return g.popup('Non ha sonno!'); a.sleep = true; a._mode = 'sleep'; g.popup('Ninna nanna... 🌙'); g.care(3); } },
      { id: 'medicina', icon: '🩺', label: 'Dottore', kind: 'drop', tip: 'Porta lo stetoscopio sul panda malato!', miss: 'Porta il dottore sopra il panda!', need: a => a.sick, drop: (a, g) => { if (!a.sick) return g.popup('Sta benissimo! 💪'); a.sick = false; a.salute = clamp(a.salute + 40); g.fx('med'); g.popup('🩺 Guarito! Evviva!', 'gold'); Sound.win(); g.care(15); } },
      { id: 'scopa', icon: '🧹', label: 'Pulisci', kind: 'sweep', tip: 'Passa la scopa sopra le cacche!', need: (a, S) => S.poops.length > 0 },
    ],
  });
})();
