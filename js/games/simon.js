'use strict';
/* Canta con le Cacciastelle: ripeti la sequenza di note (stile Simon). */
App.register({
  id: 'canta',
  title: 'Canta con le Cacciastelle',
  desc: 'Ruby, Mila, Zoe e Tigro cantano una melodia: ricordala e ripetila uguale!',
  color: '#f15bb5',
  duration: null,
  art: () => Chars.img('ruby') + Chars.img('zoe'),
  stars: p => (p >= 300 ? 3 : p >= 120 ? 2 : p >= 30 ? 1 : 0),

  start(ctx) {
    const PADS = [
      { id: 'ruby', f: 262, c: '#9b5de5' },
      { id: 'mila', f: 330, c: '#ff4d6d' },
      { id: 'zoe', f: 392, c: '#00bbf9' },
      { id: 'tigro', f: 523, c: '#fee440' },
    ];
    const PRAISE = ['Bravissimi insieme! 🎶', 'Che voce! ✨', 'Perfetto! 🌟', 'Super Star! 🎤', 'Sei una stella! ⭐'];
    const wrap = U.el('div', 'simon');
    wrap.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column';
    const status = U.el('div', 'simon-status', '🎤');
    const grid = U.el('div', 'simon-grid');
    wrap.append(status, grid);
    ctx.stage.appendChild(wrap);

    const pads = PADS.map((p, i) => {
      const b = U.el('button', 'spad', `${Chars.img(p.id)}<span>${Chars.name(p.id)}</span>`);
      b.style.setProperty('--c', p.c);
      b.addEventListener('pointerdown', ev => { ev.preventDefault(); press(i); });
      grid.appendChild(b);
      return b;
    });

    let seq = [], pos = 0, accept = false, lives = 3, level = 0, timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function info() { ctx.info(`🎵 Livello ${level} · ${U.hearts(lives)}`); }

    function light(i, ms) {
      pads[i].classList.add('lit');
      Sound.note(PADS[i].f);
      later(() => pads[i].classList.remove('lit'), ms);
    }

    function play() {
      accept = false;
      status.textContent = `🎧 Ascolta... (${seq.length} not${seq.length > 1 ? 'e' : 'a'})`;
      const gap = Math.max(320, 680 - level * 28);
      seq.forEach((v, k) => later(() => light(v, gap * 0.65), 700 + k * gap));
      later(() => { accept = true; pos = 0; status.textContent = '👆 Tocca a te!'; }, 700 + seq.length * gap);
    }

    function next() {
      level++;
      seq.push(U.ri(0, 3));
      info();
      play();
    }

    function press(i) {
      if (!accept) return;
      light(i, 220);
      if (seq[pos] === i) {
        pos++;
        if (pos === seq.length) {
          accept = false;
          const pts = level * 10;
          ctx.add(pts);
          ctx.popup(`+${pts}`, ctx.stage.clientWidth / 2, ctx.stage.clientHeight / 2, 'gold');
          status.textContent = U.pick(PRAISE);
          later(() => Sound.good(), 250);
          later(next, 1100);
        }
      } else {
        accept = false;
        lives--;
        info();
        Sound.bad(); U.vibrate(150);
        if (lives <= 0) {
          status.textContent = 'Oh no, il concerto è finito!';
          later(() => ctx.end({
            title: 'Che concerto! 🎤',
            msg: `Hai ripetuto melodie fino a <b>${level - 1}</b> note!`,
          }), 900);
        } else {
          status.textContent = `❌ Ops! Riascolta bene...`;
          later(play, 1200);
        }
      }
    }

    ctx.intro({
      title: 'Canta con le Cacciastelle',
      art: Chars.img('ruby') + Chars.img('mila') + Chars.img('zoe'),
      text: 'Le Cacciastelle cantano una melodia: guarda chi si illumina e ascolta le note. Poi <b>tocca nello stesso ordine</b>! Ogni volta la melodia si allunga di una nota. Hai 3 vite.',
    }, () => {
      ctx.begin();
      later(next, 300);
    });

    return { stop() { timers.forEach(clearTimeout); accept = false; } };
  },
});
