'use strict';
/* Trova l'Ombra: scopri il personaggio nascosto tra la folla, round dopo round sempre più difficile. */
App.register({
  id: 'trova',
  title: 'Trova l’Ombra',
  desc: 'Un personaggio si è nascosto in mezzo alla folla: scovalo più in fretta che puoi!',
  color: '#ff9f1c',
  duration: null,
  art: () => Chars.img('baby') + '<span class="emo">🔍</span>',
  stars: p => (p >= 1050 ? 3 : p >= 700 ? 2 : p >= 300 ? 1 : 0),

  start(ctx) {
    const ROUNDS = 8;
    const box = U.el('div', 'find', '<div class="find-head"></div><div class="find-crowd"></div>');
    ctx.stage.appendChild(box);
    const head = box.querySelector('.find-head');
    const crowd = box.querySelector('.find-crowd');

    let round = 0, wrongs = 0, t0 = 0, busy = true, target = null, timers = [], count = 0;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function layout() {
      if (!count) return;
      const r = crowd.getBoundingClientRect();
      const gap = 4, pad = 12;
      let best = { cols: 3, s: 0 };
      for (let cols = 2; cols <= 10; cols++) {
        const rows = Math.ceil(count / cols);
        const s = Math.min((r.width - pad - gap * (cols - 1)) / cols, (r.height - pad - gap * (rows - 1)) / rows);
        if (s > best.s) best = { cols, s };
      }
      const s = Math.floor(Math.min(best.s, 110));
      crowd.style.gridTemplateColumns = `repeat(${best.cols}, ${s}px)`;
      crowd.style.setProperty('--s', s + 'px');
    }

    function next() {
      round++;
      // nei round dispari si cerca un Saja Boy (in mezzo ad altri Saja Boys: più difficile!)
      target = round % 2 ? U.pick(Chars.boys) : U.pick(Chars.ids);
      const others = Chars.ids.filter(i => i !== target);
      count = Math.min(42, 8 + round * 4);
      const list = Array.from({ length: count - 1 }, () => U.pick(others));
      list.splice(U.ri(0, list.length), 0, target);
      head.innerHTML = `Trova: <span class="tgt">${Chars.img(target)}</span> ${Chars.name(target)}`;
      crowd.innerHTML = '';
      list.forEach(id => {
        const b = U.el('button', 'fcell', Chars.img(id));
        b.firstChild.style.transform = `rotate(${U.ri(-20, 20)}deg) scale(${U.rand(0.85, 1.1).toFixed(2)})`;
        b.addEventListener('click', () => tap(b, id));
        crowd.appendChild(b);
      });
      layout();
      ctx.info(`🔍 Round ${round}/${ROUNDS}`);
      t0 = performance.now();
      busy = false;
    }

    function tap(b, id) {
      if (busy) return;
      const r = b.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
      const x = r.left - s.left + r.width / 2, y = r.top - s.top;
      if (id === target) {
        busy = true;
        const secs = (performance.now() - t0) / 1000;
        const pts = 100 + Math.max(0, Math.round(60 - secs * 6));
        ctx.add(pts);
        b.classList.add('found');
        ctx.popup('Trovato! +' + pts, x, y, 'gold');
        Sound.good();
        later(round < ROUNDS ? next : finish, 1000);
      } else {
        wrongs++;
        ctx.add(-10);
        b.classList.remove('wrong');
        void b.offsetWidth;
        b.classList.add('wrong');
        ctx.popup(`È ${Chars.name(id)}! -10`, x, y, 'bad');
        Sound.bad();
      }
    }

    function finish() {
      ctx.end({
        title: 'Tutti scovati! 🔍',
        msg: `Hai trovato tutti gli <b>${ROUNDS}</b> personaggi nascosti${wrongs ? `<br>Tocchi sbagliati: ${wrongs}` : '<br>Senza sbagliare mai!'}`,
      });
    }

    window.addEventListener('resize', layout);

    ctx.intro({
      title: 'Trova l’Ombra',
      art: Chars.img('mystery') + '<span class="emo">🔍</span>',
      text: 'In alto vedi chi devi cercare: trovalo nella folla e toccalo! Più sei veloce, più punti prendi. Ogni tocco sbagliato costa <b>10 punti</b>. Sono 8 round, sempre più affollati!',
    }, () => { ctx.begin(); next(); });

    return { stop() { timers.forEach(clearTimeout); busy = true; window.removeEventListener('resize', layout); } };
  },
});
