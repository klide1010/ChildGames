'use strict';
/*
 * Giochi "tipo Tamagotchi": La Fattoria delle Mucche e Il Mio Panda.
 * Gli animali hanno fame, sete, bisogno di pulizia, di giocare e di dormire; se trascurati si ammalano
 * (ma non muoiono mai: basta curarli). Lo stato è salvato sul telefono e "va avanti" piano anche quando
 * il gioco è chiuso, senza però far stare male gli animali mentre i bambini non ci sono.
 */
const Pets = (() => {
  const STATS = [
    { k: 'fame', icon: '🍀', label: 'Pancia', color: '#2ec27e' },
    { k: 'sete', icon: '💧', label: 'Acqua', color: '#3a86ff' },
    { k: 'pulizia', icon: '🧼', label: 'Pulizia', color: '#c084fc' },
    { k: 'gioia', icon: '❤️', label: 'Felicità', color: '#ff4d6d' },
    { k: 'energia', icon: '⚡', label: 'Energia', color: '#ffb703' },
    { k: 'salute', icon: '🩺', label: 'Salute', color: '#06d6a0' },
  ];
  // calo al minuto mentre si gioca
  const DECAY = { fame: 6, sete: 8, pulizia: 3, gioia: 4, energia: 3 };
  const clamp = v => Math.max(0, Math.min(100, v));

  function newAnimal(name) {
    return { name, fame: 80, sete: 80, pulizia: 90, gioia: 80, energia: 90, salute: 100, sick: false, sleep: false, milk: 0, xp: 0, poopIn: 50 };
  }

  // il bisogno più urgente, per la nuvoletta sopra l'animale
  function need(a) {
    if (a.sick) return '🤒';
    if (a.sleep) return '';
    const list = [['fame', a.fame, '🍽️'], ['sete', a.sete, '💧'], ['energia', a.energia, '😴'], ['pulizia', a.pulizia, '🧼'], ['gioia', a.gioia, '🎈']];
    const worst = list.sort((x, y) => x[1] - y[1])[0];
    return worst[1] < 35 ? worst[2] : '';
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
        if (!S) S = { animals: [newAnimal(cfg.names[0])], coins: 0, poops: [], last: Date.now(), sel: 0, days: 0 };
        let timers = [], game = null, fx = {};
        let lastTick = performance.now();

        /* ---------- tempo passato mentre il gioco era chiuso ---------- */
        (function catchUp() {
          const min = Math.min(720, (Date.now() - (S.last || Date.now())) / 60000);
          if (min < 1) return;
          S.animals.forEach(a => {
            for (const k of ['fame', 'sete', 'pulizia', 'gioia']) a[k] = Math.max(Math.min(a[k], 25), a[k] - DECAY[k] * min * 0.25);
            a.energia = clamp(a.energia + min * 2);
            a.sleep = false;
            if (cfg.milk) a.milk = clamp(a.milk + min * 3);
          });
          for (let i = 0; i < Math.min(3, Math.floor(min / 30)); i++) addPoop(U.pick(S.animals.map((_, i) => i)));
        })();

        /* ---------- interfaccia ---------- */
        const box = U.el('div', 'pet', `
          <div class="pet-scene"><div class="pet-svg"></div></div>
          <div class="pet-tabs"></div>
          <div class="pet-card"><div class="pet-name"></div><div class="pet-bars"></div></div>
          <div class="pet-actions"></div>
          <div class="pet-bottom">${cfg.buy ? '<button class="btn alt" data-b="buy"></button>' : '<span class="pet-level"></span>'}<button class="btn" data-b="save">💾 Salva ed esci</button></div>`);
        ctx.stage.appendChild(box);
        const svgBox = box.querySelector('.pet-svg');
        const tabs = box.querySelector('.pet-tabs');
        const nameEl = box.querySelector('.pet-name');
        const bars = box.querySelector('.pet-bars');
        const actionsEl = box.querySelector('.pet-actions');

        const cur = () => S.animals[S.sel] || S.animals[0];
        const save = () => { S.last = Date.now(); Store.set(cfg.save, S); };

        function addPoop(i) {
          if (S.poops.length >= 6) return;
          const pos = cfg.slots[i] || cfg.slots[0];
          S.poops.push({ x: Math.max(20, Math.min(380, pos[0] + U.ri(-70, 70))), y: Math.max(196, Math.min(238, pos[1] + U.ri(5, 32))), id: Date.now() + Math.random() });
        }

        function popupAt(text, i, cls = '') {
          const pos = cfg.slots[i] || cfg.slots[0];
          const r = svgBox.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
          ctx.popup(text, r.left - s.left + pos[0] / 400 * r.width, r.top - s.top + (pos[1] - 110 * (cfg.scale ? cfg.scale(S.animals[i] || cur()) : 1)) / 250 * r.height, cls);
        }

        /* ---------- disegno ---------- */
        function renderScene() {
          const sleeping = S.animals.some(a => a.sleep) && S.animals.every(a => a.sleep);
          let s = cfg.bg(sleeping);
          S.poops.forEach(p => { s += `<g class="poop" data-poop="${p.id}" transform="translate(${p.x} ${p.y})"><path d="M-10 0 Q-12 -8 -4 -8 Q-6 -16 2 -14 Q8 -20 8 -10 Q14 -8 10 0 Z" fill="#7a4a22" stroke="#4a2c12" stroke-width="1.5"/><circle cx="-2" cy="-6" r="1.5" fill="#fff"/><circle cx="4" cy="-6" r="1.5" fill="#fff"/><path d="M-4 -24 Q-2 -28 0 -24 M4 -26 Q6 -30 8 -26" stroke="#8d9a5b" stroke-width="1.5" fill="none"/><rect x="-16" y="-34" width="32" height="38" fill="transparent"/></g>`; });
          S.animals.forEach((a, i) => {
            const [x, y] = cfg.slots[i];
            const sc = cfg.scale ? cfg.scale(a) : 1;
            const f = fx[i] && fx[i].until > performance.now() ? fx[i].type : null;
            s += `<g class="pet-animal" data-i="${i}">${cfg.draw(a, x, y, sc, f, i === S.sel && S.animals.length > 1)}`;
            const n = need(a);
            if (n) s += `<g transform="translate(${x + 34 * sc} ${y - 120 * sc})"><path d="M-18 -16 Q-20 -34 0 -34 Q20 -34 18 -16 Q18 0 0 0 L-8 8 L-6 0 Q-18 0 -18 -16 Z" fill="#fff" stroke="#555" stroke-width="1.5"/><text x="0" y="-11" font-size="16" text-anchor="middle">${n}</text></g>`;
            if (a.sleep) s += `<text x="${x + 30 * sc}" y="${y - 100 * sc}" font-size="${20 * sc}" fill="#fff" font-weight="800" class="pet-zzz">Z z z</text>`;
            s += '</g>';
          });
          if (game) s += `<g class="pet-ball" transform="translate(${game.x} ${game.y})"><circle r="16" fill="#ff4d6d" stroke="#fff" stroke-width="3"/><path d="M-16 0 Q0 -10 16 0 M-16 0 Q0 10 16 0" stroke="#fff" stroke-width="2" fill="none"/><circle r="24" fill="transparent"/></g>`;
          svgBox.innerHTML = `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
        }

        function renderPanel() {
          const a = cur();
          nameEl.innerHTML = `${cfg.icon} <b>${U.esc(a.name)}</b>${a.sick ? ' · 🤒 malata' : a.sleep ? ' · 😴 dorme' : ''}${cfg.level ? ` · ${cfg.level(a).label}` : ''}`;
          bars.innerHTML = STATS.map(t => `<div class="pet-bar ${a[t.k] < 25 ? 'low' : ''}"><span>${t.icon}</span><i><b style="width:${Math.round(a[t.k])}%;background:${t.color}"></b></i></div>`).join('') +
            (cfg.milk ? `<div class="pet-bar milk"><span>🥛</span><i><b style="width:${Math.round(a.milk)}%;background:#fff"></b></i></div>` : '');
          tabs.innerHTML = '';
          if (S.animals.length > 1) S.animals.forEach((x, i) => {
            const b = U.el('button', 'pet-tab' + (i === S.sel ? ' on' : ''), `${x.sick ? '🤒' : need(x) || cfg.icon} ${U.esc(x.name)}`);
            b.onclick = () => { S.sel = i; Sound.pop(); renderAll(); };
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
        }

        function renderActions() {
          actionsEl.innerHTML = '';
          cfg.actions.forEach(act => {
            const b = U.el('button', 'pet-act', `<span>${act.icon}</span><small>${typeof act.label === 'function' ? act.label(cur()) : act.label}</small>`);
            b.onclick = () => doAction(act);
            actionsEl.appendChild(b);
          });
        }
        const renderAll = () => { renderScene(); renderPanel(); renderActions(); };

        /* ---------- azioni ---------- */
        const cool = {};
        function care(a, pts) {
          ctx.add(pts);
          a.xp += pts;
          if (cfg.level) {
            const before = cfg.level({ xp: a.xp - pts }).label, after = cfg.level(a).label;
            if (before !== after) { Sound.win(); popupAt(`🎉 ${after}!`, S.sel, 'gold'); }
          }
        }
        function doAction(act) {
          const a = cur(), i = S.sel;
          const key = i + act.id;
          if (cool[key] && cool[key] > performance.now()) return;
          cool[key] = performance.now() + 900;
          if (a.sleep && act.id !== 'nanna') { Sound.tone(300, 0.1, 'sine', 0.05); return popupAt('Shhh! 😴 Sta dormendo...', i); }
          const r = act.run(a, { S, i, popup: (t, c) => popupAt(t, i, c), fx: type => { fx[i] = { type, until: performance.now() + 1400 }; }, care: pts => care(a, pts), startGame });
          if (r === false) Sound.tone(220, 0.1, 'sawtooth', 0.04);
          save();
          renderAll();
        }

        function startGame() {
          game = { hits: 0, until: performance.now() + 9000, x: U.ri(60, 340), y: U.ri(60, 180) };
          popupAt('Prendi la palla! 5 tocchi! ⚽', S.sel, 'gold');
          renderScene();
        }

        /* ---------- tocchi sulla scena ---------- */
        svgBox.addEventListener('click', ev => {
          const p = ev.target.closest('[data-poop]');
          if (p) {
            S.poops = S.poops.filter(x => String(x.id) !== p.dataset.poop);
            ctx.add(3);
            Sound.pop();
            const r = p.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
            ctx.popup('✨ Pulito! +3', r.left - s.left + r.width / 2, r.top - s.top, '');
            save(); renderAll();
            return;
          }
          if (ev.target.closest('.pet-ball') && game) {
            game.hits++;
            Sound.tone(500 + game.hits * 80, 0.08, 'square', 0.06);
            if (game.hits >= 5) {
              const a = cur();
              a.gioia = clamp(a.gioia + 35); a.energia = clamp(a.energia - 8);
              care(a, 15);
              game = null;
              fx[S.sel] = { type: 'heart', until: performance.now() + 1400 };
              popupAt('Che divertimento! ❤️ +35', S.sel, 'gold');
              Sound.good();
              save(); renderAll();
            } else {
              game.x = U.ri(40, 360); game.y = U.ri(50, 190);
              renderScene();
            }
            return;
          }
          const an = ev.target.closest('.pet-animal');
          if (an) {
            const i = +an.dataset.i;
            if (i !== S.sel) { S.sel = i; Sound.pop(); renderAll(); return; }
            const a = cur();
            if (a.sleep) return popupAt('Zzz... 😴', i);
            Sound.tone(cfg.voiceFreq, 0.25, 'triangle', 0.12);
            popupAt(cfg.voice, i);
            a.gioia = clamp(a.gioia + 2);
            renderPanel();
          }
        });

        box.querySelector('.pet-bottom').addEventListener('click', ev => {
          const b = ev.target.closest('[data-b]');
          if (!b) return;
          if (b.dataset.b === 'buy') {
            if (S.animals.length >= cfg.names.length) return;
            if (S.coins < cfg.buy) { Sound.bad(); return popupAt(`Servono ${cfg.buy} 🪙! Mungi le mucche e vendi il latte.`, S.sel, 'bad'); }
            S.coins -= cfg.buy;
            S.animals.push(newAnimal(cfg.names[S.animals.length]));
            S.sel = S.animals.length - 1;
            ctx.add(30);
            Sound.win();
            save(); renderAll();
            popupAt(`Benvenuta ${cur().name}! 🎉`, S.sel, 'gold');
          }
          if (b.dataset.b === 'save') {
            save();
            const a = cur();
            ctx.end({
              title: `A presto, ${U.esc(a.name)}! 👋`,
              msg: `${S.animals.map(x => `${cfg.icon} ${U.esc(x.name)}: ${x.sick ? 'malata 🤒' : need(x) ? 'ha bisogno di ' + need(x) : 'felice 😊'}`).join('<br>')}${cfg.milk ? `<br>🪙 Monete: <b>${S.coins}</b>` : ''}<br>Tutto è salvato: torna presto a trovarl${cfg.plural === 'mucche' ? 'e' : 'o'}!`,
            });
          }
        });

        /* ---------- scorrere del tempo ---------- */
        function tick() {
          const now = performance.now();
          const min = Math.min(5, (now - lastTick) / 1000) / 60;
          lastTick = now;
          S.animals.forEach((a, i) => {
            const k = a.sleep ? 0.4 : 1;
            a.fame = clamp(a.fame - DECAY.fame * min * k);
            a.sete = clamp(a.sete - DECAY.sete * min * k);
            a.pulizia = clamp(a.pulizia - (DECAY.pulizia + S.poops.length * 1.5) * min);
            a.gioia = clamp(a.gioia - DECAY.gioia * min * (a.sleep ? 0.3 : 1));
            if (a.sleep) {
              a.energia = clamp(a.energia + 40 * min);
              if (a.energia >= 100) { a.sleep = false; popupAt('Buongiorno! ☀️', i); }
            } else a.energia = clamp(a.energia - DECAY.energia * min);
            const bad = a.fame < 20 || a.sete < 20 || a.pulizia < 25;
            if (a.sick) a.salute = Math.max(5, a.salute - 4 * min);
            else if (bad) a.salute = Math.max(5, a.salute - 2 * min);
            else if (a.fame > 50 && a.sete > 50) a.salute = clamp(a.salute + 2 * min);
            if (!a.sick && (bad || a.salute < 30) && Math.random() < (a.salute < 30 ? 0.5 : 0.25) * min) {
              a.sick = true;
              Sound.bad();
              popupAt(`Oh no! ${a.name} sta male! 🤒`, i, 'bad');
            }
            if (cfg.milk && !a.sick && a.fame > 40 && a.sete > 40) a.milk = clamp(a.milk + 10 * min);
            if (!a.sleep && a.fame > 30) {
              a.poopIn -= min * 60;
              if (a.poopIn <= 0) { addPoop(i); a.poopIn = U.ri(45, 90); }
            }
          });
          if (game && game.until < now) {
            const a = cur();
            const bonus = game.hits * 5;
            a.gioia = clamp(a.gioia + bonus);
            popupAt(bonus ? `Bravo! ❤️ +${bonus}` : 'La palla è scappata!', S.sel);
            game = null;
          }
          renderAll();
        }
        timers.push(setInterval(tick, 1000));
        timers.push(setInterval(save, 5000));

        const animalName = cur().name;
        ctx.intro({
          title: cfg.title,
          art: `<span class="emo">${cfg.introArt}</span>`,
          text: firstTime ? cfg.introText : `${cfg.welcomeBack(animalName)} Guarda le barre: se una è quasi vuota, l’animale ha bisogno di te! La nuvoletta sopra la testa ti dice cosa vuole.`,
          buttons: [{ label: firstTime ? '▶ Cominciamo!' : '▶ Andiamo!' }],
        }, () => { ctx.begin(); lastTick = performance.now(); renderAll(); });
        renderAll();

        return { stop() { timers.forEach(clearInterval); save(); } };
      },
    });
  }

  return { register, clamp };
})();

/* ===================== LA FATTORIA DELLE MUCCHE ===================== */
(() => {
  const clamp = Pets.clamp;
  function cow(a, x, y, s, f, selected) {
    const spot = '#222';
    const body = a.sick ? '#e8f5e9' : '#fff';
    const dirty = a.pulizia < 40 ? '<ellipse cx="-20" cy="-30" rx="8" ry="5" fill="#8d5a32" opacity=".7"/><ellipse cx="18" cy="-22" rx="6" ry="4" fill="#8d5a32" opacity=".7"/><ellipse cx="0" cy="-12" rx="5" ry="3" fill="#8d5a32" opacity=".7"/>' : '';
    const sad = a.gioia < 30 || a.fame < 25 || a.sete < 25;
    const eyes = a.sleep ? '<path d="M38 -72 Q42 -68 46 -72 M52 -72 Q56 -68 60 -72" stroke="#111" stroke-width="2" fill="none"/>'
      : '<circle cx="42" cy="-73" r="3.5" fill="#111"/><circle cx="56" cy="-73" r="3.5" fill="#111"/><circle cx="43" cy="-74" r="1.2" fill="#fff"/><circle cx="57" cy="-74" r="1.2" fill="#fff"/>';
    const mouth = f === 'eat' || f === 'drink' ? '<ellipse cx="49" cy="-50" rx="6" ry="4" fill="#7a2b3a"/>' : sad ? '<path d="M44 -50 Q49 -54 54 -50" stroke="#7a2b3a" stroke-width="2" fill="none"/>' : '<path d="M44 -52 Q49 -47 54 -52" stroke="#7a2b3a" stroke-width="2" fill="none"/>';
    const fxs = {
      eat: '<g transform="translate(64 -50)"><path d="M0 0 L14 -6 L12 4 Z" fill="#e9c46a"/><path d="M2 -2 L16 -10 M4 2 L18 0" stroke="#c99a00" stroke-width="2"/></g>',
      drink: '<g transform="translate(40 -40)"><circle r="3" fill="#4dd0ff"/><circle cx="8" cy="6" r="2.5" fill="#4dd0ff"/></g>',
      wash: '<g fill="#e0f7ff" stroke="#9ad0ff">' + [[-30, -60], [0, -70], [20, -50], [-10, -40], [30, -66]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="7"/>`).join('') + '</g>',
      heart: '<g fill="#ff4d6d">' + [[-10, -86], [16, -100], [36, -92]].map(([cx, cy]) => `<path d="M${cx} ${cy + 6} C${cx - 9} ${cy} ${cx - 6} ${cy - 8} ${cx} ${cy - 3} C${cx + 6} ${cy - 8} ${cx + 9} ${cy} ${cx} ${cy + 6} Z"/>`).join('') + '</g>',
      milk: '<g transform="translate(-6 -6)"><path d="M-10 -14 L10 -14 L8 4 L-8 4 Z" fill="#adb5bd"/><ellipse cx="0" cy="-14" rx="10" ry="3" fill="#fff"/></g>',
      med: '<g transform="translate(60 -84)"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="#fff" stroke="#e63946" stroke-width="2"/><path d="M0 -5 L0 5 M-5 0 L5 0" stroke="#e63946" stroke-width="3"/></g>',
    };
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${selected ? '<ellipse cx="0" cy="2" rx="60" ry="10" fill="#ffd23f" opacity=".6"/>' : ''}
      <ellipse cx="0" cy="2" rx="52" ry="7" fill="rgba(0,0,0,.2)"/>
      <path d="M-46 -40 Q-62 -30 -58 -6" stroke="${body}" stroke-width="5" fill="none"/><path d="M-60 -8 L-56 2 L-52 -8 Z" fill="${spot}"/>
      ${[-34, -18, 16, 32].map(lx => `<rect x="${lx - 5}" y="-26" width="10" height="26" fill="${body}" stroke="#333" stroke-width="1"/><rect x="${lx - 5}" y="-6" width="10" height="6" fill="#333"/>`).join('')}
      <ellipse cx="0" cy="-36" rx="48" ry="24" fill="${body}" stroke="#333" stroke-width="1.5"/>
      <path d="M-30 -52 Q-18 -56 -14 -44 Q-24 -34 -34 -42 Z M2 -50 Q14 -58 20 -46 Q12 -36 4 -42 Z M-8 -28 Q2 -32 6 -24 Q-2 -18 -8 -22 Z" fill="${spot}"/>
      <ellipse cx="-4" cy="-14" rx="10" ry="6" fill="#ffc2d1"/>
      ${dirty}
      <path d="M34 -84 L28 -96 L38 -88 Z M64 -84 L70 -96 L60 -88 Z" fill="#f4e3c1" stroke="#999"/>
      <ellipse cx="30" cy="-78" rx="10" ry="5" fill="${body}" stroke="#333" transform="rotate(-20 30 -78)"/><ellipse cx="68" cy="-78" rx="10" ry="5" fill="${body}" stroke="#333" transform="rotate(20 68 -78)"/>
      <ellipse cx="49" cy="-68" rx="20" ry="22" fill="${body}" stroke="#333" stroke-width="1.5"/><path d="M40 -86 Q49 -92 58 -86 Q52 -78 44 -80 Z" fill="${spot}"/>
      <ellipse cx="49" cy="-52" rx="15" ry="10" fill="#ffb3c6" stroke="#333" stroke-width="1"/><circle cx="44" cy="-53" r="2" fill="#7a2b3a"/><circle cx="54" cy="-53" r="2" fill="#7a2b3a"/>
      ${eyes}${mouth}
      ${a.sick ? '<path d="M56 -48 L70 -40" stroke="#e63946" stroke-width="3"/><circle cx="70" cy="-40" r="2.5" fill="#e63946"/><circle cx="36" cy="-62" r="4" fill="#80ed99" opacity=".7"/><circle cx="62" cy="-62" r="4" fill="#80ed99" opacity=".7"/>' : ''}
      <rect x="40" y="-48" width="18" height="6" rx="3" fill="#ffd23f" opacity="0"/>
      <path d="M49 -46 L49 -40" stroke="#c99a00" stroke-width="2"/><path d="M44 -40 L54 -40 L52 -32 L46 -32 Z" fill="#ffd23f" stroke="#c99a00"/>
      ${f ? fxs[f] || '' : ''}
    </g>`;
  }

  const farmBg = night => (night
    ? '<rect width="400" height="250" fill="#1d1e4f"/>' + Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${(i * 29) % 100 + 8}" r="1.5" fill="#fff"/>`).join('') + '<circle cx="340" cy="40" r="18" fill="#fff3b0"/>'
    : '<rect width="400" height="250" fill="#8fd3ff"/><circle cx="340" cy="40" r="20" fill="#ffd23f"/><ellipse cx="80" cy="40" rx="26" ry="10" fill="#fff"/><ellipse cx="220" cy="30" rx="30" ry="10" fill="#fff"/>') +
    `<ellipse cx="90" cy="150" rx="160" ry="50" fill="${night ? '#2d6a4f' : '#80ed99'}"/><ellipse cx="320" cy="150" rx="140" ry="40" fill="${night ? '#1b4332' : '#57cc99'}"/><rect y="140" width="400" height="110" fill="${night ? '#2d6a4f' : '#7ac74f'}"/>` +
    '<path d="M4 140 L4 70 L44 40 L84 70 L84 140 Z" fill="#c1121f" stroke="#fff" stroke-width="3"/><rect x="30" y="94" width="28" height="46" fill="#fff"/><path d="M30 94 L58 140 M58 94 L30 140" stroke="#c1121f" stroke-width="3"/>' +
    Array.from({ length: 10 }, (_, i) => `<rect x="${100 + i * 30}" y="122" width="6" height="26" fill="#a0703c"/>`).join('') + '<rect x="96" y="128" width="304" height="5" fill="#a0703c"/><rect x="96" y="140" width="304" height="5" fill="#a0703c"/>' +
    '<rect x="330" y="200" width="60" height="22" rx="4" fill="#8d99ae"/><rect x="334" y="202" width="52" height="8" fill="#4dd0ff"/>' +
    '<rect x="8" y="196" width="46" height="34" rx="6" fill="#e9c46a"/><path d="M8 206 L54 206 M8 218 L54 218" stroke="#c99a00" stroke-width="2"/>';

  Pets.register({
    id: 'mucche',
    title: 'La Fattoria delle Mucche',
    desc: 'Prenditi cura delle tue mucche: dagli da mangiare e da bere, puliscile, coccolale e mungile per guadagnare monete!',
    color: '#7ac74f',
    save: 'cg_pet_cows',
    icon: '🐄',
    single: 'mucca',
    plural: 'mucche',
    art: () => '<span class="emo">🐄</span><span class="emo">🥛</span>',
    introArt: '🐄🌾🥛',
    introText: 'Benvenuto nella tua fattoria! Hai una mucca di nome <b>Margherita</b>. Guarda le barre: 🍀 pancia, 💧 acqua, 🧼 pulizia, ❤️ felicità, ⚡ energia e 🩺 salute. Se una barra è quasi vuota, la mucca ha bisogno di te! Quando il secchio 🥛 è pieno, mungila e guadagni monete: con 60 🪙 compri un’altra mucca. Ricordati di pulire le cacche! 💩',
    welcomeBack: n => `Bentornato in fattoria! ${n} ti stava aspettando! 🐄`,
    names: ['Margherita', 'Rosina', 'Bianchina', 'Stellina'],
    buy: 60,
    milk: true,
    voice: 'Muuuu! 🐄',
    voiceFreq: 140,
    slots: [[150, 205], [280, 214], [230, 168], [80, 170]],
    scale: () => 0.85,
    bg: farmBg,
    draw: cow,
    actions: [
      { id: 'fieno', icon: '🌾', label: 'Fieno', run: (a, g) => { if (a.fame > 95) { g.popup('È piena! Muu!'); return false; } a.fame = clamp(a.fame + 30); g.fx('eat'); g.popup('🌾 Gnam gnam!'); Sound.tone(160, 0.2, 'triangle', 0.1); g.care(5); } },
      { id: 'acqua', icon: '💧', label: 'Acqua', run: (a, g) => { if (a.sete > 95) { g.popup('Non ha sete!'); return false; } a.sete = clamp(a.sete + 35); g.fx('drink'); g.popup('💧 Glu glu glu!'); Sound.tone(600, 0.15, 'sine', 0.08); g.care(5); } },
      { id: 'spazzola', icon: '🧽', label: 'Spazzola', run: (a, g) => { if (a.pulizia > 95) { g.popup('È già pulitissima! ✨'); return false; } a.pulizia = clamp(a.pulizia + 35); a.gioia = clamp(a.gioia + 5); g.fx('wash'); g.popup('🫧 Che pulita!'); Sound.tone(900, 0.1, 'triangle', 0.06); g.care(5); } },
      { id: 'coccole', icon: '🤗', label: 'Coccole', run: (a, g) => { a.gioia = clamp(a.gioia + 25); g.fx('heart'); g.popup('❤️ Muuu!'); Sound.tone(220, 0.3, 'triangle', 0.1); g.care(4); } },
      { id: 'mungi', icon: '🥛', label: a => `Mungi ${Math.floor(a.milk)}%`, run: (a, g) => { if (a.sick) { g.popup('È malata, prima curala! 🤒'); return false; } if (a.milk < 100) { g.popup(`Il secchio è al ${Math.floor(a.milk)}%... aspetta che mangi e beva bene!`); return false; } a.milk = 0; g.S.coins += 15; g.fx('milk'); g.popup('🥛 Latte fresco! +15 🪙', 'gold'); Sound.good(); g.care(20); } },
      { id: 'nanna', icon: '😴', label: a => (a.sleep ? 'Sveglia' : 'Nanna'), run: (a, g) => { if (a.sleep) { a.sleep = false; g.popup('Buongiorno! ☀️'); return; } if (a.energia > 85) { g.popup('Non ha sonno!'); return false; } a.sleep = true; g.popup('Buonanotte... 😴'); g.care(3); } },
      { id: 'vet', icon: '💊', label: 'Veterinario', run: (a, g) => { if (!a.sick) { g.popup('Sta benissimo! 💪'); return false; } a.sick = false; a.salute = clamp(a.salute + 40); g.fx('med'); g.popup('💊 Guarita! Grazie dottore!', 'gold'); Sound.win(); g.care(15); } },
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

  function panda(a, x, y, s, f) {
    const L = level(a).idx;
    const dirty = a.pulizia < 40 ? '<ellipse cx="-16" cy="-30" rx="7" ry="4" fill="#8d5a32" opacity=".6"/><ellipse cx="14" cy="-40" rx="6" ry="4" fill="#8d5a32" opacity=".6"/><ellipse cx="22" cy="-82" rx="5" ry="3" fill="#8d5a32" opacity=".6"/>' : '';
    const sad = a.gioia < 30 || a.fame < 25 || a.sete < 25;
    const white = a.sick ? '#e8f5e9' : '#fff';
    const eyes = a.sleep ? '<path d="M-16 -82 Q-12 -78 -8 -82 M8 -82 Q12 -78 16 -82" stroke="#fff" stroke-width="2" fill="none"/>'
      : '<circle cx="-12" cy="-83" r="4" fill="#fff"/><circle cx="12" cy="-83" r="4" fill="#fff"/><circle cx="-11" cy="-83" r="2.2" fill="#111"/><circle cx="13" cy="-83" r="2.2" fill="#111"/>';
    const mouth = f === 'eat' ? '<ellipse cx="0" cy="-64" rx="5" ry="4" fill="#7a2b3a"/>' : sad ? '<path d="M-5 -63 Q0 -67 5 -63" stroke="#333" stroke-width="2" fill="none"/>' : '<path d="M-5 -66 Q0 -61 5 -66" stroke="#333" stroke-width="2" fill="none"/>';
    const fxs = {
      eat: '<g transform="translate(18 -60) rotate(-30)"><rect x="-3" y="-40" width="6" height="50" fill="#80b918"/><path d="M-3 -24 L3 -24 M-3 -6 L3 -6" stroke="#55a630" stroke-width="2"/><path d="M3 -36 Q16 -44 22 -36 Q12 -34 3 -32 Z" fill="#55a630"/></g>',
      drink: '<g transform="translate(-4 -54)"><circle r="3" fill="#4dd0ff"/><circle cx="8" cy="6" r="2.5" fill="#4dd0ff"/></g>',
      wash: '<g fill="#e0f7ff" stroke="#9ad0ff">' + [[-30, -60], [0, -104], [24, -50], [-14, -30], [30, -86], [-34, -90]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="8"/>`).join('') + '</g>',
      heart: '<g fill="#ff4d6d">' + [[-26, -110], [0, -124], [26, -110]].map(([cx, cy]) => `<path d="M${cx} ${cy + 6} C${cx - 9} ${cy} ${cx - 6} ${cy - 8} ${cx} ${cy - 3} C${cx + 6} ${cy - 8} ${cx + 9} ${cy} ${cx} ${cy + 6} Z"/>`).join('') + '</g>',
      med: '<g transform="translate(34 -100)"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="#fff" stroke="#e63946" stroke-width="2"/><path d="M0 -5 L0 5 M-5 0 L5 0" stroke="#e63946" stroke-width="3"/></g>',
    };
    const crown = L >= 3 ? '<path d="M-14 -108 L-12 -122 L-5 -114 L0 -126 L5 -114 L12 -122 L14 -108 Z" fill="#ffd23f" stroke="#c99a00"/>' : L >= 2 ? '<g transform="translate(20 -106)"><path d="M0 0 L-10 -6 L-10 6 Z M0 0 L10 -6 L10 6 Z" fill="#ff4d6d"/><circle r="3" fill="#ff4d6d"/></g>' : '';
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="2" rx="44" ry="7" fill="rgba(0,0,0,.2)"/>
      <ellipse cx="-22" cy="-8" rx="14" ry="10" fill="#111"/><ellipse cx="22" cy="-8" rx="14" ry="10" fill="#111"/>
      <ellipse cx="0" cy="-30" rx="34" ry="30" fill="${white}" stroke="#333" stroke-width="1.5"/>
      <path d="M-34 -40 Q-50 -30 -40 -14 Q-30 -18 -26 -34 Z M34 -40 Q50 -30 40 -14 Q30 -18 26 -34 Z" fill="#111"/>
      <path d="M-30 -52 Q0 -62 30 -52 L30 -44 Q0 -54 -30 -44 Z" fill="#111"/>
      ${dirty}
      <circle cx="-24" cy="-104" r="11" fill="#111"/><circle cx="24" cy="-104" r="11" fill="#111"/>
      <ellipse cx="0" cy="-80" rx="32" ry="28" fill="${white}" stroke="#333" stroke-width="1.5"/>
      <ellipse cx="-12" cy="-82" rx="9" ry="11" fill="#111" transform="rotate(20 -12 -82)"/><ellipse cx="12" cy="-82" rx="9" ry="11" fill="#111" transform="rotate(-20 12 -82)"/>
      ${eyes}<ellipse cx="0" cy="-70" rx="5" ry="3.5" fill="#111"/>${mouth}
      <circle cx="-20" cy="-68" r="4" fill="#ff8fab" opacity=".6"/><circle cx="20" cy="-68" r="4" fill="#ff8fab" opacity=".6"/>
      ${a.sick ? '<path d="M6 -62 L20 -54" stroke="#e63946" stroke-width="3"/><circle cx="20" cy="-54" r="2.5" fill="#e63946"/>' : ''}
      ${crown}
      ${f ? fxs[f] || '' : ''}
    </g>`;
  }

  const bambooBg = night => (night
    ? '<rect width="400" height="250" fill="#1d1e4f"/>' + Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${(i * 29) % 100 + 8}" r="1.5" fill="#fff"/>`).join('') + '<circle cx="60" cy="40" r="18" fill="#fff3b0"/>'
    : '<rect width="400" height="250" fill="#c7f9cc"/><circle cx="60" cy="40" r="20" fill="#ffd23f"/>') +
    `<path d="M0 120 Q100 90 200 120 T400 110 L400 250 L0 250 Z" fill="${night ? '#1b4332' : '#95d5b2'}"/><rect y="170" width="400" height="80" fill="${night ? '#2d6a4f' : '#74c69d'}"/>` +
    [20, 44, 330, 356, 380].map((x, i) => `<rect x="${x}" y="${20 + (i % 2) * 20}" width="10" height="${170 - (i % 2) * 20}" fill="#55a630"/>` + [60, 100, 140].map(y => `<rect x="${x - 1}" y="${y}" width="12" height="3" fill="#2b9348"/>`).join('') + `<path d="M${x + 10} ${60 + i * 6} Q${x + 30} ${50 + i * 6} ${x + 36} ${62 + i * 6} Q${x + 24} ${62 + i * 6} ${x + 10} ${66 + i * 6} Z" fill="#80b918"/>`).join('') +
    '<ellipse cx="290" cy="226" rx="44" ry="10" fill="#4dd0ff"/><ellipse cx="90" cy="232" rx="26" ry="8" fill="#adb5bd"/>';

  Pets.register({
    id: 'panda',
    title: 'Il Mio Panda',
    desc: 'Un cucciolo di panda tutto tuo! Dagli il bambù, fagli il bagnetto, gioca con lui e mettilo a nanna: crescerà fino a diventare il Re dei Panda!',
    color: '#2b2d42',
    save: 'cg_pet_panda',
    icon: '🐼',
    single: 'panda',
    plural: 'panda',
    art: () => '<span class="emo">🐼</span><span class="emo">🎋</span>',
    introArt: '🐼🎋💤',
    introText: 'Ecco il tuo cucciolo di panda: si chiama <b>Bambù</b>! 🐼 Guarda le barre: 🍀 pancia, 💧 acqua, 🧼 pulizia, ❤️ felicità, ⚡ energia e 🩺 salute. La nuvoletta sopra la testa ti dice cosa vuole. Più te ne prendi cura, più cresce: da cucciolo diventerà il <b>Re dei Panda</b>! 👑 E non dimenticare di pulire le cacche! 💩',
    welcomeBack: n => `${n} è contentissimo di rivederti! 🐼`,
    names: ['Bambù'],
    buy: null,
    voice: 'Squiii! 🐼💕',
    voiceFreq: 700,
    slots: [[200, 215]],
    scale: a => [0.85, 1, 1.12, 1.2][level(a).idx],
    level,
    bg: bambooBg,
    draw: panda,
    actions: [
      { id: 'bambu', icon: '🎋', label: 'Bambù', run: (a, g) => { if (a.fame > 95) { g.popup('Pancia piena! 🐼'); return false; } a.fame = clamp(a.fame + 30); g.fx('eat'); g.popup('🎋 Crunch crunch!'); Sound.tone(500, 0.12, 'square', 0.05); g.care(6); } },
      { id: 'acqua', icon: '💧', label: 'Acqua', run: (a, g) => { if (a.sete > 95) { g.popup('Non ha sete!'); return false; } a.sete = clamp(a.sete + 35); g.fx('drink'); g.popup('💧 Slurp!'); Sound.tone(650, 0.15, 'sine', 0.08); g.care(6); } },
      { id: 'bagno', icon: '🛁', label: 'Bagnetto', run: (a, g) => { if (a.pulizia > 95) { g.popup('È già pulitissimo! ✨'); return false; } a.pulizia = clamp(a.pulizia + 40); a.gioia = clamp(a.gioia + 5); g.fx('wash'); g.popup('🫧 Bolle bolle!'); Sound.tone(900, 0.1, 'triangle', 0.06); g.care(6); } },
      { id: 'gioca', icon: '⚽', label: 'Gioca', run: (a, g) => { if (a.energia < 15) { g.popup('È troppo stanco per giocare! 😴'); return false; } g.startGame(); } },
      { id: 'coccole', icon: '🤗', label: 'Coccole', run: (a, g) => { a.gioia = clamp(a.gioia + 20); g.fx('heart'); g.popup('❤️ Squiii!'); Sound.tone(800, 0.2, 'triangle', 0.08); g.care(4); } },
      { id: 'nanna', icon: '😴', label: a => (a.sleep ? 'Sveglia' : 'Nanna'), run: (a, g) => { if (a.sleep) { a.sleep = false; g.popup('Buongiorno! ☀️'); return; } if (a.energia > 85) { g.popup('Non ha sonno!'); return false; } a.sleep = true; g.popup('Ninna nanna... 🌙'); g.care(3); } },
      { id: 'dottore', icon: '🩺', label: 'Dottore', run: (a, g) => { if (!a.sick) { g.popup('Sta benissimo! 💪'); return false; } a.sick = false; a.salute = clamp(a.salute + 40); g.fx('med'); g.popup('🩺 Guarito! Evviva!', 'gold'); Sound.win(); g.care(15); } },
    ],
  });
})();
