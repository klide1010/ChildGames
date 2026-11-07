'use strict';
/*
 * Avventure punta-e-clicca (stile Monkey Island).
 * Questo file contiene il "motore" (scene, zaino, dialoghi, aiuti, salvataggi) e la scelta del mondo.
 * I mondi e i loro capitoli stanno nei file js/adv/*.js e si registrano con Adventure.world / Adventure.chapter.
 */
const Adventure = (() => {
  const worlds = [];
  const FONT = "font-family=\"'Baloo 2', 'Trebuchet MS', Arial, sans-serif\"";

  /* ---------------- disegni condivisi fra i mondi ---------------- */
  const TRICORN = '<path d="M-25 -96 Q0 -124 25 -96 Q12 -103 0 -101 Q-12 -103 -25 -96 Z" fill="#1b1b1b"/><circle cx="0" cy="-107" r="3.5" fill="#fff"/>';
  const bandana = c => `<path d="M-15 -92 Q0 -110 15 -92 Z" fill="${c}"/><path d="M14 -95 L25 -88 L16 -84 Z" fill="${c}"/>`;
  function person(x, y, o) {
    const skin = o.skin || '#f1c27d', pants = o.pants || '#3d2b1f';
    return `<g transform="translate(${x} ${y}) scale(${o.s || 1})">
      <ellipse cx="0" cy="0" rx="26" ry="5" fill="rgba(0,0,0,.25)"/>
      ${o.noLegs ? '' : `<rect x="-12" y="-32" width="9" height="30" fill="${pants}"/>
      ${o.peg ? '<rect x="5" y="-32" width="5" height="32" fill="#8d5a32"/>' : `<rect x="3" y="-32" width="9" height="30" fill="${pants}"/><ellipse cx="8" cy="-2" rx="8" ry="4" fill="#222"/>`}
      <ellipse cx="-8" cy="-2" rx="8" ry="4" fill="#222"/>`}
      ${o.hairBack || ''}
      <path d="M-20 -72 L20 -72 L24 -28 L-24 -28 Z" fill="${o.coat}"/>
      ${o.apron ? '<path d="M-14 -66 L14 -66 L18 -26 L-18 -26 Z" fill="#fff"/>' : ''}
      ${o.belt ? '<rect x="-23" y="-42" width="46" height="6" fill="#3d2b1f"/><rect x="-4" y="-43" width="8" height="8" fill="none" stroke="#ffd23f" stroke-width="2"/>' : ''}
      <rect x="-29" y="-70" width="9" height="34" rx="4" fill="${o.coat}"/><rect x="20" y="-70" width="9" height="34" rx="4" fill="${o.coat}"/>
      <circle cx="-24" cy="-34" r="5" fill="${skin}"/><circle cx="24" cy="-34" r="5" fill="${skin}"/>
      <circle cx="0" cy="-86" r="15" fill="${skin}"/>
      <circle cx="-5" cy="-88" r="2" fill="#222"/>
      ${o.patch ? '<path d="M1 -93 L10 -93 L10 -84 L1 -84 Z" fill="#111"/><path d="M-15 -95 L15 -89" stroke="#111" stroke-width="1.5"/>' : '<circle cx="5" cy="-88" r="2" fill="#222"/>'}
      <path d="M-4 -79 Q0 -76 4 -79" stroke="#7a2b3a" stroke-width="1.6" fill="none"/>
      ${o.beard ? `<path d="M-13 -84 Q-15 -58 0 -55 Q15 -58 13 -84 Q8 -75 0 -76 Q-8 -75 -13 -84 Z" fill="${o.beard}"/>` : ''}
      ${o.mustache ? `<path d="M-10 -80 Q-4 -85 0 -81 Q4 -85 10 -80 Q4 -78 0 -79 Q-4 -78 -10 -80 Z" fill="${o.mustache}"/>` : ''}
      ${o.blush ? '<circle cx="-9" cy="-81" r="3" fill="#ff8fa3" opacity=".6"/><circle cx="9" cy="-81" r="3" fill="#ff8fa3" opacity=".6"/>' : ''}
      ${o.hat || ''}
      ${o.extra || ''}
    </g>`;
  }
  const parrot = (x, y, happy) => `<g transform="translate(${x} ${y})">
    <path d="M0 0 L0 70" stroke="#5a3418" stroke-width="4"/><path d="M-28 0 L28 0" stroke="#5a3418" stroke-width="5" stroke-linecap="round"/>
    <path d="M-4 -8 L-12 22 L2 -2 Z" fill="#e63946"/><ellipse cx="0" cy="-20" rx="12" ry="18" fill="#2ec27e"/>
    <path d="M-10 -24 Q-20 -10 -8 0 Z" fill="#1a9c60"/><circle cx="0" cy="-40" r="10" fill="#2ec27e"/>
    <path d="M7 -42 Q18 -38 9 -31 Z" fill="#ffd23f"/><circle cx="3" cy="-43" r="2.3" fill="#111"/>
    ${happy ? '<path d="M-8 -52 L-4 -46 M0 -54 L0 -48 M8 -52 L4 -46" stroke="#e63946" stroke-width="2"/>' : ''}</g>`;
  const monkey = (x, y, happy, s = 1, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="26" rx="13" ry="15" fill="#8d5a32"/><path d="M12 30 Q32 32 26 8" stroke="#8d5a32" stroke-width="4" fill="none"/>
    <circle cx="-15" cy="-4" r="6" fill="#8d5a32"/><circle cx="15" cy="-4" r="6" fill="#8d5a32"/>
    <circle cx="0" cy="0" r="16" fill="#8d5a32"/><ellipse cx="0" cy="4" rx="11" ry="9" fill="#e9c69a"/>
    <circle cx="-5" cy="-4" r="2.3" fill="#111"/><circle cx="5" cy="-4" r="2.3" fill="#111"/>
    ${happy ? '<path d="M-5 6 Q0 13 5 6 Z" fill="#7a2b3a"/>' : '<path d="M-4 9 Q0 6 4 9" stroke="#5a3418" stroke-width="1.6" fill="none"/>'}${extra}</g>`;
  const crab = (x, y) => `<g transform="translate(${x} ${y})">
    <path d="M-12 6 L-20 15 M-4 8 L-8 17 M4 8 L8 17 M12 6 L20 15" stroke="#c1121f" stroke-width="2.5"/>
    <ellipse rx="18" ry="11" fill="#e63946"/><path d="M-6 -8 L-6 -14 M6 -8 L6 -14" stroke="#e63946" stroke-width="2"/>
    <circle cx="-6" cy="-15" r="3.2" fill="#fff"/><circle cx="6" cy="-15" r="3.2" fill="#fff"/><circle cx="-6" cy="-15" r="1.5" fill="#111"/><circle cx="6" cy="-15" r="1.5" fill="#111"/>
    <path d="M-17 -3 Q-30 -12 -24 -20 M17 -3 Q30 -12 24 -20" stroke="#e63946" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-4 3 Q0 6 4 3" stroke="#7a1010" stroke-width="1.4" fill="none"/></g>`;
  const palm = (x, y, h) => `<path d="M${x} ${y} Q${x - 30} ${y - h * 0.5} ${x - 14} ${y - h}" stroke="#8d5a32" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    [-160, -125, -90, -55, -20, 15].map(a => `<ellipse cx="${x - 14 + 26}" cy="${y - h}" rx="30" ry="7" fill="#2d6a4f" transform="rotate(${a} ${x - 14} ${y - h})"/>`).join('');
  const exitSign = (x, y, label) => `<g><rect x="${x}" y="${y}" width="${label.length * 7.4 + 16}" height="22" rx="11" fill="rgba(0,0,0,.45)"/><text x="${x + 8}" y="${y + 15.5}" font-size="13" font-weight="800" fill="#fff" ${FONT}>${label}</text></g>`;
  const skyGrad = (a, b) => `<defs><linearGradient id="advsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="250" fill="url(#advsky)"/>`;
  const glow = (id, color, cx = 0.5, cy = 0.55) => `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r=".6"><stop offset="0" stop-color="${color}" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="250" fill="url(#${id})"/>`;
  const mushroom = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-30" width="16" height="30" rx="5" fill="#fff3e0"/><path d="M-30 -28 Q0 -64 30 -28 Z" fill="${c}"/><circle cx="-12" cy="-38" r="4" fill="#fff"/><circle cx="6" cy="-46" r="5" fill="#fff"/><circle cx="16" cy="-34" r="3.5" fill="#fff"/></g>`;
  const label = (x, y, text, bg = '#fff', fg = '#1d3557', w) => `<rect x="${x}" y="${y}" width="${w || text.length * 6.6 + 14}" height="20" rx="4" fill="${bg}"/><text x="${x + (w || text.length * 6.6 + 14) / 2}" y="${y + 14}" font-size="11" font-weight="800" fill="${fg}" text-anchor="middle" ${FONT}>${text}</text>`;
  const image = (href, x, y, w, h) => `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const star = (cx, cy, r, fill) => {
    let p = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `;
    }
    return `<polygon points="${p}" fill="${fill}"/>`;
  };
  const heart = (cx, cy, s, fill) => `<path d="M${cx} ${cy + 8 * s} C${cx - 13 * s} ${cy - s} ${cx - 8 * s} ${cy - 12 * s} ${cx} ${cy - 5 * s} C${cx + 8 * s} ${cy - 12 * s} ${cx + 13 * s} ${cy - s} ${cx} ${cy + 8 * s} Z" fill="${fill}"/>`;

  const art = { FONT, TRICORN, bandana, person, parrot, monkey, crab, palm, exitSign, skyGrad, glow, mushroom, label, image, star, heart };

  return {
    art,
    worlds,
    world(def) { worlds.push(Object.assign({ chapters: [] }, def)); },
    chapter(worldId, def) { worlds.find(w => w.id === worldId).chapters.push(def); },
  };
})();

