'use strict';
/* Memory delle Stelle: trova le coppie di personaggi. Più veloce e meno mosse = più punti. */
App.register({
  id: 'memory',
  title: 'Memory delle Stelle',
  desc: 'Gira le carte e trova le coppie di personaggi. Meno mosse fai, più punti prendi!',
  color: '#7b61ff',
  duration: null,
  art: () => Chars.img('rumi') + Chars.img('jinu'),

  start(ctx) {
    let pairs = 6, first = null, lock = false, moves = 0, found = 0;
    let grid = null, deck = [];

    function layout() {
      if (!grid) return;
      const r = ctx.stage.getBoundingClientRect();
      const n = deck.length, gap = 8, pad = 16;
      let best = { cols: 3, w: 0 };
      for (let cols = 2; cols <= 8; cols++) {
        const rows = Math.ceil(n / cols);
        const w = Math.min((r.width - pad - gap * (cols - 1)) / cols, ((r.height - pad - gap * (rows - 1)) / rows) / 1.25);
        if (w > best.w) best = { cols, w };
      }
      const w = Math.floor(Math.min(best.w, 150));
      grid.style.gridTemplateColumns = `repeat(${best.cols}, ${w}px)`;
      grid.style.setProperty('--w', w + 'px');
      grid.style.setProperty('--h', Math.floor(w * 1.25) + 'px');
    }

    function info() { ctx.info(`🔄 Mosse: ${moves} · 🧩 ${found}/${pairs}`); }

    function build() {
      const ids = U.shuffle(Chars.ids.slice()).slice(0, pairs);
      deck = U.shuffle([...ids, ...ids]);
      grid = U.el('div', 'mem-grid');
      deck.forEach(id => {
        const b = U.el('button', 'mcard');
        b.dataset.id = id;
        b.innerHTML = `<div class="mc-in"><div class="mc-face mc-back">★</div><div class="mc-face mc-front">${Chars.img(id)}<span>${Chars.name(id)}</span></div></div>`;
        b.addEventListener('click', () => flip(b));
        grid.appendChild(b);
      });
      ctx.stage.appendChild(grid);
      layout();
      info();
    }

    function flip(b) {
      if (lock || b.classList.contains('open')) return;
      b.classList.add('open');
      Sound.pop();
      if (!first) { first = b; return; }
      const second = b;
      moves++;
      if (first.dataset.id === second.dataset.id) {
        found++;
        ctx.add(50);
        first.classList.add('done'); second.classList.add('done');
        const r = second.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
        ctx.popup('+50', r.left - s.left + r.width / 2, r.top - s.top, 'gold');
        Sound.good();
        first = null;
        info();
        if (found === pairs) setTimeout(finish, 700);
      } else {
        lock = true;
        const a = first;
        first = null;
        info();
        setTimeout(() => { a.classList.remove('open'); second.classList.remove('open'); lock = false; }, 850);
      }
    }

    function finish() {
      const sec = ctx.elapsed();
      const timeBonus = Math.max(0, Math.round((pairs * 12 - sec) * 5));
      const moveBonus = Math.max(0, (pairs * 2 + 2 - moves) * 20);
      ctx.add(timeBonus + moveBonus);
      const stars = moves <= pairs * 1.6 && sec <= pairs * 8 ? 3 : moves <= pairs * 2.3 ? 2 : 1;
      ctx.end({
        title: 'Tutte trovate! 🎉',
        msg: `Mosse: <b>${moves}</b><br>Bonus velocità <b>+${timeBonus}</b> · Bonus mosse <b>+${moveBonus}</b>`,
        stars,
      });
    }

    window.addEventListener('resize', layout);

    ctx.intro({
      title: 'Memory delle Stelle',
      art: Chars.img('mira') + Chars.img('sonic'),
      text: 'Tocca due carte: se sono uguali restano scoperte! Ogni coppia vale <b>+50</b>, e alla fine ricevi un bonus se sei stato veloce e hai fatto poche mosse.',
      buttons: [
        { label: '😊 Facile · 6 coppie', value: 6 },
        { label: '🔥 Difficile · 8 coppie', value: 8 },
        { label: '🤯 Campione · 10 coppie', value: 10 },
      ],
    }, n => { pairs = n; build(); ctx.begin(); });

    return { stop() { window.removeEventListener('resize', layout); } };
  },
});
