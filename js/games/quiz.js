'use strict';
/* Saetta Indovina: 10 indovinelli (contare, sommare, ombre misteriose, sequenze, intrusi). */
App.register({
  id: 'indovina',
  title: 'Saetta Indovina',
  desc: '10 indovinelli con Saetta: conta gli anelli, scopri chi si nasconde nell’ombra, trova l’intruso!',
  color: '#00b894',
  duration: null,
  art: () => Chars.img('saetta') + '<span class="emo">❓</span>',
  stars: p => (p >= 1150 ? 3 : p >= 750 ? 2 : p >= 300 ? 1 : 0),

  start(ctx) {
    const TOTAL = 10;
    const { ri, pick, shuffle } = U;

    const box = U.el('div', 'quiz', `
      <div class="quiz-head"><div class="quiz-avatar">${Chars.img('saetta')}</div><div class="bubble"></div></div>
      <div class="quiz-visual"></div>
      <div class="quiz-opts"></div>
      <div class="quiz-progress">${'<i></i>'.repeat(TOTAL)}</div>`);
    ctx.stage.appendChild(box);
    const bubble = box.querySelector('.bubble');
    const visual = box.querySelector('.quiz-visual');
    const opts = box.querySelector('.quiz-opts');
    const dots = [...box.querySelectorAll('.quiz-progress i')];

    const ringsHTML = (n, lostFrom = n) => `<div class="rings">${Array.from({ length: n }, (_, i) => `<i class="ring${i >= lostFrom ? ' lost' : ''}"></i>`).join('')}</div>`;
    function numOpts(ans, min = 0) {
      const s = new Set([ans]);
      while (s.size < 4) { const v = ans + ri(-3, 3); if (v >= min) s.add(v); }
      return shuffle([...s]);
    }
    const CATS = {
      frutta: ['🍎', '🍌', '🍇', '🍓', '🍒', '🍐', '🍉'],
      animali: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸'],
      veicoli: ['🚗', '🚌', '🚲', '✈️', '🚀', '🚂', '🚁'],
      dolci: ['🍦', '🍩', '🍪', '🧁', '🍭', '🍫', '🎂'],
    };

    const GEN = {
      count() {
        const n = ri(3, 12), o = numOpts(n, 1);
        return { q: 'Quanti anelli vedi? Contali bene!', visual: ringsHTML(n), opts: o.map(String), ans: o.indexOf(n) };
      },
      add() {
        const a = ri(1, 7), b = ri(1, 7), n = a + b, o = numOpts(n, 1);
        return {
          q: `Saetta ha ${a} anell${a > 1 ? 'i' : 'o'} e ne trova ${b > 1 ? `altri ${b}` : 'un altro'}. Quanti ne ha adesso?`,
          visual: `<div class="sum">${ringsHTML(a)}<b>+</b>${ringsHTML(b)}</div>`,
          opts: o.map(String), ans: o.indexOf(n),
        };
      },
      sub() {
        const a = ri(4, 10), b = ri(1, a - 2), n = a - b, o = numOpts(n, 0);
        return {
          q: `Saetta aveva ${a} anelli ma inciampa e ne perde ${b}. Quanti gliene restano?`,
          visual: ringsHTML(a, a - b), opts: o.map(String), ans: o.indexOf(n),
        };
      },
      who() {
        const ids = shuffle(Chars.ids.slice()), id = ids[0], choices = shuffle(ids.slice(0, 4));
        return {
          q: 'Chi si nasconde nell’ombra?',
          visual: `<div class="shadow">${Chars.img(id)}</div>`,
          opts: choices.map(Chars.name), ans: choices.indexOf(id),
          reveal: () => visual.querySelector('.shadow').classList.add('shown'),
        };
      },
      pattern() {
        const pool = shuffle(['🍎', '⭐', '💙', '🎵', '🔥', '🌙', '🍀', '🎈']);
        const pat = pick([[0, 1], [0, 0, 1], [0, 1, 2], [0, 1, 1]]);
        const len = pat.length === 2 ? 5 : 6;
        const items = Array.from({ length: len }, (_, i) => pool[pat[i % pat.length]]);
        const ans = pool[pat[len % pat.length]];
        const o = shuffle([...new Set([ans, ...pool.slice(0, 3), pool[3], pool[4]])].slice(0, 4));
        if (!o.includes(ans)) o[0] = ans;
        return {
          q: 'Cosa viene dopo? Guarda la sequenza!',
          visual: `<div class="pattern">${items.map(x => `<span>${x}</span>`).join('')}<span class="qm">❓</span></div>`,
          opts: o, ans: o.indexOf(ans), emoji: true,
        };
      },
      odd() {
        const [a, b] = shuffle(Object.keys(CATS));
        const intruder = pick(CATS[b]);
        const o = shuffle([...shuffle(CATS[a].slice()).slice(0, 3), intruder]);
        return { q: 'Qual è l’intruso? Trova quello diverso dagli altri!', visual: `<div class="pattern">${o.map(x => `<span>${x}</span>`).join('')}</div>`, opts: o, ans: o.indexOf(intruder), emoji: true };
      },
      more() {
        const [p1, p2] = shuffle(Chars.ids.filter(i => i !== 'saetta')).slice(0, 2);
        let a = ri(2, 9), b = ri(2, 9);
        if (a === b) b = a === 9 ? 7 : a + 1;
        const card = (id, n) => `<div>${Chars.img(id)}<b>${Chars.name(id)}</b><div class="stars">${'⭐'.repeat(n)}</div></div>`;
        const o = [Chars.name(p1), Chars.name(p2)];
        return { q: 'Chi ha raccolto più stelle?', visual: `<div class="more">${card(p1, a)}${card(p2, b)}</div>`, opts: o, ans: a > b ? 0 : 1 };
      },
    };

    const order = shuffle(['count', 'add', 'who', 'pattern', 'odd', 'more', 'sub', 'who', 'pattern', 'add']);
    let qn = 0, right = 0, qStart = 0, busy = true, Q = null, timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    function ask() {
      qn++;
      Q = GEN[order[qn - 1]]();
      bubble.textContent = Q.q;
      visual.innerHTML = Q.visual;
      opts.innerHTML = '';
      opts.style.gridTemplateColumns = Q.opts.length === 2 ? '1fr 1fr' : '';
      Q.opts.forEach((txt, i) => {
        const b = U.el('button', 'qopt' + (Q.emoji ? ' emoji' : ''), U.esc(txt));
        b.addEventListener('click', () => answer(i));
        opts.appendChild(b);
      });
      dots.forEach((d, i) => d.classList.toggle('now', i === qn - 1));
      ctx.info(`❓ Domanda ${qn}/${TOTAL} · ✅ ${right}`);
      qStart = performance.now();
      busy = false;
    }

    function answer(i) {
      if (busy) return;
      busy = true;
      const secs = (performance.now() - qStart) / 1000;
      const btns = [...opts.children];
      btns[Q.ans].classList.add('right');
      const ok = i === Q.ans;
      dots[qn - 1].classList.remove('now');
      dots[qn - 1].classList.add(ok ? 'ok' : 'no');
      if (ok) {
        right++;
        const pts = 100 + Math.max(0, Math.round(50 - secs * 5));
        ctx.add(pts);
        const r = btns[i].getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
        ctx.popup('+' + pts, r.left - s.left + r.width / 2, r.top - s.top, 'gold');
        bubble.textContent = pick(['Giusto! 🎉', 'Esatto! Che velocità! 💨', 'Super! ⭐', 'Perfetto! 👍']);
        Sound.good();
      } else {
        btns[i].classList.add('wrong');
        bubble.textContent = `Quasi! La risposta giusta era: ${Q.opts[Q.ans]}`;
        Sound.bad();
      }
      if (Q.reveal) Q.reveal();
      ctx.info(`❓ Domanda ${qn}/${TOTAL} · ✅ ${right}`);
      later(qn < TOTAL ? ask : finish, ok ? 1300 : 2300);
    }

    function finish() {
      ctx.end({
        title: right >= 9 ? 'Sei un genio! 🧠' : right >= 6 ? 'Fantastico! 🎉' : 'Ottimo lavoro! 👏',
        msg: `Risposte giuste: <b>${right}</b> su ${TOTAL}`,
      });
    }

    ctx.intro({
      title: 'Saetta Indovina',
      art: Chars.img('saetta'),
      text: 'Saetta ha 10 indovinelli per te! Ogni risposta giusta vale <b>100 punti</b>, e se rispondi in fretta prendi fino a <b>50 punti</b> in più!',
    }, () => { ctx.begin(); ask(); });

    return { stop() { timers.forEach(clearTimeout); busy = true; } };
  },
});
