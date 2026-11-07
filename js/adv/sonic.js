'use strict';
/*
 * Mondo "Sonic": avventura in 2 capitoli con Sonic, Tails, Knuckles, Amy e il Dottor Eggman.
 *  1. Lo Smeraldo Rubato   2. Il Luna Park di Eggman
 */
(() => {
  const { exitSign, skyGrad, glow, label, palm, image, star, FONT } = Adventure.art;

  /* ---------------- personaggi ---------------- */
  const shoe = (x, c = '#e63946') => `<path d="M${x - 12} -2 Q${x - 10} -14 ${x + 2} -12 Q${x + 12} -10 ${x + 12} -2 Z" fill="${c}" stroke="rgba(0,0,0,.3)"/><rect x="${x - 6}" y="-11" width="10" height="3" fill="#fff"/>`;
  const sonic = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="22" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="-10" y="-34" width="7" height="26" fill="#1f6fe5"/><rect x="3" y="-34" width="7" height="26" fill="#1f6fe5"/>
    ${shoe(-8)}${shoe(9)}
    <path d="M-14 -56 L-26 -36 M14 -56 L26 -36" stroke="#1f6fe5" stroke-width="5" stroke-linecap="round"/>
    <circle cx="-27" cy="-34" r="6" fill="#fff" stroke="#bbb"/><circle cx="27" cy="-34" r="6" fill="#fff" stroke="#bbb"/>
    <ellipse cx="0" cy="-46" rx="16" ry="17" fill="#1f6fe5"/><ellipse cx="0" cy="-44" rx="10" ry="12" fill="#f8d39e"/>
    ${image(Chars.url('sonic'), -34, -116, 68, 68)}</g>`;
  const tails = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="22" ry="5" fill="rgba(0,0,0,.25)"/>
    <g fill="#ff9f1c" stroke="#d97706" stroke-width="1.5"><ellipse cx="26" cy="-36" rx="22" ry="9" transform="rotate(-25 26 -36)"/><ellipse cx="22" cy="-52" rx="22" ry="9" transform="rotate(-55 22 -52)"/></g>
    <circle cx="44" cy="-46" r="6" fill="#fff"/><circle cx="34" cy="-70" r="6" fill="#fff"/>
    <rect x="-10" y="-32" width="7" height="24" fill="#ff9f1c"/><rect x="3" y="-32" width="7" height="24" fill="#ff9f1c"/>
    ${shoe(-8)}${shoe(9)}
    <ellipse cx="0" cy="-44" rx="15" ry="16" fill="#ff9f1c"/><ellipse cx="0" cy="-42" rx="9" ry="11" fill="#fff"/>
    <path d="M-14 -54 L-24 -36 M14 -54 L24 -36" stroke="#ff9f1c" stroke-width="5" stroke-linecap="round"/><circle cx="-25" cy="-34" r="5" fill="#fff"/><circle cx="25" cy="-34" r="5" fill="#fff"/>
    <path d="M-18 -86 L-24 -108 L-6 -92 Z M18 -86 L24 -108 L6 -92 Z" fill="#ff9f1c" stroke="#d97706"/><path d="M-16 -90 L-20 -102 L-10 -93 Z M16 -90 L20 -102 L10 -93 Z" fill="#fff"/>
    <circle cx="0" cy="-76" r="20" fill="#ff9f1c"/><path d="M-6 -96 L0 -86 L6 -96 L2 -90 Z" fill="#ff9f1c"/>
    <ellipse cx="0" cy="-68" rx="13" ry="9" fill="#fff"/><ellipse cx="-7" cy="-79" rx="5" ry="6" fill="#fff"/><ellipse cx="7" cy="-79" rx="5" ry="6" fill="#fff"/>
    <circle cx="-6" cy="-78" r="2.8" fill="#1f6fe5"/><circle cx="6" cy="-78" r="2.8" fill="#1f6fe5"/><ellipse cx="0" cy="-71" rx="3" ry="2" fill="#111"/>
    <path d="M-5 -65 Q0 -61 5 -65" stroke="#111" stroke-width="1.4" fill="none"/></g>`;
  const knuckles = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="24" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="-11" y="-32" width="8" height="24" fill="#d00000"/><rect x="3" y="-32" width="8" height="24" fill="#d00000"/>
    ${shoe(-9, '#2ec27e')}${shoe(10, '#2ec27e')}
    <path d="M-30 -96 Q-36 -70 -26 -54 Q-24 -76 -18 -88 Z M30 -96 Q36 -70 26 -54 Q24 -76 18 -88 Z M-20 -100 Q-30 -82 -22 -70 Z M20 -100 Q30 -82 22 -70 Z" fill="#d00000"/>
    <ellipse cx="0" cy="-46" rx="17" ry="17" fill="#d00000"/><path d="M-10 -58 Q0 -48 10 -58 Q8 -50 0 -48 Q-8 -50 -10 -58 Z" fill="#fff"/>
    <path d="M-15 -54 L-28 -36 M15 -54 L28 -36" stroke="#d00000" stroke-width="6" stroke-linecap="round"/>
    <circle cx="-30" cy="-32" r="10" fill="#fff" stroke="#bbb"/><circle cx="30" cy="-32" r="10" fill="#fff" stroke="#bbb"/>
    <path d="M-36 -38 L-40 -42 M-30 -40 L-32 -46 M36 -38 L40 -42 M30 -40 L32 -46" stroke="#fff" stroke-width="3"/>
    <circle cx="0" cy="-78" r="20" fill="#d00000"/><ellipse cx="0" cy="-70" rx="12" ry="8" fill="#e9c69a"/>
    <ellipse cx="-6" cy="-81" rx="5" ry="6" fill="#fff"/><ellipse cx="6" cy="-81" rx="5" ry="6" fill="#fff"/><circle cx="-5" cy="-80" r="2.6" fill="#7b2cbf"/><circle cx="5" cy="-80" r="2.6" fill="#7b2cbf"/>
    <path d="M-12 -88 L-2 -84 M12 -88 L2 -84" stroke="#7a0000" stroke-width="2.4"/><ellipse cx="0" cy="-73" rx="3" ry="2" fill="#111"/></g>`;
  const amy = (x, y, s = 1, hammer = true) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="22" ry="5" fill="rgba(0,0,0,.25)"/>
    <rect x="-9" y="-30" width="6" height="22" fill="#ff8fab"/><rect x="3" y="-30" width="6" height="22" fill="#ff8fab"/>
    ${shoe(-7)}${shoe(8)}
    <path d="M-18 -26 L0 -62 L18 -26 Z" fill="#e63946"/><rect x="-6" y="-62" width="12" height="10" fill="#e63946"/>
    <path d="M-10 -54 L-22 -38 M10 -54 L22 -38" stroke="#ff8fab" stroke-width="4.5" stroke-linecap="round"/><circle cx="-23" cy="-36" r="5" fill="#fff"/><circle cx="23" cy="-36" r="5" fill="#fff"/>
    ${hammer ? '<path d="M26 -36 L40 -70" stroke="#ffd23f" stroke-width="4"/><rect x="28" y="-88" width="28" height="20" rx="4" fill="#e63946" stroke="#9d0208" transform="rotate(22 42 -78)"/><rect x="30" y="-82" width="24" height="5" fill="#ffd23f" transform="rotate(22 42 -78)"/>' : ''}
    <path d="M-20 -84 Q-28 -60 -16 -62 M20 -84 Q28 -60 16 -62" stroke="#ff8fab" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="-78" r="19" fill="#ff8fab"/><path d="M-19 -84 Q0 -102 19 -84 Q10 -92 0 -90 Q-10 -92 -19 -84 Z" fill="#e63946"/>
    <path d="M-14 -80 Q-8 -86 -2 -78 Q4 -86 14 -80 L12 -76 Q0 -84 -12 -76 Z" fill="#ff8fab"/>
    <ellipse cx="0" cy="-68" rx="11" ry="8" fill="#f8d39e"/>
    <ellipse cx="-6" cy="-76" rx="4.5" ry="5.5" fill="#fff"/><ellipse cx="6" cy="-76" rx="4.5" ry="5.5" fill="#fff"/><circle cx="-5" cy="-75" r="2.6" fill="#2ec27e"/><circle cx="5" cy="-75" r="2.6" fill="#2ec27e"/>
    <path d="M-4 -64 Q0 -60 4 -64" stroke="#c2185b" stroke-width="1.6" fill="none"/></g>`;
  const eggman = (x, y, s = 1, pod = false) => `<g transform="translate(${x} ${y}) scale(${s})">
    ${pod ? '<path d="M-48 -30 Q0 10 48 -30 L42 -10 Q0 18 -42 -10 Z" fill="#c0c0c0" stroke="#888" stroke-width="2"/><ellipse cx="0" cy="-30" rx="48" ry="10" fill="#e0e0e0"/><path d="M-20 0 L-28 14 M20 0 L28 14" stroke="#ff7b00" stroke-width="5"/>' : '<ellipse rx="30" ry="5" fill="rgba(0,0,0,.25)"/><rect x="-14" y="-26" width="10" height="24" fill="#111"/><rect x="4" y="-26" width="10" height="24" fill="#111"/><ellipse cx="-10" cy="-2" rx="10" ry="5" fill="#333"/><ellipse cx="10" cy="-2" rx="10" ry="5" fill="#333"/>'}
    <ellipse cx="0" cy="-56" rx="32" ry="34" fill="#e63946"/><path d="M-6 -88 L0 -40 L6 -88 Z" fill="#111"/><circle cx="0" cy="-60" r="3" fill="#ffd23f"/><circle cx="0" cy="-48" r="3" fill="#ffd23f"/>
    <path d="M-30 -66 L-44 -40 M30 -66 L44 -40" stroke="#e63946" stroke-width="9" stroke-linecap="round"/><circle cx="-45" cy="-38" r="8" fill="#fff"/><circle cx="45" cy="-38" r="8" fill="#fff"/>
    <circle cx="0" cy="-104" r="20" fill="#f4c7a1"/><ellipse cx="0" cy="-118" rx="16" ry="6" fill="#f4c7a1"/>
    <rect x="-18" y="-124" width="36" height="8" rx="4" fill="#4dd0ff" stroke="#333" stroke-width="2"/>
    <circle cx="-7" cy="-104" r="5" fill="#111"/><circle cx="7" cy="-104" r="5" fill="#111"/><ellipse cx="0" cy="-96" rx="5" ry="4" fill="#ff9f8a"/>
    <path d="M-2 -92 Q-22 -98 -34 -84 Q-22 -88 -4 -88 Z M2 -92 Q22 -98 34 -84 Q22 -88 4 -88 Z" fill="#ff7b00"/></g>`;
  const chao = (x, y, happy) => `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="12" rx="14" ry="5" fill="rgba(0,0,0,.2)"/><ellipse cx="-14" cy="-2" rx="7" ry="4" fill="#fff" transform="rotate(-30 -14 -2)"/><ellipse cx="14" cy="-2" rx="7" ry="4" fill="#fff" transform="rotate(30 14 -2)"/>
    <ellipse cx="0" cy="0" rx="14" ry="13" fill="#9ad0ff"/><circle cx="0" cy="-16" r="11" fill="#9ad0ff"/><path d="M0 -27 L0 -33" stroke="#9ad0ff" stroke-width="2"/>
    <circle cx="0" cy="-36" r="4" fill="#ffd23f"/><ellipse cx="-4" cy="-17" rx="2" ry="3" fill="#111"/><ellipse cx="4" cy="-17" rx="2" ry="3" fill="#111"/>
    ${happy ? '<path d="M-4 -11 Q0 -7 4 -11 Z" fill="#e63946"/>' : '<path d="M-3 -10 L3 -10" stroke="#111" stroke-width="1.4"/>'}</g>`;
  const flicky = (x, y) => `<g transform="translate(${x} ${y})"><ellipse rx="9" ry="7" fill="#3a86ff"/><circle cx="6" cy="-6" r="5.5" fill="#3a86ff"/><path d="M10 -6 L16 -4 L10 -2 Z" fill="#ffb703"/><circle cx="7" cy="-7" r="1.4" fill="#fff"/><ellipse cx="-2" cy="2" rx="5" ry="3" fill="#fff"/></g>`;
  const eggrobo = (x, y, off) => `<g transform="translate(${x} ${y})">
    <ellipse rx="26" ry="5" fill="rgba(0,0,0,.25)"/><rect x="-16" y="-40" width="10" height="38" fill="#8d99ae"/><rect x="6" y="-40" width="10" height="38" fill="#8d99ae"/>
    <rect x="-24" y="-100" width="48" height="62" rx="10" fill="#adb5bd" stroke="#6c757d" stroke-width="2"/>
    <rect x="-34" y="-96" width="10" height="44" rx="5" fill="#8d99ae"/><rect x="24" y="-96" width="10" height="44" rx="5" fill="#8d99ae"/>
    <circle cx="0" cy="-118" r="18" fill="#adb5bd" stroke="#6c757d" stroke-width="2"/>
    ${off ? '<path d="M-10 -124 L-2 -116 M-2 -124 L-10 -116 M2 -124 L10 -116 M10 -124 L2 -116" stroke="#333" stroke-width="3"/>' : '<rect x="-14" y="-124" width="28" height="9" rx="4" fill="#ff1e1e"/>'}
    <rect x="-10" y="-84" width="20" height="10" fill="#e63946"/><text x="0" y="-61" font-size="10" text-anchor="middle" font-weight="900" fill="#333" ${FONT}>EGG</text></g>`;
  const ring = (cx, cy, r = 9) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c99a00" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffd23f" stroke-width="3"/>`;
  const checker = (y0) => Array.from({ length: 40 }, (_, i) => `<rect x="${(i % 10) * 40}" y="${y0 + Math.floor(i / 10) * 20}" width="40" height="20" fill="${(i % 10 + Math.floor(i / 10)) % 2 ? '#9a5a1c' : '#c47a2c'}"/>`).join('') + `<rect y="${y0 - 10}" width="400" height="12" fill="#4cc94c"/>`;

  const SONIC = { name: 'Sonic', icon: '💨' };
  const TAILS = { name: 'Tails', icon: '🦊' };
  const KNUX = { name: 'Knuckles', icon: '👊' };
  const AMY = { name: 'Amy', icon: '💗' };
  const EGG = { name: 'Dottor Eggman', icon: '🥚' };
  const CHAO = { name: 'Chao', icon: '💧' };

  Adventure.world({
    id: 'sonic',
    title: 'Le Avventure di Sonic',
    icon: '💨',
    art: '💨💍💎',
    desc: 'Aiuta Sonic e i suoi amici Tails, Knuckles e Amy a fermare il Dottor Eggman e i suoi robot!',
  });

  /* ======================= CAPITOLO 1 ======================= */
  Adventure.chapter('sonic', {
    id: 'sonic1',
    title: 'Lo Smeraldo Rubato',
    icon: '💎',
    save: 'cg_adv_sonic1',
    start: 'greenhill',
    done: f => f.s_smeraldo,
    items: {
      molla: { icon: '🌀', name: 'Molla', look: 'Una molla super-saltellante: BOING! Con questa si salta altissimo.' },
      chiave: { icon: '🔧', name: 'Chiave inglese', look: 'La chiave inglese di Tails, per aggiustare le macchine.' },
      decoder: { icon: '📟', name: 'Decodificatore', look: 'Il decodificatore di Tails. Sullo schermo lampeggia il codice della porta di Eggman: 🔴 ROSSO, 🔵 BLU, 🟡 GIALLO.' },
      frutto: { icon: '🍐', name: 'Frutto del giardino', look: 'Un frutto succoso a forma di goccia. I Chao ne vanno matti!' },
      gemma: { icon: '💚', name: 'Gemma verde', look: 'La gemmina verde di Knuckles. Brilla come un piccolo Master Emerald.' },
      anello: { icon: '💍', name: 'Anello d’oro', look: 'Un anello d’oro di Sonic. Si può anche lanciare, come un frisbee!' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, go, render } = A;
      const scenes = {
        greenhill: {
          name: '🌴 Green Hill',
          draw: () => skyGrad('#4fb3ff', '#d8f1ff') + '<ellipse cx="80" cy="200" rx="140" ry="70" fill="#7fd46b"/><ellipse cx="330" cy="210" rx="120" ry="60" fill="#3fae4a"/>' +
            checker(210) + palm(370, 200, 120) +
            '<circle cx="250" cy="150" r="46" fill="none" stroke="#c47a2c" stroke-width="14"/><circle cx="250" cy="150" r="46" fill="none" stroke="#4cc94c" stroke-width="4" stroke-dasharray="8 6"/>' +
            '<rect x="20" y="70" width="90" height="16" fill="#c47a2c"/><rect x="20" y="64" width="90" height="8" fill="#4cc94c"/>' +
            (A.f.s_chiave ? '' : '<g transform="translate(64 60) rotate(-20)"><rect x="-14" y="-3" width="26" height="6" rx="2" fill="#8d99ae"/><path d="M12 -8 Q24 -6 20 0 Q24 6 12 8 L14 3 L10 0 L14 -3 Z" fill="#8d99ae"/></g>') +
            '<rect x="146" y="120" width="10" height="90" fill="#8d5a32"/><circle cx="151" cy="112" r="28" fill="#2d6a4f"/>' +
            (A.f.s_frutto ? '' : '<path d="M140 118 Q136 128 142 132 Q148 128 144 118 Z" fill="#ffd23f" stroke="#c99a00"/><path d="M160 108 Q156 118 162 122 Q168 118 164 108 Z" fill="#ffd23f" stroke="#c99a00"/>') +
            (A.f.s_anello ? '' : ring(250, 150, 11)) +
            sonic(200, 232) + exitSign(8, 220, '⬅ Officina') + exitSign(316, 220, 'Isola ➡'),
          spots: () => [
            { id: 'sonic', name: '💨 Sonic', x: 166, y: 112, w: 68, h: 124, talk: talkSonic, look: 'Sonic, il porcospino più veloce del mondo! Batte il piede: non vede l’ora di partire.' },
            { id: 'sporgenza', name: A.f.s_chiave ? '⛰️ Sporgenza' : '🔧 Chiave sulla sporgenza', x: 16, y: 40, w: 100, h: 50, look: A.f.s_chiave ? 'Una sporgenza alta alta.' : 'Lassù, su una sporgenza altissima, c’è una chiave inglese!', take: A.f.s_chiave ? null : () => say(null, 'È troppo in alto! Salto, salto... ma non ci arrivo. Ci vorrebbe qualcosa per saltare più in alto! 🦘'), use: { molla: () => { if (A.f.s_chiave) return say(null, 'Lassù non c’è più niente.'); give('chiave'); step('chiave', 100); say(null, 'Metti la molla per terra e ci salti sopra: BOING! 🌀 Voli fino alla sporgenza e prendi la chiave inglese! 🔧'); render(); } } },
            ...(A.f.s_frutto ? [] : [{ id: 'albero', name: '🌳 Albero da frutto', x: 120, y: 84, w: 64, h: 56, look: 'Un albero con dei frutti gialli a forma di goccia.', take: () => { give('frutto'); step('frutto', 20); say(null, 'Hai raccolto un frutto succoso! 🍐'); render(); } }]),
            ...(A.f.s_anello ? [] : [{ id: 'anello', name: '💍 Anello d’oro', x: 234, y: 134, w: 34, h: 34, look: 'Un anello d’oro che gira su se stesso, come quelli che raccoglie Sonic!', take: () => { give('anello'); step('anello', 20); Sound.ring(); say(null, 'DING! Hai preso un anello d’oro! 💍'); render(); } }]),
            { id: 'giro', name: '🌀 Giro della morte', x: 270, y: 96, w: 60, h: 90, look: 'Un giro della morte! Sonic lo fa in mezzo secondo.' },
            { id: 'exitL', name: 'Verso l’officina', x: 0, y: 210, w: 112, h: 40, go: 'officina' },
            { id: 'exitR', name: 'Verso l’isola', x: 300, y: 210, w: 100, h: 40, go: 'isola' },
          ],
        },
        officina: {
          name: '🔧 L’Officina di Tails',
          draw: () => '<rect width="400" height="250" fill="#ced4da"/>' + Array.from({ length: 8 }, (_, i) => `<path d="M${i * 50} 0 L${i * 50} 190" stroke="#adb5bd" stroke-width="2"/>`).join('') + '<rect y="190" width="400" height="60" fill="#6c757d"/>' +
            '<g transform="translate(250 150)"><ellipse cx="0" cy="0" rx="70" ry="16" fill="#1f6fe5"/><rect x="-90" y="-36" width="180" height="10" rx="4" fill="#1f6fe5"/><rect x="-80" y="14" width="160" height="8" rx="4" fill="#1f6fe5"/><path d="M60 -6 L84 -26 L86 6 Z" fill="#1f6fe5"/><circle cx="-72" cy="0" r="6" fill="#333"/><path d="M-76 -20 L-76 20" stroke="#555" stroke-width="3"/><circle cx="-20" cy="30" r="8" fill="#333"/><circle cx="30" cy="30" r="8" fill="#333"/><text x="0" y="5" font-size="11" text-anchor="middle" fill="#fff" font-weight="900" ' + FONT + '>TORNADO</text></g>' +
            '<rect x="20" y="40" width="110" height="60" fill="#8d5a32"/>' + ['🔨', '🪛', '🔩', '⚙️'].map((e, i) => `<text x="${34 + i * 26}" y="78" font-size="20">${e}</text>`).join('') +
            '<path d="M24 190 Q40 150 70 160 Q90 140 110 170 Q124 160 130 190 Z" fill="#8d99ae"/><circle cx="60" cy="172" r="7" fill="#495057"/><circle cx="96" cy="166" r="6" fill="#495057"/>' +
            (A.f.s_molla ? '' : '<path d="M76 152 L90 148 M76 156 L90 152 M76 160 L90 156 M76 164 L90 160" stroke="#e63946" stroke-width="3"/>') +
            tails(164, 236) + exitSign(316, 220, 'Green Hill ➡'),
          spots: () => [
            { id: 'tails', name: '🦊 Tails', x: 130, y: 120, w: 70, h: 118, talk: talkTails, look: 'Tails, la volpe con due code! È un genio delle macchine.', use: { chiave: () => { drop('chiave'); give('decoder'); step('decoder', 100); dialog([[TAILS, 'La mia chiave inglese! Grazie! Ora finisco il decodificatore... avvita, stringi... FATTO! 🔧'], [TAILS, 'Ecco il decodificatore! Sullo schermo trovi il codice segreto della porta di Eggman. Guardalo bene! 📟']]); } } },
            { id: 'rottami', name: '🔩 Mucchio di rottami', x: 20, y: 140, w: 116, h: 52, look: A.f.s_molla ? 'Rottami di robot e pezzi di ricambio.' : 'Rottami di robot... in mezzo spunta una molla rossa!', take: () => { if (A.f.s_molla) return say(null, 'Solo bulloni e viti arrugginite.'); give('molla'); step('molla', 20); say(null, 'Hai trovato una molla super-saltellante! 🌀 BOING!'); render(); } },
            { id: 'tornado', name: '✈️ Il Tornado', x: 160, y: 104, w: 180, h: 80, look: 'Il Tornado, l’aereo blu di Tails. Ci si può volare dappertutto!' },
            { id: 'attrezzi', name: '🧰 Attrezzi', x: 20, y: 40, w: 110, h: 60, look: 'Martelli, cacciaviti, bulloni... ma manca la chiave inglese!' },
            { id: 'exit', name: 'Verso Green Hill', x: 300, y: 210, w: 100, h: 40, go: 'greenhill' },
          ],
        },
        isola: {
          name: '🏝️ L’Isola degli Angeli',
          draw: () => skyGrad('#90e0ef', '#caf0f8') + '<ellipse cx="200" cy="215" rx="230" ry="60" fill="#4cc94c"/><path d="M-30 215 Q200 300 430 215 L430 250 L-30 250 Z" fill="#8d5a32"/>' +
            '<rect x="40" y="150" width="90" height="40" fill="#adb5bd"/><rect x="50" y="140" width="70" height="12" fill="#ced4da"/><path d="M85 70 L115 110 L85 146 L55 110 Z" fill="#2ec27e" stroke="#1a9c60" stroke-width="3"/><path d="M85 82 L100 110 L85 132 Z" fill="#7dffb0" opacity=".6"/>' +
            '<rect x="330" y="120" width="70" height="80" fill="#495057"/><path d="M330 120 L366 96 L400 120 Z" fill="#e63946"/>' +
            '<path d="M300 186 L330 176" stroke="#8d5a32" stroke-width="5"/>' +
            '<circle cx="250" cy="196" r="10" fill="#ff8fab"/><circle cx="242" cy="190" r="8" fill="#ffc2d1"/><circle cx="258" cy="190" r="8" fill="#ffc2d1"/><circle cx="250" cy="184" r="8" fill="#ffc2d1"/>' +
            chao(250, 166, A.f.s_gemma) +
            knuckles(A.f.s_passaggio ? 170 : 300, 236) + exitSign(8, 222, '⬅ Green Hill') + (A.f.s_passaggio ? exitSign(290, 222, 'Base Eggman ➡') : ''),
          spots: () => [
            { id: 'knux', name: '👊 Knuckles', x: A.f.s_passaggio ? 136 : 266, y: 116, w: 70, h: 124, talk: talkKnux, look: 'Knuckles, il guardiano del Master Emerald. È fortissimo... e un po’ permaloso.', use: { gemma: () => { drop('gemma'); step('passaggio', 100); dialog([[KNUX, 'La mia gemmina verde! Dove l’hai trovata? Grazie, amico! 💚'], [KNUX, 'Va bene, ti lascio passare: la base di Eggman è lì dietro. Dagli una lezione anche da parte mia! 👊']]); render(); } } },
            { id: 'chao', name: '💧 Chao', x: 228, y: 136, w: 46, h: 50, talk: () => say(CHAO, A.f.s_gemma ? 'Chao chao! 💕 (Il Chao è felicissimo e ti saluta con le alette.)' : 'Chao? Chao chao! (Il piccolo Chao stringe una gemmina verde... ma guarda gli alberi di Green Hill e si tocca il pancino: ha fame!)'), look: 'Un piccolo Chao azzurro con una pallina gialla sulla testa. Ha in mano una gemmina verde!', use: { frutto: () => { drop('frutto'); give('gemma'); step('gemma', 100); dialog([[CHAO, 'Chao chao!!! 🍐 (Il Chao mangia il frutto in un boccone e fa una capriola!)'], [null, 'Felice, il Chao ti regala la gemmina verde con cui stava giocando. 💚']]); render(); } } },
            { id: 'master', name: '💚 Master Emerald', x: 40, y: 66, w: 92, h: 124, look: 'Il Master Emerald, il gigantesco smeraldo che fa volare l’Isola degli Angeli!', take: () => say(KNUX, 'GIÙ LE MANI DAL MASTER EMERALD! 😠') },
            { id: 'base', name: '🏭 Base di Eggman', x: 320, y: 90, w: 80, h: 110, look: 'La base di Eggman, tutta di metallo, con il tetto rosso.', go: () => (A.f.s_passaggio ? go('labfuori') : say(KNUX, 'Ehi, ehi! Dove credi di andare? Nessuno passa di qui senza il mio permesso! 😤')) },
            { id: 'exit', name: 'Verso Green Hill', x: 0, y: 212, w: 120, h: 38, go: 'greenhill' },
            ...(A.f.s_passaggio ? [{ id: 'exitR', name: 'Verso la base', x: 286, y: 212, w: 114, h: 38, go: 'labfuori' }] : []),
          ],
        },
        labfuori: {
          name: '🏭 La Base di Eggman',
          draw: () => skyGrad('#adb5bd', '#e9ecef') + '<rect y="40" width="400" height="170" fill="#6c757d"/>' + Array.from({ length: 9 }, (_, i) => `<circle cx="${20 + i * 46}" cy="56" r="3" fill="#495057"/>`).join('') +
            '<rect y="200" width="400" height="50" fill="#343a40"/><path d="M0 200 L400 200" stroke="#ffd23f" stroke-width="6" stroke-dasharray="20 14"/>' +
            '<circle cx="80" cy="110" r="38" fill="#e9ecef"/>' + eggman(80, 170, 0.62).replace('translate(80 170)', 'translate(80 166)') +
            (A.f.s_portaE ? '<rect x="170" y="80" width="100" height="120" fill="#111"/><rect x="176" y="86" width="88" height="114" fill="#ffd23f" opacity=".2"/>' : '<rect x="170" y="80" width="100" height="120" fill="#adb5bd" stroke="#495057" stroke-width="4"/><path d="M220 80 L220 200" stroke="#495057" stroke-width="3"/><rect x="290" y="110" width="44" height="58" rx="6" fill="#212529"/>' + ['#e63946', '#ffd23f', '#3a86ff', '#2ec27e'].map((c, i) => `<circle cx="${302 + (i % 2) * 20}" cy="${126 + Math.floor(i / 2) * 22}" r="7" fill="${c}"/>`).join('')) +
            label(160, 50, 'EGGMAN BASE - VIETATO ENTRARE!', '#ffd23f', '#111', 130) + exitSign(8, 222, '⬅ Isola') + (A.f.s_portaE ? exitSign(176, 172, 'Entra ➡') : ''),
          spots: () => [
            { id: 'porta', name: A.f.s_portaE ? '🚪 Porta aperta' : '🚪 Porta blindata', x: 166, y: 76, w: 172, h: 126, look: A.f.s_portaE ? 'La porta è aperta! Si sentono rumori di robot...' : 'Una porta blindata con una tastiera a 4 pulsanti colorati. Serve il codice segreto di Eggman!', go: A.f.s_portaE ? 'lab' : null, take: A.f.s_portaE ? null : () => A.lock({
              title: '🔐 Tastiera di Eggman', text: 'Premi i 3 colori nell’ordine giusto:', symbols: ['🔴', '🟡', '🔵', '🟢'], code: ['🔴', '🔵', '🟡'],
              ok: () => { step('portaE', 150); render(); say(null, 'BIP BIP BIIIP! ✅ La porta blindata si apre con un sibilo: FSSSH!', [{ label: '➡ Entra', fn: () => go('lab') }]); },
              fail: '🔊 «HO HO HO! Codice sbagliato, porcospino!» ride la voce di Eggman. Forse qualcuno ha decifrato il codice...', leave: 'La porta resta chiusa.',
            }) },
            { id: 'poster', name: '🥚 Faccione di Eggman', x: 40, y: 70, w: 80, h: 100, look: 'Un enorme ritratto del Dottor Eggman che sorride soddisfatto. Che vanitoso!' },
            { id: 'exit', name: 'Verso l’isola', x: 0, y: 212, w: 100, h: 38, go: 'isola' },
          ],
        },
        lab: {
          name: '🧪 Il Laboratorio di Eggman',
          draw: () => '<rect width="400" height="250" fill="#212529"/>' + glow('advlab', '#2ec27e', 0.7, 0.45) + '<rect y="206" width="400" height="44" fill="#343a40"/>' +
            Array.from({ length: 6 }, (_, i) => `<rect x="${10 + i * 20}" y="30" width="14" height="${40 + (i * 13) % 50}" fill="${['#3a86ff', '#2ec27e', '#ffd23f'][i % 3]}" opacity=".7"/>`).join('') +
            '<rect x="280" y="80" width="80" height="120" rx="30" fill="rgba(160,255,200,.25)" stroke="#adb5bd" stroke-width="4"/><rect x="270" y="190" width="100" height="16" fill="#6c757d"/>' +
            (A.f.s_smeraldo ? '' : '<path d="M320 110 L346 140 L320 176 L294 140 Z" fill="#2ec27e" stroke="#7dffb0" stroke-width="2"/><path d="M320 120 L334 140 L320 162 Z" fill="#b7ffd8" opacity=".7"/>') +
            eggrobo(220, 236, A.f.s_robot) +
            (A.f.s_robot ? '' : '<rect x="236" y="96" width="24" height="18" rx="4" fill="#ff1e1e" stroke="#9d0208" stroke-width="2"/><text x="248" y="90" font-size="8" text-anchor="middle" fill="#ffd23f" font-weight="900" ' + FONT + '>NON PREMERE</text>') +
            (A.f.s_smeraldo ? '' : eggman(90, 200, 0.85, true)) + exitSign(8, 222, '⬅ Fuori'),
          spots: () => [
            ...(A.f.s_smeraldo ? [] : [{ id: 'eggman', name: '🥚 Dottor Eggman', x: 40, y: 90, w: 100, h: 116, talk: () => say(EGG, A.f.s_robot ? 'NOOO! Il mio robot! Come hai fatto?! 😱' : 'HO HO HO! Benvenuto nel mio laboratorio! Lo Smeraldo del Caos è mio, e il mio Eggrobo lo protegge! Non lo avrai mai! 🥚'), look: 'Il Dottor Eggman sulla sua navicella. Ha dei baffi enormi e un sorriso da furbetto.' }]),
            { id: 'robot', name: A.f.s_robot ? '🤖 Robot spento' : '🤖 Eggrobo', x: 180, y: 108, w: 54, h: 128, look: A.f.s_robot ? 'L’Eggrobo è spento e non si muove più.' : 'Un robot enorme che fa la guardia alla capsula. Sulla schiena ha un grosso pulsante rosso con scritto “NON PREMERE”...', take: () => say(null, A.f.s_robot ? 'Il robot è spento: meglio lasciarlo lì.' : 'BIP BOP! Il robot ti blocca con il braccio di metallo: «ACCESSO NEGATO!» 🤖') },
            ...(A.f.s_robot ? [] : [{ id: 'pulsante', name: '🔴 Pulsante “NON PREMERE”', x: 230, y: 80, w: 40, h: 40, look: 'Un grosso pulsante rosso sulla schiena del robot. C’è scritto “NON PREMERE”. Chissà cosa succede se lo premi...', take: () => say(null, 'Il pulsante è troppo in alto e il robot si gira sempre! Se solo potessi lanciarci contro qualcosa... 🎯'), use: { anello: () => { drop('anello'); step('robot', 150); render(); dialog([[null, 'Lanci l’anello d’oro come un frisbee... DING! Colpisce il pulsante rosso in pieno! 🎯'], [null, 'BIP... BOP... bzzzz... L’Eggrobo si spegne con un ultimo bip triste. 🤖💤'], [EGG, 'NOOOO! Il mio robottone! Chi ha scritto NON PREMERE? Ah già, io... 😩']]); } } }]),
            { id: 'capsula', name: '💎 Capsula dello Smeraldo', x: 276, y: 76, w: 90, h: 128, look: A.f.s_smeraldo ? 'La capsula è vuota.' : 'Dentro la capsula di vetro brilla lo Smeraldo del Caos!', take: () => {
              if (A.f.s_smeraldo) return say(null, 'La capsula è vuota.');
              if (!A.f.s_robot) return say(null, 'Il robot ti sbarra la strada: BIP BOP! Prima devi fermarlo! 🤖');
              step('smeraldo', 300); render(); finale();
            } },
            { id: 'exit', name: 'Verso l’uscita', x: 0, y: 212, w: 92, h: 38, go: 'labfuori' },
          ],
        },
      };

      function talkSonic() {
        if (!A.f.s_q) {
          return dialog([
            [SONIC, `Ehi, ${App.playerName()}! Ti stavo aspettando! 💨`],
            [SONIC, 'Brutte notizie: il Dottor Eggman ha rubato lo Smeraldo del Caos e l’ha chiuso nel suo laboratorio!'],
            [SONIC, 'La sua base è oltre l’Isola degli Angeli, ma Knuckles non fa passare nessuno... e la porta ha un codice segreto.'],
            [SONIC, 'Tails sta costruendo un decodificatore per scoprire il codice. Vai a trovarlo nella sua officina! Io faccio un giretto di ricognizione... in 3 secondi! 😎'],
          ], () => step('q', 50));
        }
        if (A.f.s_smeraldo) return say(SONIC, 'Sei stato fantastico! Andiamo a festeggiare con un chili dog! 🌭');
        const todo = [];
        if (!has('decoder') && !A.f.s_portaE) todo.push('📟 farti dare il decodificatore da Tails');
        if (!A.f.s_passaggio) todo.push('👊 convincere Knuckles a farti passare');
        todo.push('💎 riprendere lo Smeraldo del Caos');
        say(SONIC, `Forza, che siamo lenti! Ancora:<br>${todo.join('<br>')}`);
      }

      function talkTails() {
        if (A.f.s_decoder) return say(TAILS, 'Il decodificatore funziona alla grande! Guarda il codice sullo schermo (tocca due volte il decodificatore nello zaino). 📟');
        say(TAILS, 'Ciao! Sto finendo il decodificatore per scoprire il codice della porta di Eggman... ma ho perso la mia chiave inglese! 😟 L’ho vista volare via a Green Hill: è finita su una sporgenza altissima!');
      }

      function talkKnux() {
        if (A.f.s_passaggio) return say(KNUX, 'Passa pure, amico! Io resto qui a fare la guardia al Master Emerald. 💚');
        say(KNUX, 'Fermo lì! Io sono Knuckles e qui non passa nessuno! 😤 ...Però, ecco... un Chao mi ha preso la mia gemmina verde per giocarci. Se me la riporti, forse ti lascio passare.');
      }

      function finale() {
        A.finish({
          lines: [
            [null, 'Apri la capsula e prendi lo Smeraldo del Caos! 💎✨'],
            [EGG, 'Non è finita, porcospino! Me la pagherete! La prossima volta costruirò un robot ancora più grande! 😤🚀'],
            [null, 'Eggman scappa via sulla sua navicella, inseguito da una nuvola di fumo. FIUUUM!'],
            [SONIC, `Wooo! ${App.playerName()}, sei stato velocissimo! Lo Smeraldo del Caos è salvo! 💨💎`],
          ],
          title: 'Smeraldo salvato! 💎💨',
          msg: 'Hai fermato l’Eggrobo e ripreso lo Smeraldo del Caos!',
        });
      }

      function hint() {
        const f = A.f;
        if (!f.s_q) return 'Parla con Sonic a Green Hill.';
        if (!f.s_decoder) {
          if (has('chiave')) return 'Porta la chiave inglese a Tails nell’officina.';
          if (!f.s_molla) return 'Nell’officina di Tails, nel mucchio di rottami, c’è una molla: prendila.';
          return 'A Green Hill seleziona la molla e tocca la sporgenza alta con la chiave inglese.';
        }
        if (!f.s_passaggio) {
          if (has('gemma')) return 'Dai la gemmina verde a Knuckles sull’Isola degli Angeli.';
          if (!f.s_frutto) return 'A Green Hill c’è un albero con dei frutti gialli: prendine uno.';
          return 'Dai il frutto al piccolo Chao sull’isola: ti darà la gemmina verde.';
        }
        if (!f.s_portaE) return 'Guarda il decodificatore (toccalo due volte nello zaino) per leggere il codice. Poi alla base tocca la porta e scegli “Prendi”.';
        if (!f.s_robot) return has('anello') ? 'Seleziona l’anello d’oro e lancialo sul pulsante rosso del robot.' : 'A Green Hill, nel giro della morte, c’è un anello d’oro: prendilo e lancialo sul pulsante del robot!';
        return 'Ora che il robot è spento, tocca la capsula e prendi lo smeraldo!';
      }

      const arrive = {
        greenhill: 'Green Hill: prati verdi, palme e terra a scacchi. Sonic è qui!',
        officina: 'L’officina di Tails: attrezzi dappertutto e l’aereo Tornado al centro.',
        isola: 'L’Isola degli Angeli! Brilla il gigantesco Master Emerald... e Knuckles fa la guardia.',
        labfuori: 'La base di Eggman: metallo, bulloni e una porta blindata con una tastiera colorata.',
        lab: 'Il laboratorio di Eggman! Dentro una capsula brilla lo Smeraldo del Caos!',
      };
      return { scenes, hint, arrive, welcome: `Sei a Green Hill, ${U.esc(App.playerName())}! Sonic ti sta aspettando: toccalo e parla con lui! 👆` };
    },
  });

  /* ======================= CAPITOLO 2 ======================= */
  const TOKENS = ['gettone1', 'gettone2', 'gettone3'];
  Adventure.chapter('sonic', {
    id: 'sonic2',
    title: 'Il Luna Park di Eggman',
    icon: '🎡',
    save: 'cg_adv_sonic2',
    start: 'fiera',
    done: f => f.s_flicky,
    items: {
      gettone1: { icon: '🪙', name: 'Gettone del tiro', look: 'Un gettone vinto al tiro a segno.' },
      gettone2: { icon: '🪙', name: 'Gettone delle paperelle', look: 'Un gettone vinto alla pesca delle paperelle.' },
      gettone3: { icon: '🪙', name: 'Gettone di Knuckles', look: 'Il gettone vinto da Knuckles al martellone.' },
      biglietto: { icon: '🎟️', name: 'Biglietto', look: 'Un biglietto d’ingresso per l’Eggman Park.' },
      guantoni: { icon: '🥊', name: 'Guantoni', look: 'I guantoni di Knuckles. Pesantissimi!' },
      martello: { icon: '🔨', name: 'Martello Piko Piko', look: 'Il martello di Amy: piccolo ma potentissimo! BONK!' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, go, render } = A;
      const gotTokens = () => TOKENS.filter(t => A.f['s_' + t]).length;
      const lights = Array.from({ length: 16 }, (_, i) => `<circle cx="${i * 26 + 8}" cy="${18 + (i % 2) * 6}" r="4" fill="${['#ffd23f', '#ff4d6d', '#4dd0ff'][i % 3]}"/>`).join('');

      const scenes = {
        fiera: {
          name: '🎪 Ingresso dell’Eggman Park',
          draw: () => skyGrad('#240046', '#5a189a') + lights + '<rect y="200" width="400" height="50" fill="#3c096c"/>' +
            '<path d="M150 200 L150 70 Q220 20 290 70 L290 200 L270 200 L270 90 Q220 50 170 90 L170 200 Z" fill="#e63946" stroke="#ffd23f" stroke-width="3"/>' + label(176, 56, 'EGGMAN PARK', '#ffd23f', '#9d0208', 88) +
            (A.f.s_entrata ? '' : Array.from({ length: 6 }, (_, i) => `<rect x="${174 + i * 16}" y="96" width="6" height="104" fill="#adb5bd"/>`).join('')) +
            '<rect x="30" y="110" width="80" height="90" fill="#f72585"/><rect x="40" y="124" width="60" height="34" fill="#4dd0ff"/><path d="M26 110 L70 84 L114 110 Z" fill="#ffd23f"/>' + label(36, 166, 'BIGLIETTI', '#fff', '#9d0208', 68) +
            '<g transform="translate(70 158)"><circle cx="0" cy="-24" r="10" fill="#adb5bd"/><rect x="-6" y="-28" width="12" height="4" fill="#ff1e1e"/></g>' +
            '<rect x="310" y="110" width="80" height="90" fill="#fff"/>' + Array.from({ length: 4 }, (_, i) => `<path d="M${310 + i * 20} 100 L${330 + i * 20} 100 L${330 + i * 20} 116 Q${320 + i * 20} 122 ${310 + i * 20} 116 Z" fill="${i % 2 ? '#fff' : '#e63946'}"/>`).join('') +
            [[330, 140], [350, 130], [370, 145]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="#e63946" stroke-width="3"/><circle cx="${x}" cy="${y}" r="3" fill="#e63946"/>`).join('') + label(314, 176, 'TIRO A SEGNO', '#e63946', '#fff', 72) +
            sonic(126, 236, 0.9) + exitSign(316, 222, 'Giostre ➡') + (A.f.s_entrata ? exitSign(176, 178, 'Entra ➡') : ''),
          spots: () => [
            { id: 'sonic', name: '💨 Sonic', x: 96, y: 128, w: 60, h: 110, talk: talkSonic2, look: 'Sonic batte il piede: non vede l’ora di liberare i Flicky!' },
            { id: 'biglietteria', name: '🎟️ Biglietteria', x: 30, y: 84, w: 82, h: 116, talk: () => say({ name: 'Robot bigliettaio', icon: '🤖' }, A.f.s_biglietto ? 'BIP! Hai già il biglietto. BUON DIVERTIMENTO. BIP.' : `BIP BOP. UN BIGLIETTO COSTA 3 GETTONI. NE HAI DATI ${A.f.tok || 0}. I GETTONI SI VINCONO ALLE GIOSTRE. BIP.`), look: 'Una biglietteria con un robot che fa BIP BOP.', use: Object.fromEntries(TOKENS.map(t => [t, () => payToken(t)])) },
            { id: 'tiro', name: '🎯 Tiro a segno', x: 308, y: 96, w: 86, h: 106, talk: tiroASegno, look: 'Il tiro a segno! Chi colpisce il bersaglio giusto vince un gettone.' },
            { id: 'cancello', name: A.f.s_entrata ? '🎪 Ingresso aperto' : '🚧 Cancello chiuso', x: 150, y: 60, w: 140, h: 140, look: A.f.s_entrata ? 'Il cancello è aperto! Dentro c’è il tendone del circo.' : 'Il cancello del parco è chiuso. Per entrare serve un biglietto.', go: () => (A.f.s_entrata ? go('tendone') : say(null, 'Il cancello è chiuso! Serve un biglietto. 🎟️')), use: { biglietto: () => { drop('biglietto'); step('entrata', 100); say(null, 'Infili il biglietto nella fessura: DING! Il cancello si apre! 🎪', [{ label: '➡ Entra', fn: () => go('tendone') }]); render(); } } },
            { id: 'exitR', name: 'Verso le giostre', x: 300, y: 212, w: 100, h: 38, go: 'giostre' },
          ],
        },
        giostre: {
          name: '🎡 Le Giostre',
          draw: () => skyGrad('#240046', '#5a189a') + lights + '<rect y="200" width="400" height="50" fill="#3c096c"/>' +
            '<circle cx="110" cy="100" r="70" fill="none" stroke="#ffd23f" stroke-width="4"/>' + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M110 100 L${110 + 70 * Math.cos(a)} ${100 + 70 * Math.sin(a)}" stroke="#ffd23f" stroke-width="2"/><rect x="${100 + 70 * Math.cos(a)}" y="${96 + 70 * Math.sin(a)}" width="20" height="14" rx="3" fill="${['#e63946', '#4dd0ff', '#2ec27e', '#ff9f1c'][i % 4]}"/>`; }).join('') + '<path d="M110 100 L80 200 M110 100 L140 200" stroke="#adb5bd" stroke-width="5"/>' +
            '<rect x="190" y="160" width="80" height="40" fill="#4dd0ff"/><rect x="186" y="156" width="88" height="8" fill="#fff"/>' + [[204, 168], [224, 174], [244, 166], [262, 172]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="7" ry="5" fill="#ffd23f"/><circle cx="5" cy="-5" r="4" fill="#ffd23f"/><path d="M8 -5 L12 -4 L8 -3 Z" fill="#ff7b00"/></g>`).join('') + label(194, 140, 'PAPERELLE', '#fff', '#1f6fe5', 72) +
            '<rect x="340" y="40" width="12" height="160" fill="#adb5bd"/><circle cx="346" cy="36" r="12" fill="#ffd23f"/><rect x="326" y="190" width="40" height="12" fill="#e63946"/>' + Array.from({ length: 6 }, (_, i) => `<path d="M352 ${60 + i * 22} L362 ${60 + i * 22}" stroke="#fff" stroke-width="2"/>`).join('') +
            knuckles(300, 236, 0.85) + tails(60, 236, 0.75) + exitSign(8, 222, '⬅ Ingresso') + exitSign(256, 6, 'Casa degli specchi ➡'),
          spots: () => [
            { id: 'paperelle', name: '🦆 Pesca delle paperelle', x: 186, y: 136, w: 90, h: 66, talk: paperelle, look: 'Una vasca piena di paperelle che girano. Ogni paperella ha un disegno sotto la pancia!' },
            { id: 'knux', name: '👊 Knuckles', x: 270, y: 132, w: 60, h: 106, talk: () => (A.f.s_gettone3 ? say(KNUX, 'Hai visto che colpo? DING! Sono il più forte! 💪') : say(KNUX, 'Grrr! Voglio vincere al martellone, ma ho perso i miei guantoni nella Casa degli Specchi! Senza guantoni non posso colpire forte! 😤 Se me li ritrovi, il gettone che vinco è tuo.')), look: 'Knuckles guarda il martellone: vuole battere il record!', use: { guantoni: () => { drop('guantoni'); give('gettone3'); step('gettone3', 100); dialog([[KNUX, 'I miei guantoni! Ora guarda... HIIIYAAA! 👊'], [null, 'DIIING! Il disco sale fino in cima e suona la campana! Record battuto! 🔔'], [KNUX, 'Tieni, il gettone è tuo come promesso! 🪙']]); } } },
            { id: 'tails', name: '🦊 Tails', x: 30, y: 140, w: 62, h: 68, talk: () => say(TAILS, 'Ciao! La Casa degli Specchi è un labirinto... Un trucco: segui sempre lo specchio con la stellina che brilla! ⭐'), look: 'Tails sta guardando la ruota panoramica con il naso all’insù.' },
            { id: 'martellone', name: '🔔 Martellone', x: 324, y: 24, w: 48, h: 180, look: 'Il martellone: chi colpisce più forte fa suonare la campana!' },
            { id: 'ruota', name: '🎡 Ruota panoramica', x: 40, y: 30, w: 140, h: 110, look: 'Una ruota panoramica piena di luci colorate. Gira piano piano.' },
            { id: 'exitL', name: 'Verso l’ingresso', x: 0, y: 212, w: 108, h: 38, go: 'fiera' },
            { id: 'exitR', name: 'Verso la casa degli specchi', x: 250, y: 0, w: 150, h: 30, go: 'specchi' },
          ],
        },
        specchi: {
          name: '🪞 La Casa degli Specchi',
          draw: () => '<rect width="400" height="250" fill="#3c096c"/>' + glow('advmirror', '#c084fc') + '<rect y="210" width="400" height="40" fill="#240046"/>' +
            [70, 200, 330].map(x => `<rect x="${x - 40}" y="40" width="80" height="166" rx="40" fill="#b8c0ff" stroke="#ffd23f" stroke-width="4"/><rect x="${x - 30}" y="52" width="60" height="146" rx="30" fill="#e0e7ff" opacity=".7"/>` + sonic(x, 196, 0.55).replace('scale(0.55)', `scale(${x === 200 ? 0.55 : -0.55} 0.55)`)).join('') +
            (A.f.s_guantoni ? '' : '<g transform="translate(200 230)"><circle cx="-12" cy="0" r="10" fill="#e63946"/><circle cx="12" cy="0" r="10" fill="#e63946"/></g>') +
            exitSign(8, 222, '⬅ Giostre'),
          spots: () => [
            { id: 'labirinto', name: '🪞 Labirinto di specchi', x: 30, y: 40, w: 340, h: 170, look: A.f.s_guantoni ? 'Il labirinto di specchi. Ormai lo conosci a memoria!' : 'Tanti specchi tutti uguali... In fondo al labirinto si vedono due guantoni rossi!', go: () => (A.f.s_guantoni ? say(null, 'Hai già trovato i guantoni!') : maze(0)) },
            { id: 'exit', name: 'Verso le giostre', x: 0, y: 212, w: 108, h: 38, go: 'giostre' },
          ],
        },
        tendone: {
          name: '🎪 Il Tendone',
          draw: () => '<rect width="400" height="250" fill="#ffd6e0"/>' + Array.from({ length: 10 }, (_, i) => `<path d="M200 0 L${i * 44} 200 L${i * 44 + 22} 200 Z" fill="${i % 2 ? '#e63946' : '#fff'}" opacity=".85"/>`).join('') + '<rect y="200" width="400" height="50" fill="#8d5a32"/>' +
            [[270, 90], [330, 120], [270, 150]].map(([x, y]) => `<rect x="${x}" y="${y}" width="44" height="40" rx="5" fill="none" stroke="#adb5bd" stroke-width="3"/>` + (A.f.s_flicky ? '' : flicky(x + 22, y + 26) + Array.from({ length: 5 }, (_, i) => `<path d="M${x + 4 + i * 9} ${y} L${x + 4 + i * 9} ${y + 40}" stroke="#adb5bd" stroke-width="2"/>`).join(''))).join('') +
            amy(140, 236, 1, !A.f.s_martello) + exitSign(8, 222, '⬅ Uscita') + exitSign(300, 222, 'Torre ➡'),
          spots: () => [
            { id: 'amy', name: '💗 Amy', x: 106, y: 128, w: 76, h: 112, talk: talkAmy, look: 'Amy Rose, con il suo martello Piko Piko. È arrabbiatissima con Eggman!' },
            { id: 'gabbie', name: '🐦 Gabbie dei Flicky', x: 264, y: 84, w: 116, h: 112, look: 'Tanti piccoli Flicky blu chiusi nelle gabbie. Pigolano tristi: piu piu!', take: () => say(AMY, 'Le ho provate tutte! Le gabbie si aprono solo dalla torre di controllo! 😤') },
            { id: 'exitL', name: 'Verso l’ingresso', x: 0, y: 212, w: 100, h: 38, go: 'fiera' },
            { id: 'exitR', name: 'Verso la torre', x: 296, y: 212, w: 104, h: 38, go: 'torre' },
          ],
        },
        torre: {
          name: '🗼 La Torre di Controllo',
          draw: () => '<rect width="400" height="250" fill="#212529"/>' + '<rect x="0" y="30" width="400" height="70" fill="#0b132b"/>' + Array.from({ length: 12 }, (_, i) => `<circle cx="${i * 34 + 14}" cy="${46 + (i * 17) % 40}" r="2" fill="#fff"/>`).join('') + '<rect y="210" width="400" height="40" fill="#343a40"/>' +
            '<rect x="220" y="120" width="170" height="90" rx="8" fill="#495057" stroke="#adb5bd" stroke-width="3"/>' + [0, 1, 2, 3].map(i => `<rect x="${244 + i * 38}" y="140" width="10" height="50" rx="5" fill="#212529"/><circle cx="${249 + i * 38}" cy="${A.f.s_flicky ? (i === 1 || i === 2 ? 186 : 144) : 166}" r="9" fill="#e63946"/>`).join('') + label(232, 196, 'GABBIE DEI FLICKY', '#ffd23f', '#111', 146) +
            (A.f.s_roboT ? eggrobo(120, 236, true).replace('translate(120 236)', 'translate(100 236) rotate(-80)') : eggrobo(170, 236, false)) + exitSign(8, 222, '⬅ Tendone'),
          spots: () => [
            { id: 'robot', name: A.f.s_roboT ? '🤖 Robot ko' : '🤖 Eggrobo di guardia', x: A.f.s_roboT ? 40 : 130, y: A.f.s_roboT ? 180 : 108, w: A.f.s_roboT ? 140 : 80, h: A.f.s_roboT ? 50 : 128, look: A.f.s_roboT ? 'Il robot è tutto ammaccato e dorme: zzz...' : 'Un Eggrobo fa la guardia al pannello di controllo. È fatto di metallo durissimo!', take: () => say(null, A.f.s_roboT ? 'Meglio lasciarlo dormire.' : 'BIP BOP! «ALT! SOLO EGGMAN PUÒ USARE IL PANNELLO!» Il robot non si sposta. Ci vorrebbe qualcosa di molto forte per farlo spostare...'), use: { martello: () => { drop('martello'); step('roboT', 150); dialog([[null, 'Prendi il martello Piko Piko di Amy e... BONK! 🔨'], [null, 'Il robot fa un giro su se stesso, gli girano gli occhi e cade a terra: CRASH! 🤖💫']]); render(); } } },
            { id: 'pannello', name: '🎛️ Pannello delle leve', x: 216, y: 116, w: 178, h: 96, look: 'Un pannello con 4 leve. Ognuna può andare SU ⬆️ o GIÙ ⬇️.', take: () => {
              if (!A.f.s_roboT) return say(null, 'Il robot ti blocca: BIP BOP! Non puoi toccare il pannello! 🤖');
              if (A.f.s_flicky) return say(null, 'Le gabbie sono già aperte!');
              A.lock({
                title: '🎛️ Pannello delle leve', text: 'Metti le 4 leve nella posizione giusta:', symbols: ['⬆️', '⬇️'], code: ['⬆️', '⬇️', '⬇️', '⬆️'],
                ok: () => { step('flicky', 300); render(); finale(); },
                fail: 'BZZZT! 🔊 «Leve sbagliate!» Forse qualcuno ha sentito Eggman canticchiare la combinazione...', leave: 'Lasci le leve come sono.',
              });
            } },
            { id: 'exit', name: 'Verso il tendone', x: 0, y: 212, w: 108, h: 38, go: 'tendone' },
          ],
        },
      };

      function talkSonic2() {
        if (!A.f.s_q) {
          return dialog([
            [SONIC, `${App.playerName()}! Eggman ha costruito un luna park... ma è una trappola! 🎡`],
            [SONIC, 'Ha rinchiuso i Flicky, i miei amici uccellini, nelle gabbie del tendone del circo! 🐦'],
            [SONIC, 'Il cancello si apre solo con un biglietto, e il robot della biglietteria vuole 3 gettoni. I gettoni si vincono alle giostre!'],
            [SONIC, 'Io vado a cercare Amy, che è già entrata. Ci vediamo dentro! 💨'],
          ], () => step('q', 50));
        }
        say(SONIC, A.f.s_entrata ? 'Dentro il tendone c’è Amy: ti aspetta!' : `Gettoni vinti: ${gotTokens()} su 3. Dalli al robot della biglietteria!`);
      }

      function payToken(t) {
        drop(t);
        A.f.tok = (A.f.tok || 0) + 1;
        step('pay_' + t, 20);
        if (A.f.tok < 3) return say({ name: 'Robot bigliettaio', icon: '🤖' }, `BIP! GETTONE RICEVUTO: ${A.f.tok} SU 3. BIP BOP.`);
        give('biglietto');
        step('biglietto', 100);
        say({ name: 'Robot bigliettaio', icon: '🤖' }, 'BIP BIP BIP! 3 GETTONI RICEVUTI! ECCO IL TUO BIGLIETTO. 🎟️ BUON DIVERTIMENTO. BIP.');
      }

      function tiroASegno() {
        if (A.f.s_gettone1) return say({ name: 'Signore del tiro a segno', icon: '🎯' }, 'Complimenti ancora, campione!');
        const opts = U.shuffle([['2 + 3', false], ['4 + 4', true], ['1 + 6', false]]);
        say({ name: 'Signore del tiro a segno', icon: '🎯' }, 'Venghino! Ci sono 3 bersagli e su ognuno c’è un’addizione. Colpisci il bersaglio che vale <b>DI PIÙ</b> e vinci un gettone!', opts.map(([t, ok]) => ({
          label: `🎯 Bersaglio “${t}”`,
          fn: () => {
            if (ok) { give('gettone1'); step('gettone1', 100); Sound.good(); say({ name: 'Signore del tiro a segno', icon: '🎯' }, 'CENTRO! 4 + 4 fa 8, il numero più grande! Ecco il tuo gettone! 🪙'); }
            else { Sound.bad(); say({ name: 'Signore del tiro a segno', icon: '🎯' }, `Peccato! ${t} non è il bersaglio che vale di più. Conta bene e riprova!`); }
          },
        })));
      }

      function paperelle() {
        if (A.f.s_gettone2) return say({ name: 'Signora delle paperelle', icon: '🦆' }, 'Che occhio che hai! Torna a trovarci!');
        const opts = U.shuffle([['🦆 Paperella con la stella gialla', false], ['🦆 Paperella con la stella blu', true], ['🦆 Paperella con il cuore blu', false], ['🦆 Paperella con il cuore giallo', false]]);
        say({ name: 'Signora delle paperelle', icon: '🦆' }, 'Pesca la paperella vincente! Te lo dico in segreto: è quella con la <b>STELLA BLU</b> sotto la pancia. Quale prendi?', opts.map(([t, ok]) => ({
          label: t,
          fn: () => {
            if (ok) { give('gettone2'); step('gettone2', 100); Sound.good(); say({ name: 'Signora delle paperelle', icon: '🦆' }, 'Stella blu! Hai vinto un gettone! 🪙'); }
            else { Sound.bad(); say({ name: 'Signora delle paperelle', icon: '🦆' }, 'Oh no, non è quella giusta! Ricorda: stella... blu! Riprova.'); }
          },
        })));
      }

      // labirinto di specchi: 3 passi, bisogna scegliere lo specchio con la stellina
      function maze(stepN) {
        if (stepN >= 3) {
          give('guantoni');
          step('guantoni', 100);
          render();
          return say(null, 'Sei arrivato in fondo al labirinto! Per terra ci sono i guantoni rossi di Knuckles! 🥊');
        }
        const sides = ['sinistra', 'centro', 'destra'];
        const good = U.ri(0, 2);
        say({ name: 'Casa degli specchi', icon: '🪞' }, `<b>Passo ${stepN + 1} di 3</b><br>Davanti a te ci sono 3 specchi. In quello ${good === 1 ? 'al centro' : 'a ' + sides[good]} brilla una piccola stella ⭐. Da che parte vai?`, sides.map((s, i) => ({
          label: `${['⬅️', '⬆️', '➡️'][i]} Specchio ${i === 1 ? 'al centro' : 'a ' + s}`,
          fn: () => (i === good ? (Sound.good(), maze(stepN + 1)) : (Sound.bad(), say(null, 'BONK! 🤕 Hai sbattuto il naso contro uno specchio! Ti ritrovi all’ingresso del labirinto.', [{ label: '🔄 Riprova', fn: () => maze(0) }]))),
        })));
      }

      function talkAmy() {
        if (!A.f.s_amy) {
          return dialog([
            [AMY, `${App.playerName()}! Finalmente! Guarda i poveri Flicky chiusi nelle gabbie! 😢`],
            [AMY, 'Le gabbie si aprono solo dal pannello delle leve nella torre di controllo... ma c’è un Eggrobo di guardia!'],
            [AMY, 'Prendi il mio martello Piko Piko: con quello nessun robot ti fermerà! 🔨'],
            [AMY, 'E ho sentito Eggman canticchiare la combinazione delle leve: «Su, giù, giù, su... la leva più bella sei tu!» 🎶'],
          ], () => { give('martello'); A.f.s_martello = true; step('amy', 100); render(); });
        }
        say(AMY, 'Ricorda la canzoncina di Eggman: «Su, giù, giù, su»! E dai una bella martellata a quel robot! 🔨💗');
      }

      function finale() {
        A.finish({
          lines: [
            [null, 'Abbassi e alzi le leve... SU, GIÙ, GIÙ, SU! CLANG CLANG CLANG! Tutte le gabbie si aprono! 🔓'],
            [null, 'I Flicky volano fuori felici e cinguettano: piu piu piu! 🐦🐦🐦'],
            [EGG, 'NOOO! Il mio luna park! I miei Flicky! Me la pagherete! 😡🚀'],
            [AMY, 'Bravissimo! Sei il mio eroe... dopo Sonic, ovviamente! 💗'],
            [SONIC, `Missione compiuta, ${App.playerName()}! Ora facciamo un giro sulle giostre... gratis! 🎡💨`],
          ],
          title: 'Flicky liberi! 🐦🎡',
          msg: 'Hai battuto i robot di Eggman e liberato tutti i Flicky!',
        });
      }

      function hint() {
        const f = A.f;
        if (!f.s_q) return 'Parla con Sonic all’ingresso del parco.';
        if (!f.s_biglietto) {
          if (TOKENS.some(t => has(t))) return 'Dai i gettoni al robot della biglietteria: seleziona un gettone e tocca la biglietteria.';
          if (!f.s_gettone1) return 'Prova il tiro a segno all’ingresso: scegli il bersaglio con l’addizione che fa di più.';
          if (!f.s_gettone2) return 'Alle giostre prova la pesca delle paperelle: scegli quella con la stella blu.';
          if (!f.s_gettone3) return has('guantoni') ? 'Dai i guantoni a Knuckles alle giostre.' : 'Knuckles ha perso i guantoni nella Casa degli Specchi: entra e segui sempre lo specchio con la stellina.';
        }
        if (!f.s_entrata) return 'Seleziona il biglietto e tocca il cancello del parco.';
        if (!f.s_amy) return 'Nel tendone parla con Amy.';
        if (!f.s_roboT) return 'Nella torre seleziona il martello di Amy e tocca il robot.';
        return 'Tocca il pannello delle leve e scegli “Prendi”: la canzoncina di Eggman è «Su, giù, giù, su».';
      }

      const arrive = {
        fiera: 'Luci, musica e zucchero filato... è l’Eggman Park! Ma il cancello è chiuso.',
        giostre: 'Le giostre! Una ruota panoramica, la pesca delle paperelle e il martellone. Ci sono anche Tails e Knuckles!',
        specchi: 'La Casa degli Specchi: vedi tanti Sonic da tutte le parti! Quale strada sarà quella giusta?',
        tendone: 'Il tendone del circo: in alto ci sono le gabbie dei Flicky! E c’è Amy!',
        torre: 'La torre di controllo di Eggman, con un pannello pieno di leve... e un robot di guardia!',
      };
      return { scenes, hint, arrive, welcome: `Benvenuto all’Eggman Park, ${U.esc(App.playerName())}! 🎡 Sonic è qui all’ingresso: toccalo e parla con lui! 👆` };
    },
  });
})();
