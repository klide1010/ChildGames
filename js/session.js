'use strict';
/*
 * Sessioni di gioco a tempo.
 * Il tempo scorre mentre il sito è aperto e visibile (menu e giochi) ed è salvato sul telefono,
 * così ricaricare la pagina non lo azzera. Finito il tempo compare il blocco: per giocare ancora
 * un adulto deve toccare 7 volte di fila "Riavvia sessione" e scegliere la durata della nuova sessione.
 * Toccando 7 volte di fila il contatore ⏳ nel menu si può cambiare la durata in qualunque momento.
 */
const Session = (() => {
  const KEY = 'cg_session';
  const DEFAULT_LIMIT = 15 * 60;          // secondi
  const TAPS = 7;                         // tocchi consecutivi per sbloccare
  const TAP_GAP = 1500;                   // ms massimi tra un tocco e l'altro
  const CHOICES = [1, 5, 10, 15, 20, 30, 45, 60]; // minuti

  let st = Store.get(KEY, null) || { limit: DEFAULT_LIMIT, used: 0 };
  let last = performance.now();
  let locked = false, warned = false;
  let overlay = null;

  const remaining = () => Math.max(0, st.limit - st.used);
  const save = () => Store.set(KEY, st);

  /* Conta i tocchi consecutivi su un elemento e chiama fn al settimo */
  function secretTaps(el, fn) {
    let count = 0, lastTap = 0;
    el.addEventListener('click', ev => {
      ev.stopPropagation();
      const now = Date.now();
      count = now - lastTap <= TAP_GAP ? count + 1 : 1;
      lastTap = now;
      el.classList.remove('tap'); void el.offsetWidth; el.classList.add('tap');
      if (count >= TAPS) { count = 0; fn(); }
    });
  }

  function paint() {
    const chip = document.getElementById('session-chip');
    if (chip) {
      chip.textContent = '⏳ ' + U.fmt(remaining());
      chip.classList.toggle('low', remaining() <= 60);
    }
  }

  function toast(text) {
    const t = U.el('div', 'toast', text);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  function tick() {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
    if (locked || document.hidden) return;
    st.used += Math.min(dt, 2);
    save();
    paint();
    if (!warned && remaining() <= 60 && remaining() > 0) {
      warned = true;
      toast('⏳ Ancora 1 minuto di gioco!');
      Sound.tone(880, 0.2, 'triangle', 0.12);
    }
    if (remaining() <= 0) lock();
  }

  function showOverlay(html) {
    if (!overlay) {
      overlay = U.el('div', 'lock');
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="lock-card">${html}</div>`;
    overlay.classList.add('show');
    return overlay;
  }
  function hideOverlay() { if (overlay) overlay.classList.remove('show'); }

  function lock() {
    if (locked) return;
    locked = true;
    App.goMenu();
    Sound.win();
    const o = showOverlay(`
      <div class="lock-art">😴</div>
      <h2>Tempo di gioco finito!</h2>
      <p>Bravissimi! Adesso facciamo una pausa.<br>Chiedi al nonno o alla nonna di riaprire i giochi.</p>
      <button class="btn big" id="lock-restart">🔄 Riavvia sessione</button>`);
    secretTaps(o.querySelector('#lock-restart'), () => picker(false));
  }

  function picker(cancellable) {
    const o = showOverlay(`
      <div class="lock-art">⏳</div>
      <h2>Nuova sessione di gioco</h2>
      <p>Quanto tempo possono giocare?</p>
      <div class="lock-choices">${CHOICES.map(m => `<button class="btn" data-m="${m}">${m} min</button>`).join('')}</div>
      ${cancellable ? '<button class="btn alt" id="lock-cancel">Annulla</button>' : ''}`);
    o.querySelectorAll('[data-m]').forEach(b => {
      b.onclick = () => {
        st = { limit: Number(b.dataset.m) * 60, used: 0 };
        save();
        locked = false; warned = false;
        last = performance.now();
        hideOverlay();
        paint();
        Sound.good();
      };
    });
    const c = o.querySelector('#lock-cancel');
    if (c) c.onclick = () => { hideOverlay(); Sound.pop(); };
  }

  function init() {
    const chip = document.getElementById('session-chip');
    if (chip) secretTaps(chip, () => picker(true));
    document.addEventListener('visibilitychange', () => { last = performance.now(); });
    setInterval(tick, 1000);
    paint();
    if (remaining() <= 0) lock();
  }

  return { init, remaining };
})();
