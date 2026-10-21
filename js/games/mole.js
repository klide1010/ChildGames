'use strict';
/*
 * Acchiappa la Talpa: le talpe spuntano dalle buche del prato, colpiscile col martello!
 * Talpa normale +10, talpa con elmetto (2 colpi) +25, talpa d'oro +50, coniglietto da NON colpire -20.
 * Più colpi di fila senza sbagliare = combo x2, x3.
 */
const MoleArt = (() => {
  const wrap = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${inner}</svg>`;
  function mole(body, belly, extra = '') {
    return wrap(`
      <ellipse cx="50" cy="62" rx="34" ry="38" fill="${body}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>
      <ellipse cx="50" cy="76" rx="20" ry="20" fill="${belly}"/>
      <circle cx="38" cy="48" r="5" fill="#111"/><circle cx="62" cy="48" r="5" fill="#111"/>
      <circle cx="39.5" cy="46.5" r="1.6" fill="#fff"/><circle cx="63.5" cy="46.5" r="1.6" fill="#fff"/>
      <ellipse cx="50" cy="60" rx="9" ry="6.5" fill="#ff8fab" stroke="#c9184a" stroke-width="1.2"/>
      <rect x="45.5" y="66" width="4" height="6" fill="#fff"/><rect x="50.5" y="66" width="4" height="6" fill="#fff"/>
      <path d="M30 60 L16 56 M30 64 L16 66 M70 60 L84 56 M70 64 L84 66" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>
      <ellipse cx="22" cy="88" rx="9" ry="6" fill="${belly}"/><ellipse cx="78" cy="88" rx="9" ry="6" fill="${belly}"/>
      ${extra}`);
  }
  const helmet = '<path d="M18 46 Q18 10 50 10 Q82 10 82 46 Z" fill="#ffd23f" stroke="#c99a00" stroke-width="2"/><rect x="14" y="42" width="72" height="7" rx="3" fill="#c99a00"/><circle cx="50" cy="22" r="6" fill="#fff"/>';
  const cracked = '<path d="M18 46 Q18 10 50 10 Q82 10 82 46 Z" fill="#ffd23f" stroke="#c99a00" stroke-width="2"/><rect x="14" y="42" width="72" height="7" rx="3" fill="#c99a00"/><path d="M40 12 L46 24 L40 30 L48 42" stroke="#7a5b00" stroke-width="2.5" fill="none"/>';
  const crown = '<path d="M32 26 L36 10 L44 20 L50 6 L56 20 L64 10 L68 26 Z" fill="#fff3a3" stroke="#c99a00" stroke-width="1.5"/>';
  const bunny = wrap(`
    <ellipse cx="38" cy="22" rx="8" ry="22" fill="#fff" stroke="#ddd" stroke-width="2"/><ellipse cx="62" cy="22" rx="8" ry="22" fill="#fff" stroke="#ddd" stroke-width="2"/>
    <ellipse cx="38" cy="24" rx="4" ry="15" fill="#ffc2d1"/><ellipse cx="62" cy="24" rx="4" ry="15" fill="#ffc2d1"/>
    <ellipse cx="50" cy="66" rx="32" ry="32" fill="#fff" stroke="#ddd" stroke-width="2"/>
    <circle cx="39" cy="58" r="5" fill="#3a7bd5"/><circle cx="61" cy="58" r="5" fill="#3a7bd5"/>
    <circle cx="40.5" cy="56.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="56.5" r="1.6" fill="#fff"/>
    <path d="M46 68 L54 68 L50 73 Z" fill="#ff8fab"/><path d="M50 73 Q45 79 41 76 M50 73 Q55 79 59 76" stroke="#c9184a" stroke-width="1.5" fill="none"/>
    <circle cx="33" cy="72" r="5" fill="#ffc2d1" opacity=".7"/><circle cx="67" cy="72" r="5" fill="#ffc2d1" opacity=".7"/>`);
  const toUrl = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return {
    mole: toUrl(mole('#8d5a32', '#c99a6b')),
    helmet: toUrl(mole('#8d5a32', '#c99a6b', helmet)),
    helmetHit: toUrl(mole('#8d5a32', '#c99a6b', cracked)),
    gold: toUrl(mole('#e9b200', '#fff3a3', crown)),
    bunny: toUrl(bunny),
    dizzy: toUrl(mole('#8d5a32', '#c99a6b', '<path d="M30 44 L44 52 M44 44 L30 52 M56 44 L70 52 M70 44 L56 52" stroke="#111" stroke-width="3"/><circle cx="50" cy="24" r="16" fill="none" stroke="#ffd23f" stroke-width="2" stroke-dasharray="4 4"/>')),
  };
})();

App.register({
  id: 'talpa',
  title: 'Acchiappa la Talpa',
  desc: 'Le talpe spuntano dal prato: colpiscile col martello! Attenzione ai coniglietti.',
  color: '#6a994e',
  duration: 60,
  art: () => `<img class="ch" src="${MoleArt.mole}" alt=""><span class="emo">🔨</span>`,
  stars: p => (p >= 700 ? 3 : p >= 400 ? 2 : p >= 150 ? 1 : 0),

  start(ctx) {
    const field = U.el('div', 'mole-field');
    ctx.stage.appendChild(field);
    const holes = [];
    for (let i = 0; i < 12; i++) {
      const el = U.el('div', 'mhole', '<div class="mdirt"></div><div class="mwin"><img class="mpop" alt="" draggable="false"></div><div class="mfront"></div>');
      const h = { el, img: el.querySelector('.mpop'), busy: false, kind: null, hp: 0, hideT: 0 };
      el.addEventListener('pointerdown', ev => { ev.preventDefault(); whack(h, ev); });
      field.appendChild(el);
      holes.push(h);
    }
    const hammer = U.el('div', 'mhammer', '🔨');
    ctx.stage.appendChild(hammer);

    let running = false, timers = [], combo = 0, best = 0, hits = 0, bunnies = 0, golds = 0;
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
    const mult = () => (combo >= 10 ? 3 : combo >= 5 ? 2 : 1);
    function info() { ctx.info(`🔨 ${hits}${mult() > 1 ? ` · 🔥 combo x${mult()}` : ''}`); }

    function show(h) {
      const e = ctx.elapsed();
      const r = Math.random();
      h.kind = r < 0.08 ? 'gold' : r < 0.26 ? 'bunny' : r < (e > 15 ? 0.48 : 0.36) ? 'helmet' : 'mole';
      h.hp = h.kind === 'helmet' ? 2 : 1;
      h.busy = true;
      h.img.src = MoleArt[h.kind];
      h.el.classList.remove('hit', 'oops');
      h.el.classList.add('up');
      h.el.classList.toggle('gold', h.kind === 'gold');
      const stay = Math.max(600, 1400 - e * 13) * (h.kind === 'gold' ? 0.6 : h.kind === 'helmet' ? 1.3 : 1);
      h.hideT = later(() => {
        if (h.busy && (h.kind === 'mole' || h.kind === 'helmet' || h.kind === 'gold') && h.el.classList.contains('up')) { combo = 0; info(); }
        hide(h);
      }, stay);
    }
    function hide(h) {
      h.el.classList.remove('up', 'gold');
      later(() => { h.busy = false; h.el.classList.remove('hit', 'oops'); }, 200);
    }
    function spawn() {
      if (!running) return;
      const e = ctx.elapsed();
      const n = e > 35 && Math.random() < 0.45 ? 2 : e > 15 && Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const free = holes.filter(h => !h.busy);
        if (free.length) show(U.pick(free));
      }
      later(spawn, Math.max(330, 820 - e * 9) * U.rand(0.7, 1.3));
    }

    function swing(ev) {
      const s = ctx.stage.getBoundingClientRect();
      hammer.style.left = (ev.clientX - s.left) + 'px';
      hammer.style.top = (ev.clientY - s.top) + 'px';
      hammer.classList.remove('bang'); void hammer.offsetWidth; hammer.classList.add('bang');
    }

    function whack(h, ev) {
      if (!running) return;
      swing(ev);
      const r = h.el.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
      const x = r.left - s.left + r.width / 2, y = r.top - s.top + r.height * 0.15;
      if (!h.el.classList.contains('up') || h.el.classList.contains('hit')) {
        combo = 0; info();
        Sound.tone(160, 0.06, 'square', 0.04);
        return;
      }
      if (h.kind === 'bunny') {
        bunnies++;
        combo = 0;
        ctx.add(-20);
        h.el.classList.add('oops');
        ctx.popup('No! Il coniglietto! -20', x, y, 'bad');
        Sound.bad(); U.vibrate(120);
        clearTimeout(h.hideT);
        later(() => hide(h), 300);
        info();
        return;
      }
      h.hp--;
      if (h.hp > 0) {
        h.img.src = MoleArt.helmetHit;
        ctx.popup('Tonk! Ancora!', x, y, '');
        Sound.tone(900, 0.08, 'square', 0.06);
        return;
      }
      combo++; hits++;
      best = Math.max(best, combo);
      const base = h.kind === 'gold' ? 50 : h.kind === 'helmet' ? 25 : 10;
      const pts = base * mult();
      if (h.kind === 'gold') golds++;
      ctx.add(pts);
      h.img.src = MoleArt.dizzy;
      h.el.classList.add('hit');
      ctx.popup(`+${pts}${mult() > 1 ? ` (x${mult()})` : ''}`, x, y, h.kind === 'gold' || mult() > 1 ? 'gold' : '');
      if (combo === 5 || combo === 10) { ctx.popup(`COMBO x${mult()}! 🔥`, ctx.stage.clientWidth / 2, ctx.stage.clientHeight * 0.2, 'combo'); Sound.win(); }
      else if (h.kind === 'gold') Sound.good(); else Sound.tone(500 + combo * 40, 0.08, 'square', 0.06);
      clearTimeout(h.hideT);
      later(() => hide(h), 380);
      info();
    }

    ctx.intro({
      title: 'Acchiappa la Talpa',
      art: `<img class="ch" src="${MoleArt.mole}" alt="" style="width:90px;height:90px"><img class="ch" src="${MoleArt.helmet}" alt="" style="width:90px;height:90px"><img class="ch" src="${MoleArt.gold}" alt="" style="width:90px;height:90px">`,
      text: 'Tocca le talpe per colpirle col martello! 🔨 Talpa <b>+10</b>, talpa con l\'elmetto <b>+25</b> (servono 2 colpi), talpa d\'oro <b>+50</b>. Non colpire i coniglietti 🐰 (<b>-20</b>)! Fai 5 o 10 colpi di fila per la <b>combo x2 e x3</b>. Hai 60 secondi.',
    }, () => {
      running = true;
      info();
      ctx.begin();
      later(spawn, 400);
    });

    return {
      timeUp() {
        running = false;
        ctx.end({
          title: 'Tempo scaduto! ⏰',
          msg: `Talpe acchiappate: <b>${hits}</b>${golds ? ` (d'oro: ${golds})` : ''}<br>Combo migliore: <b>${best}</b> di fila${bunnies ? `<br>Coniglietti colpiti per sbaglio: ${bunnies}` : ''}`,
        });
      },
      stop() { running = false; timers.forEach(clearTimeout); },
    };
  },
});
