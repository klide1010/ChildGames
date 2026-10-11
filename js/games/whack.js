'use strict';
/* Acchiappa i Ragazzi Ombra: tocca i demoni che spuntano dalle finestre, non le Cacciastelle. */
App.register({
  id: 'acchiappa',
  title: 'Acchiappa i Ragazzi Ombra',
  desc: 'I Ragazzi Ombra spuntano dalle finestre: toccali in fretta! Ma non toccare le Cacciastelle.',
  color: '#6a4cff',
  duration: 45,
  art: () => Chars.img('misty') + Chars.img('romeo'),
  stars: p => (p >= 400 ? 3 : p >= 220 ? 2 : p >= 80 ? 1 : 0),

  start(ctx) {
    const board = U.el('div', 'whack');
    ctx.stage.appendChild(board);
    const holes = [];
    for (let i = 0; i < 9; i++) {
      const el = U.el('div', 'hole', '<div class="pop"></div>');
      const h = { el, pop: el.querySelector('.pop'), busy: false, tapped: false, kind: null, id: null, hideT: 0 };
      el.addEventListener('pointerdown', ev => { ev.preventDefault(); tap(h); });
      board.appendChild(el);
      holes.push(h);
    }

    let running = false, timers = [], caught = 0, oops = 0, golds = 0;
    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

    function info() { ctx.info(`👻 Acchiappati: ${caught}`); }

    function show(h) {
      const r = Math.random();
      h.kind = r < 0.12 ? 'gold' : r < 0.32 ? 'friend' : 'boy';
      h.id = h.kind === 'friend' ? U.pick(Chars.girls) : h.kind === 'gold' ? 'jino' : U.pick(Chars.boys);
      h.busy = true; h.tapped = false;
      h.pop.innerHTML = Chars.img(h.id) + (h.kind === 'gold' ? '<span class="crown">👑</span>' : '');
      h.el.classList.remove('hit', 'oops');
      h.el.classList.add('up');
      h.el.classList.toggle('gold', h.kind === 'gold');
      const e = ctx.elapsed();
      h.hideT = later(() => hide(h), Math.max(650, 1350 - e * 15));
    }

    function hide(h) {
      h.el.classList.remove('up', 'gold');
      later(() => { h.busy = false; h.el.classList.remove('hit', 'oops'); }, 220);
    }

    function spawn() {
      if (!running) return;
      const e = ctx.elapsed();
      const n = e > 20 && Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const free = holes.filter(h => !h.busy);
        if (free.length) show(U.pick(free));
      }
      later(spawn, Math.max(380, 850 - e * 11) * U.rand(0.7, 1.3));
    }

    function tap(h) {
      if (!running || !h.el.classList.contains('up') || h.tapped) return;
      h.tapped = true;
      const r = h.el.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
      const x = r.left - s.left + r.width / 2, y = r.top - s.top + r.height * 0.2;
      if (h.kind === 'friend') {
        oops++;
        ctx.add(-20);
        h.el.classList.add('oops');
        ctx.popup(`No! È ${Chars.name(h.id)}! -20`, x, y, 'bad');
        Sound.bad(); U.vibrate(120);
      } else {
        caught++;
        const pts = h.kind === 'gold' ? 30 : 10;
        if (h.kind === 'gold') golds++;
        ctx.add(pts);
        h.el.classList.add('hit');
        ctx.popup('+' + pts, x, y, h.kind === 'gold' ? 'gold' : '');
        if (h.kind === 'gold') Sound.good(); else Sound.pop();
      }
      info();
      clearTimeout(h.hideT);
      later(() => hide(h), 260);
    }

    ctx.intro({
      title: 'Acchiappa i Ragazzi Ombra',
      art: Chars.img('jino') + Chars.img('abe') + Chars.img('bebo'),
      text: 'I Ragazzi Ombra si affacciano alle finestre: toccali! <b>+10</b>. Jino con la corona 👑 vale <b>+30</b>. Ma se tocchi Ruby, Mila o Zoe perdi <b>20 punti</b>! Hai 45 secondi.',
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
          msg: `Ragazzi Ombra acchiappati: <b>${caught}</b>${golds ? ` (👑 ${golds})` : ''}${oops ? `<br>Cacciastelle toccate per sbaglio: ${oops}` : '<br>Nessuna amica toccata: perfetto!'}`,
        });
      },
      stop() { running = false; timers.forEach(clearTimeout); },
    };
  },
});