App.register({
  id: 'avventura',
  title: 'Avventure',
  desc: 'Avventure con enigmi e storie: l’Isola delle Scimmie, Sonic e Hello Kitty. Esplora, parla con tutti e risolvi i misteri!',
  color: '#0f4c5c',
  duration: null,
  art: () => '<span class="emo">🏴‍☠️</span><span class="emo">💨</span><span class="emo">🎀</span>',

  start(ctx) {
    const DONE = 'cg_adv_done';
    let chap = null;              // capitolo in corso
    let world = null;
    let C = null;                 // contenuti costruiti del capitolo (scene, aiuti...)
    let ITEMS = {};
    let st = null;
    let selected = null;
    let ended = false, finishing = false;

    const fresh = () => ({ scene: chap.start, inv: [], f: {}, hints: 0, pts: 0 });
    const has = i => st.inv.includes(i);
    const give = i => { if (!has(i)) st.inv.push(i); renderInv(); save(); };
    const drop = i => { st.inv = st.inv.filter(x => x !== i); if (selected === i) selected = null; renderInv(); save(); };
    // durante il finale la partita non si salva più: chi esce prima dell'ultimo "Ok" non ritrova un capitolo "a metà"
    const save = () => { if (st && chap && !ended && !finishing) Store.set(chap.save, st); };

    function step(id, pts) {
      if (st.f['s_' + id]) return;
      st.f['s_' + id] = true;
      st.pts += pts;
      ctx.add(pts);
      ctx.popup(`+${pts} ⭐`, ctx.stage.clientWidth / 2, ctx.stage.clientHeight * 0.25, 'gold');
      Sound.good();
      save();
    }

    /* ---------------- interfaccia ---------------- */
    const box = U.el('div', 'adv', `
      <div class="adv-scene"><div class="adv-place"></div><div class="adv-svg"></div></div>
      <div class="adv-text"><div class="adv-who"></div><div class="adv-msg"></div><div class="adv-choices"></div></div>
      <div class="adv-inv"></div>
      <div class="adv-bar">
        <button class="btn alt" data-b="hint">💡 Aiuto</button>
        <button class="btn alt" data-b="spots">✨ Cosa c’è?</button>
        <button class="btn alt" data-b="restart">🔄 Ricomincia</button>
      </div>`);
    ctx.stage.appendChild(box);
    const svgBox = box.querySelector('.adv-svg');
    const place = box.querySelector('.adv-place');
    const whoEl = box.querySelector('.adv-who');
    const msgEl = box.querySelector('.adv-msg');
    const choiceEl = box.querySelector('.adv-choices');
    const invEl = box.querySelector('.adv-inv');

    function say(who, html, opts) {
      whoEl.innerHTML = who ? `${who.icon} ${U.esc(who.name)}` : '';
      whoEl.style.display = who ? '' : 'none';
      msgEl.innerHTML = html;
      choiceEl.innerHTML = '';
      (opts || []).forEach(o => {
        const b = U.el('button', 'adv-choice', o.label);
        b.onclick = () => { Sound.pop(); o.fn(); };
        choiceEl.appendChild(b);
      });
    }
    function choices(text, opts) { say(null, text, opts); }
    function dialog(lines, then, lastLabel) {
      let i = 0;
      const next = () => {
        if (i >= lines.length) { if (then) then(); return; }
        const [who, text] = lines[i++];
        const last = i >= lines.length;
        say(who, text, (last && !then) ? [] : [{ label: last ? (lastLabel || '✔ Ok') : '▶ Avanti', fn: next }]);
      };
      next();
    }

    /* Lucchetto con rotelle (numeri o simboli) */
    function lock({ title = '🔒 Lucchetto a combinazione', text = 'Gira le rotelle e scegli la combinazione giusta:', symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], code, ok, fail = 'Clic... non si apre! Prova un’altra combinazione. Chissà se c’è un indizio da qualche parte...', leave = 'Lo lasci com’è.' }) {
      const pos = code.map(() => 0);
      const draw = (wrong) => {
        whoEl.style.display = '';
        whoEl.innerHTML = title;
        msgEl.innerHTML = `${text}<div class="adv-lock">${pos.map((n, i) => `<div class="adv-wheel"><button data-i="${i}" data-d="1">▲</button><b>${symbols[n]}</b><button data-i="${i}" data-d="-1">▼</button></div>`).join('')}</div>${wrong ? `<p>${fail}</p>` : ''}`;
        msgEl.querySelectorAll('.adv-wheel button').forEach(b => {
          b.onclick = () => { const i = +b.dataset.i; pos[i] = (pos[i] + +b.dataset.d + symbols.length) % symbols.length; Sound.tone(700, 0.04, 'square', 0.04); draw(); };
        });
        choiceEl.innerHTML = '';
        [{ label: '🔓 Prova ad aprire', fn: () => {
          if (pos.every((n, i) => symbols[n] === String(code[i]))) ok();
          else { Sound.bad(); draw(true); }
        } }, { label: '↩️ Lascia stare', fn: () => say(null, leave) }].forEach(o => {
          const b = U.el('button', 'adv-choice', o.label);
          b.onclick = () => { Sound.pop(); o.fn(); };
          choiceEl.appendChild(b);
        });
      };
      draw(false);
    }

    /* Finale del capitolo: chiude il salvataggio subito, poi il dialogo e la schermata di fine */
    function finish({ lines, title, msg }) {
      finishing = true;
      Store.set(chap.save, null);
      const done = Store.get(DONE, {}) || {};
      done[chap.id] = true;
      Store.set(DONE, done);
      Sound.win();
      dialog(lines, () => {
        ended = true;
        const stars = st.hints === 0 ? 3 : st.hints <= 3 ? 2 : 1;
        const next = world.chapters[world.chapters.indexOf(chap) + 1];
        ctx.end({
          title,
          msg: `${msg}<br>Aiuti usati: <b>${st.hints}</b>${next ? `<br>${next.icon} Ora puoi giocare il <b>${next.title}</b>!` : ''}`,
          stars,
        });
      }, '🏆 Fine del capitolo!');
    }

    function renderInv() {
      invEl.innerHTML = st.inv.length ? '' : '<span class="adv-empty">🎒 Lo zaino è vuoto</span>';
      st.inv.forEach(id => {
        const it = ITEMS[id];
        const b = U.el('button', 'adv-item' + (selected === id ? ' sel' : ''), `<span>${it.icon}</span><small>${it.name}</small>`);
        b.onclick = () => {
          Sound.pop();
          if (selected === id) { selected = null; say(null, `${it.icon} ${it.look}`); }
          else { selected = id; say(null, `${it.icon} <b>${it.name}</b>: tocca qualcosa nella scena per usarlo. (Tocca di nuovo l’oggetto per guardarlo.)`); }
          renderInv();
        };
        invEl.appendChild(b);
      });
    }

    function render() {
      const sc = C.scenes[st.scene];
      place.textContent = sc.name;
      // le uscite stanno sotto a tutto, poi le cose grandi e sopra quelle piccole:
      // così personaggi e oggetti vicini a un cartello o davanti a uno sfondo grande restano toccabili
      const isExit = h => (h.id.startsWith('exit') ? 1 : 0);
      const spots = sc.spots().sort((x, y) => (isExit(y) - isExit(x)) || (y.w * y.h - x.w * x.h));
      svgBox.innerHTML = `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">${sc.draw()}${spots.map(h => `<rect class="hs" data-id="${h.id}" x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="10"/>`).join('')}</svg>`;
      svgBox.querySelectorAll('.hs').forEach(r => {
        r.addEventListener('click', () => tapSpot(spots.find(h => h.id === r.dataset.id)));
      });
    }

    function go(scene) {
      st.scene = scene;
      selected = null;
      save();
      render();
      renderInv();
      Sound.tone(440, 0.08, 'triangle', 0.08);
      say(null, (C.arrive && C.arrive[scene]) || '');
    }

    function useOn(h, item) {
      const it = ITEMS[item];
      if (h.use && h.use[item]) { selected = null; renderInv(); h.use[item](); return; }
      Sound.tone(220, 0.1, 'sawtooth', 0.05);
      const nope = [`Usare ${it.name.toLowerCase()} con ${h.name.replace(/^\S+\s/, '').toLowerCase()}? Mmm... non funziona.`, 'Non credo sia una buona idea...', 'Niente da fare. Prova qualcos’altro!'];
      say(null, U.pick(nope));
      selected = null; renderInv();
    }

    function tapSpot(h) {
      if (!h || ended || finishing) return;
      if (selected) return useOn(h, selected);
      if (h.go && !h.talk && !h.take && !h.look) return typeof h.go === 'function' ? h.go() : go(h.go);
      const opts = [];
      if (h.look) opts.push({ label: '👀 Guarda', fn: () => say(null, h.look) });
      if (h.talk) opts.push({ label: '💬 Parla', fn: h.talk });
      if (h.take) opts.push({ label: '✋ Prendi', fn: h.take });
      if (h.go) opts.push({ label: '🚶 Vai', fn: () => (typeof h.go === 'function' ? h.go() : go(h.go)) });
      if (!h.take && !h.talk && h.look && !h.go) opts.push({ label: '✋ Prendi', fn: () => say(null, U.pick(['Non si può prendere!', 'È troppo pesante.', 'Meglio lasciarlo dov’è.'])) });
      say(null, `<b>${h.name}</b>`, opts);
    }

    box.querySelector('.adv-bar').addEventListener('click', ev => {
      const b = ev.target.closest('[data-b]');
      if (!b || ended || finishing || !st) return;
      Sound.pop();
      if (b.dataset.b === 'hint') {
        st.hints++;
        st.pts = Math.max(0, st.pts - 20);
        ctx.add(-20);
        save();
        say({ name: 'Aiuto', icon: '💡' }, `${C.hint()}<br><small>(Un aiuto costa 20 punti.)</small>`);
      }
      if (b.dataset.b === 'spots') {
        svgBox.classList.remove('show'); void svgBox.offsetWidth; svgBox.classList.add('show');
        setTimeout(() => svgBox.classList.remove('show'), 1800);
      }
      if (b.dataset.b === 'restart') {
        say(null, 'Vuoi davvero ricominciare il capitolo da capo?', [
          { label: '🔄 Sì, ricomincia', fn: () => { st = fresh(); ctx.add(-ctx.points); save(); go(st.scene); say(null, C.welcome); } },
          { label: '↩️ No, continuo', fn: () => say(null, 'Bene, avanti tutta!') },
        ]);
      }
    });

    /* ---------------- oggetto passato ai capitoli ---------------- */
    const A = {
      get st() { return st; },
      get f() { return st.f; },
      has, give, drop, step, say, choices, dialog, go, render, save, lock, finish,
      ME: () => ({ name: App.playerName(), icon: '🧒' }),
    };

    /* ---------------- avvio: mondo → capitolo → continua/ricomincia ---------------- */
    const savedOk = (c, x) => x && x.f && Object.keys(x.f).length > 0 && !(c.done && c.done(x.f));

    function begin(c, resume) {
      chap = c;
      ITEMS = c.items;
      C = c.build(A);
      const saved = Store.get(c.save, null);
      st = resume ? Object.assign(fresh(), saved) : fresh();
      if (!resume) Store.set(c.save, null);
      if (resume) ctx.add(st.pts);
      ctx.begin();
      render();
      renderInv();
      say(null, resume ? `Bentornato, ${U.esc(App.playerName())}! Riprendiamo da dove eravamo rimasti. ${world.icon}` : C.welcome);
    }

    function pickChapter(w) {
      world = w;
      const done = Store.get(DONE, {}) || {};
      ctx.intro({
        title: `${w.icon} ${w.title}`,
        art: `<span class="emo">${w.art || w.icon}</span>`,
        text: w.desc,
        buttons: w.chapters.map((c, i) => {
          const inCorso = savedOk(c, Store.get(c.save, null));
          return { label: `${done[c.id] ? '✅' : c.icon} Cap. ${i + 1}: ${c.title}${inCorso ? ' ▶' : ''}`, value: c };
        }),
      }, c => {
        const saved = Store.get(c.save, null);
        if (savedOk(c, saved)) {
          ctx.intro({
            title: `${c.icon} ${c.title}`,
            art: `<span class="emo">${c.icon}</span>`,
            text: 'Hai una partita in corso in questo capitolo. Vuoi continuarla o ricominciare da capo?',
            buttons: [{ label: '▶ Continua da dove eri', value: true }, { label: '🔄 Ricomincia da capo', value: false }],
          }, resume => begin(c, resume));
        } else {
          if (saved) Store.set(c.save, null); // vecchio salvataggio di un capitolo già finito
          begin(c, false);
        }
      });
    }

    ctx.intro({
      title: 'Avventure',
      art: '<span class="emo">🐒</span><span class="emo">💨</span><span class="emo">🎀</span>',
      text: 'Scegli il mondo della tua avventura! In ogni capitolo esplori, parli con i personaggi, raccogli oggetti nello zaino e li usi al posto giusto per risolvere gli enigmi. Se sei bloccato, c’è il pulsante 💡 Aiuto.',
      buttons: Adventure.worlds.map(w => ({ label: `${w.icon} ${w.title} · ${w.chapters.length} capitoli`, value: w })),
    }, pickChapter);

    return { stop() { save(); } };
  },
});
