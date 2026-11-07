'use strict';
/*
 * Mondo "Hello Kitty": avventura in 2 capitoli con Hello Kitty, Mimmy, My Melody, Keroppi, Pompompurin e Kuromi.
 *  1. La Festa a Sorpresa per Mimmy   2. La Stella dei Desideri
 */
(() => {
  const { exitSign, skyGrad, glow, label, star, heart, FONT } = Adventure.art;

  /* ---------------- personaggi ---------------- */
  const whiskers = '<path d="M-34 -70 L-48 -74 M-34 -64 L-48 -64 M-34 -58 L-48 -54 M34 -70 L48 -74 M34 -64 L48 -64 M34 -58 L48 -54" stroke="#333" stroke-width="2" stroke-linecap="round"/>';
  const bow = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M0 0 L-16 -10 Q-20 0 -16 10 Z M0 0 L16 -10 Q20 0 16 10 Z" fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/><circle r="5" fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/></g>`;
  const kitty = (x, y, s = 1, bowColor = '#e63946', bowSide = -1, dress = '#3a86ff') => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="24" ry="5" fill="rgba(0,0,0,.2)"/><ellipse cx="-9" cy="-4" rx="9" ry="6" fill="#fff" stroke="#333" stroke-width="1.5"/><ellipse cx="9" cy="-4" rx="9" ry="6" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <path d="M-16 -8 Q-18 -36 0 -38 Q18 -36 16 -8 Z" fill="${dress}" stroke="#333" stroke-width="1.5"/><path d="M-12 -34 L12 -34 L10 -44 L-10 -44 Z" fill="#e63946"/>
    <ellipse cx="-20" cy="-30" rx="6" ry="10" fill="#fff" stroke="#333" stroke-width="1.5"/><ellipse cx="20" cy="-30" rx="6" ry="10" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <path d="M-30 -80 L-26 -102 L-12 -88 Z M30 -80 L26 -102 L12 -88 Z" fill="#fff" stroke="#333" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-66" rx="34" ry="26" fill="#fff" stroke="#333" stroke-width="2"/>
    <ellipse cx="-12" cy="-66" rx="3.5" ry="4.5" fill="#111"/><ellipse cx="12" cy="-66" rx="3.5" ry="4.5" fill="#111"/><ellipse cx="0" cy="-58" rx="4.5" ry="3" fill="#ffd23f" stroke="#333" stroke-width="1"/>
    ${whiskers}${bow(bowSide * 20, -90, bowColor)}</g>`;
  const mimmy = (x, y, s = 1) => kitty(x, y, s, '#ffd23f', 1, '#ff8fab');
  const melody = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="22" ry="5" fill="rgba(0,0,0,.2)"/><ellipse cx="-8" cy="-4" rx="8" ry="5" fill="#fff" stroke="#333" stroke-width="1.5"/><ellipse cx="8" cy="-4" rx="8" ry="5" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <path d="M-16 -8 Q-18 -38 0 -40 Q18 -38 16 -8 Z" fill="#ffc2d1" stroke="#333" stroke-width="1.5"/>
    <path d="M-22 -96 Q-34 -150 -12 -120 Z M22 -96 Q34 -150 12 -120 Z" fill="#ff8fab" stroke="#333" stroke-width="2"/>
    <ellipse cx="0" cy="-70" rx="32" ry="30" fill="#ff8fab" stroke="#333" stroke-width="2"/><ellipse cx="0" cy="-64" rx="24" ry="20" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="-9" cy="-66" rx="3" ry="4" fill="#111"/><ellipse cx="9" cy="-66" rx="3" ry="4" fill="#111"/><ellipse cx="0" cy="-58" rx="3" ry="2" fill="#ffd23f"/>
    <g transform="translate(24 -96)"><circle cx="-5" cy="0" r="5" fill="#fff"/><circle cx="5" cy="0" r="5" fill="#fff"/><circle cx="0" cy="-5" r="5" fill="#fff"/><circle cx="0" cy="5" r="5" fill="#fff"/><circle r="3" fill="#ffd23f"/></g></g>`;
  const keroppi = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="24" ry="5" fill="rgba(0,0,0,.2)"/><ellipse cx="-10" cy="-4" rx="10" ry="5" fill="#2ec27e" stroke="#333" stroke-width="1.5"/><ellipse cx="10" cy="-4" rx="10" ry="5" fill="#2ec27e" stroke="#333" stroke-width="1.5"/>
    <path d="M-18 -8 Q-20 -36 0 -38 Q20 -36 18 -8 Z" fill="#ffd23f" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="0" cy="-60" rx="34" ry="24" fill="#2ec27e" stroke="#333" stroke-width="2"/>
    <circle cx="-14" cy="-84" r="13" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="14" cy="-84" r="13" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="-12" cy="-84" r="5" fill="#111"/><circle cx="12" cy="-84" r="5" fill="#111"/>
    <path d="M-16 -56 Q0 -42 16 -56" stroke="#c1121f" stroke-width="3" fill="#ff8fab"/><circle cx="-24" cy="-58" r="5" fill="#ff8fab" opacity=".7"/><circle cx="24" cy="-58" r="5" fill="#ff8fab" opacity=".7"/></g>`;
  const purin = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="26" ry="5" fill="rgba(0,0,0,.2)"/><ellipse cx="-10" cy="-4" rx="10" ry="6" fill="#ffd166" stroke="#333" stroke-width="1.5"/><ellipse cx="10" cy="-4" rx="10" ry="6" fill="#ffd166" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="0" cy="-26" rx="22" ry="20" fill="#ffd166" stroke="#333" stroke-width="1.5"/>
    <path d="M-30 -74 Q-46 -50 -30 -40 Q-24 -60 -24 -70 Z M30 -74 Q46 -50 30 -40 Q24 -60 24 -70 Z" fill="#a0522d" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="0" cy="-64" rx="30" ry="26" fill="#ffd166" stroke="#333" stroke-width="2"/>
    <ellipse cx="0" cy="-92" rx="20" ry="8" fill="#6b3e1f"/><path d="M0 -100 L0 -106" stroke="#6b3e1f" stroke-width="3"/>
    <ellipse cx="-10" cy="-64" rx="3" ry="4" fill="#111"/><ellipse cx="10" cy="-64" rx="3" ry="4" fill="#111"/><ellipse cx="0" cy="-56" rx="4" ry="3" fill="#6b3e1f"/></g>`;
  const kuromi = (x, y, s = 1, happy = false) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse rx="22" ry="5" fill="rgba(0,0,0,.2)"/><path d="M14 -16 Q40 -10 34 -34 L30 -26 L24 -32 Z" fill="#222"/>
    <ellipse cx="-8" cy="-4" rx="8" ry="5" fill="#fff" stroke="#333" stroke-width="1.5"/><ellipse cx="8" cy="-4" rx="8" ry="5" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <path d="M-16 -8 Q-18 -38 0 -40 Q18 -38 16 -8 Z" fill="#7b2cbf" stroke="#333" stroke-width="1.5"/>
    <path d="M-30 -80 Q-46 -120 -16 -96 Z M30 -80 Q46 -120 16 -96 Z" fill="#222" stroke="#111" stroke-width="2"/><circle cx="-40" cy="-114" r="5" fill="#ff8fab"/><circle cx="40" cy="-114" r="5" fill="#ff8fab"/>
    <ellipse cx="0" cy="-70" rx="32" ry="30" fill="#222" stroke="#111" stroke-width="2"/><ellipse cx="0" cy="-62" rx="24" ry="19" fill="#fff" stroke="#333" stroke-width="1.5"/>
    <circle cx="0" cy="-90" r="7" fill="#ff8fab"/><circle cx="-2.5" cy="-91" r="1.5" fill="#222"/><circle cx="2.5" cy="-91" r="1.5" fill="#222"/>
    <ellipse cx="-9" cy="-64" rx="3" ry="4" fill="#111"/><ellipse cx="9" cy="-64" rx="3" ry="4" fill="#111"/>
    ${happy ? '<path d="M-6 -54 Q0 -48 6 -54" stroke="#c2185b" stroke-width="2" fill="none"/><circle cx="-16" cy="-56" r="4" fill="#ff8fab" opacity=".7"/><circle cx="16" cy="-56" r="4" fill="#ff8fab" opacity=".7"/>' : '<path d="M-6 -52 Q0 -56 6 -52" stroke="#333" stroke-width="2" fill="none"/>'}</g>`;
  const baku = (x, y, moved) => `<g transform="translate(${x} ${y})">
    <ellipse rx="40" ry="6" fill="rgba(0,0,0,.2)"/><ellipse cx="0" cy="-34" rx="40" ry="32" fill="#9d4edd" stroke="#5a189a" stroke-width="2"/>
    <path d="M30 -44 Q56 -40 52 -20" stroke="#9d4edd" stroke-width="12" fill="none" stroke-linecap="round"/>
    ${moved ? '<path d="M8 -48 Q14 -44 20 -48" stroke="#111" stroke-width="2" fill="none"/><path d="M8 -30 Q14 -24 20 -30" stroke="#c2185b" stroke-width="2" fill="none"/>' : '<path d="M8 -48 L20 -48" stroke="#111" stroke-width="2"/><text x="-18" y="-72" font-size="14" fill="#fff" ' + FONT + '>z z</text>'}
    <ellipse cx="-14" cy="-6" rx="10" ry="6" fill="#7b2cbf"/><ellipse cx="14" cy="-6" rx="10" ry="6" fill="#7b2cbf"/>${star(-10, -40, 6, '#ffd23f')}</g>`;
  const house = (x, y, wall, roof) => `<path d="M${x - 8} ${y} L${x + 60} ${y - 50} L${x + 128} ${y} Z" fill="${roof}"/><rect x="${x}" y="${y}" width="120" height="90" fill="${wall}"/><rect x="${x + 44}" y="${y + 36}" width="32" height="54" rx="14" fill="#fff" stroke="#e63946" stroke-width="3"/>`;

  const KITTY = { name: 'Hello Kitty', icon: '🎀' };
  const MIMMY = { name: 'Mimmy', icon: '💛' };
  const MELODY = { name: 'My Melody', icon: '🐰' };
  const KERO = { name: 'Keroppi', icon: '🐸' };
  const PURIN = { name: 'Pompompurin', icon: '🍮' };
  const KUROMI = { name: 'Kuromi', icon: '💀' };
  const BAKU = { name: 'Baku', icon: '💜' };

  Adventure.world({
    id: 'kitty',
    title: 'Hello Kitty e i suoi amici',
    icon: '🎀',
    art: '🎀🐰🐸',
    desc: 'Aiuta Hello Kitty e i suoi amici My Melody, Keroppi e Pompompurin... e scopri cosa combina la birichina Kuromi!',
  });

  /* ======================= CAPITOLO 1 ======================= */
  Adventure.chapter('kitty', {
    id: 'kitty1',
    title: 'La Festa a Sorpresa per Mimmy',
    icon: '🎂',
    save: 'cg_adv_kitty1',
    start: 'casa',
    done: f => f.s_festa,
    items: {
      cestino: { icon: '🧺', name: 'Cestino', look: 'Un cestino di vimini con un fiocco rosso.' },
      caramella: { icon: '🍬', name: 'Caramella', look: 'Una caramella alla fragola incartata in carta lucida.' },
      nastro: { icon: '🩹', name: 'Nastro adesivo', look: 'Un rotolo di nastro adesivo: aggiusta quasi tutto!' },
      fragole: { icon: '🍓', name: 'Cestino di fragole', look: 'Un cestino pieno di fragole rosse e dolcissime.' },
      torta: { icon: '🎂', name: 'Torta di fragole', look: 'Una torta alla panna con le fragole e una candelina!' },
      gomitolo: { icon: '🧶', name: 'Gomitolo', look: 'Un gomitolo di lana rosa morbidissimo.' },
      sciarpa: { icon: '🧣', name: 'Sciarpa regalo', look: 'Una sciarpa rosa fatta a maglia da My Melody, incartata come regalo.' },
      palloncini: { icon: '🎈', name: 'Palloncini', look: 'Un mazzo di palloncini colorati!' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, go, render } = A;
      const delivered = () => ['torta', 'sciarpa', 'palloncini'].filter(k => A.f['d_' + k]).length;

      const scenes = {
        casa: {
          name: '🏠 La Casa di Kitty',
          draw: () => '<rect width="400" height="250" fill="#ffe5ec"/>' + Array.from({ length: 10 }, (_, i) => `<circle cx="${20 + i * 40}" cy="${30 + (i % 2) * 40}" r="6" fill="#ffc2d1"/>`).join('') + '<rect y="190" width="400" height="60" fill="#e9c69a"/>' +
            '<rect x="250" y="40" width="110" height="80" rx="6" fill="#bde0fe" stroke="#fff" stroke-width="6"/><path d="M305 40 L305 120 M250 80 L360 80" stroke="#fff" stroke-width="4"/>' +
            '<ellipse cx="300" cy="186" rx="70" ry="12" fill="#c47a2c"/><rect x="292" y="186" width="16" height="30" fill="#a0522d"/>' +
            (A.f.d_torta ? '<g transform="translate(276 176)"><rect x="-20" y="-24" width="40" height="24" fill="#fff" stroke="#ffc2d1"/><circle cx="-10" cy="-26" r="4" fill="#e63946"/><circle cx="8" cy="-26" r="4" fill="#e63946"/><rect x="-2" y="-38" width="4" height="12" fill="#4dd0ff"/></g>' : '') +
            (A.f.d_sciarpa ? '<rect x="312" y="160" width="28" height="22" fill="#ff8fab"/><rect x="324" y="160" width="4" height="22" fill="#fff"/>' : '') +
            (A.f.d_palloncini ? [[250, 70, '#e63946'], [272, 56, '#ffd23f'], [350, 66, '#4dd0ff'], [370, 52, '#2ec27e']].map(([x, yy, c]) => `<ellipse cx="${x}" cy="${yy}" rx="11" ry="14" fill="${c}"/><path d="M${x} ${yy + 14} Q${x + 4} ${yy + 40} ${x} ${yy + 70}" stroke="#555" fill="none"/>`).join('') : '') +
            '<rect x="20" y="120" width="70" height="70" fill="#ffc2d1" stroke="#ff8fab" stroke-width="3"/><path d="M20 152 L90 152" stroke="#ff8fab" stroke-width="3"/><circle cx="55" cy="138" r="3" fill="#fff"/><circle cx="55" cy="170" r="3" fill="#fff"/>' +
            '<rect x="30" y="96" width="30" height="24" rx="6" fill="rgba(255,255,255,.6)" stroke="#ccc"/>' + (A.f.s_caramella ? '' : '<circle cx="40" cy="110" r="5" fill="#e63946"/><circle cx="50" cy="112" r="5" fill="#ffd23f"/>') +
            (A.f.s_cestino ? '' : '<path d="M108 178 Q124 150 140 178 Z" fill="none" stroke="#a0522d" stroke-width="3"/><path d="M104 178 L144 178 L138 196 L110 196 Z" fill="#c47a2c"/>') +
            kitty(196, 232) + exitSign(304, 222, 'Giardino ➡'),
          spots: () => [
            { id: 'kitty', name: '🎀 Hello Kitty', x: 156, y: 130, w: 80, h: 104, talk: talkKitty, look: 'Hello Kitty! Oggi è emozionatissima: è il compleanno della sua gemella Mimmy!', use: { torta: () => deliver('torta'), sciarpa: () => deliver('sciarpa'), palloncini: () => deliver('palloncini') } },
            { id: 'tavolo', name: '🍽️ Tavolo della festa', x: 228, y: 150, w: 140, h: 66, look: `Il tavolo per la festa. Ci sono ${delivered()} cose su 3.`, use: { torta: () => deliver('torta'), sciarpa: () => deliver('sciarpa'), palloncini: () => deliver('palloncini') } },
            ...(A.f.s_caramella ? [] : [{ id: 'barattolo', name: '🍬 Barattolo delle caramelle', x: 26, y: 92, w: 40, h: 32, look: 'Un barattolo pieno di caramelle alla fragola.', take: () => { give('caramella'); step('caramella', 20); say(KITTY, 'Prendi pure una caramella! Ma non mangiarla subito... magari serve a qualcuno! 🍬'); render(); } }]),
            { id: 'cassetto', name: '🗄️ Cassettiera', x: 18, y: 124, w: 76, h: 68, look: A.f.s_nastro ? 'I cassetti di Kitty, pieni di matite colorate.' : 'Una cassettiera rosa. Nel cassetto di sopra c’è un rotolo di nastro adesivo!', take: () => { if (A.f.s_nastro) return say(null, 'Nei cassetti ci sono solo matite e adesivi a forma di fiocco.'); give('nastro'); step('nastro', 20); say(null, 'Hai preso il nastro adesivo! 🩹'); } },
            ...(A.f.s_cestino ? [] : [{ id: 'cestino', name: '🧺 Cestino', x: 100, y: 148, w: 48, h: 52, look: 'Un cestino di vimini con il manico.', take: () => { give('cestino'); step('cestino', 20); say(null, 'Hai preso il cestino! 🧺'); render(); } }]),
            { id: 'exit', name: 'Verso il giardino', x: 300, y: 212, w: 100, h: 38, go: 'giardino' },
          ],
        },
        giardino: {
          name: '🌷 Il Giardino',
          draw: () => skyGrad('#a2d2ff', '#e0f2fe') + '<rect y="150" width="400" height="100" fill="#80ed99"/>' +
            Array.from({ length: 12 }, (_, i) => `<rect x="${i * 34}" y="130" width="8" height="34" fill="#fff"/>`).join('') + '<rect y="138" width="400" height="6" fill="#fff"/>' +
            '<rect x="60" y="180" width="140" height="40" rx="8" fill="#6b4423"/>' + Array.from({ length: 7 }, (_, i) => `<ellipse cx="${74 + i * 20}" cy="186" rx="9" ry="6" fill="#2d6a4f"/>` + (A.f.s_fragole ? '' : `<path d="M${74 + i * 20} 192 q-5 8 0 12 q5 -4 0 -12 Z" fill="#e63946"/>`)).join('') +
            [[240, '#ff8fab'], [260, '#ffd23f'], [280, '#c084fc']].map(([x, c]) => `<path d="M${x} 210 L${x} 180" stroke="#2d6a4f" stroke-width="3"/><circle cx="${x}" cy="176" r="7" fill="${c}"/>`).join('') +
            label(300, 100, '⬆ LAGHETTO', '#fff', '#2d6a4f', 84) + exitSign(8, 222, '⬅ Casa') + exitSign(286, 222, 'Pasticceria ➡'),
          spots: () => [
            { id: 'fragole', name: '🍓 Fragole', x: 56, y: 172, w: 148, h: 52, look: A.f.s_fragole ? 'Le piantine di fragole, ora senza frutti.' : 'Tante fragole rosse e mature!', take: () => say(null, A.f.s_fragole ? 'Le hai già raccolte tutte!' : 'Sono tantissime! In mano ne tieni solo due... ci vorrebbe un cestino! 🧺'), use: { cestino: () => { if (A.f.s_fragole) return say(null, 'Le hai già raccolte!'); drop('cestino'); give('fragole'); step('fragole', 100); say(null, 'Riempi il cestino di fragole rosse e profumate! 🍓🧺'); render(); } } },
            { id: 'laghetto', name: '⬆ Sentiero del laghetto', x: 296, y: 90, w: 104, h: 40, go: 'laghetto', look: 'Un sentiero che porta al laghetto di Keroppi.' },
            { id: 'fiori', name: '🌷 Fiori', x: 226, y: 166, w: 70, h: 46, look: 'Fiori di tutti i colori. Che profumo!' },
            { id: 'exitL', name: 'Verso casa', x: 0, y: 212, w: 92, h: 38, go: 'casa' },
            { id: 'exitR', name: 'Verso la pasticceria', x: 282, y: 212, w: 118, h: 38, go: 'pasticceria' },
          ],
        },
        pasticceria: {
          name: '🧁 La Pasticceria di Pompompurin',
          draw: () => '<rect width="400" height="250" fill="#fff1e6"/>' + Array.from({ length: 10 }, (_, i) => `<rect x="${i * 40}" y="0" width="20" height="250" fill="#ffe8d6"/>`).join('') + '<rect y="196" width="400" height="54" fill="#d4a373"/>' +
            '<rect x="20" y="60" width="120" height="80" fill="#adb5bd"/><rect x="34" y="74" width="92" height="52" rx="6" fill="#343a40"/><circle cx="80" cy="100" r="10" fill="#ff7b00" opacity=".6"/>' +
            '<rect x="200" y="140" width="190" height="60" fill="#fff" stroke="#ffc2d1" stroke-width="4"/>' + [[230, '#ff8fab'], [280, '#ffd23f'], [330, '#c47a2c'], [370, '#e63946']].map(([x, c]) => `<path d="M${x - 12} 140 L${x + 12} 140 L${x + 8} 124 L${x - 8} 124 Z" fill="#fff3e0"/><circle cx="${x}" cy="120" r="9" fill="${c}"/>`).join('') +
            purin(150, 236) + label(220, 30, 'PASTICCERIA PURIN', '#6b3e1f', '#ffd166', 140) + exitSign(8, 222, '⬅ Giardino') + exitSign(316, 222, 'Bosco ➡'),
          spots: () => [
            { id: 'purin', name: '🍮 Pompompurin', x: 114, y: 130, w: 72, h: 108, talk: () => (A.f.s_torta ? say(PURIN, 'La torta ti è piaciuta? Ho messo tantissima panna! 🍮') : say(PURIN, 'Ciao! Una torta per il compleanno di Mimmy? Che bello! Faccio la mia famosa torta alle fragole... ma ho finito le fragole! 🍓 Me ne porti un cestino?')), look: 'Pompompurin, il cagnolino goloso con il basco marrone. Sa di budino!', use: { fragole: () => { drop('fragole'); give('torta'); step('torta', 100); dialog([[PURIN, 'Che belle fragole! Ora sbatto la panna, inforno e... ecco qua! 🎂'], [PURIN, 'Una torta alle fragole con la candelina! Portala a Kitty! 🍓']]); } } },
            { id: 'vetrina', name: '🧁 Vetrina dei dolci', x: 196, y: 108, w: 196, h: 92, look: 'Cupcake, budini e biscotti... che fame!', take: () => say(PURIN, 'Ehi, quelli sono per i clienti! 😄') },
            { id: 'forno', name: '🔥 Forno', x: 18, y: 58, w: 124, h: 84, look: 'Un forno caldo caldo. Dentro cuoce qualcosa di buonissimo.' },
            { id: 'exitL', name: 'Verso il giardino', x: 0, y: 212, w: 108, h: 38, go: 'giardino' },
            { id: 'exitR', name: 'Verso il bosco', x: 300, y: 212, w: 100, h: 38, go: 'bosco' },
          ],
        },
        laghetto: {
          name: '🐸 Il Laghetto di Keroppi',
          draw: () => skyGrad('#bde0fe', '#e0f2fe') + '<rect y="120" width="400" height="130" fill="#80ed99"/><ellipse cx="250" cy="190" rx="150" ry="40" fill="#48cae4"/>' +
            [[200, 186], [280, 200], [320, 178]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="7" fill="#2d6a4f"/>`).join('') +
            '<rect x="30" y="80" width="110" height="110" fill="#2ec27e"/><path d="M24 80 L85 50 L146 80 Z" fill="#1a9c60"/>' + label(40, 96, 'PALLONCINI', '#fff', '#1a9c60', 90) +
            (A.f.s_palloncini ? '' : [[60, 70, '#e63946'], [84, 60, '#ffd23f'], [110, 68, '#4dd0ff']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="13" fill="${c}"/>`).join('')) +
            '<rect x="150" y="160" width="20" height="30" rx="4" fill="#4dd0ff"/><path d="M160 160 L160 140" stroke="#333" stroke-width="3"/><path d="M152 140 L168 140" stroke="#333" stroke-width="4"/>' + (A.f.s_palloncini ? '' : '<path d="M170 176 L184 172 L180 182 Z" fill="#fff"/><text x="186" y="170" font-size="10" fill="#c1121f" ' + FONT + '>fsss!</text>') +
            keroppi(110, 236) + exitSign(8, 222, '⬅ Giardino'),
          spots: () => [
            { id: 'kero', name: '🐸 Keroppi', x: 72, y: 150, w: 76, h: 88, talk: () => (A.f.s_palloncini ? say(KERO, 'Kero kero! I palloncini volano alti alti! 🎈') : say(KERO, 'Kero kero! Ciao! Vuoi i palloncini per la festa di Mimmy? Te li gonfio volentieri... ma la mia pompa si è bucata! Senti? Fsss! 😢')), look: 'Keroppi, la ranocchia allegra del laghetto. Vende palloncini!', use: { nastro: () => fixPump() } },
            { id: 'pompa', name: '🎈 Pompa dei palloncini', x: 144, y: 134, w: 56, h: 58, look: A.f.s_palloncini ? 'La pompa riparata col nastro adesivo.' : 'La pompa per gonfiare i palloncini. Ha un buchino da cui esce l’aria: fsss!', use: { nastro: () => fixPump() } },
            { id: 'stagno', name: '🌊 Laghetto', x: 200, y: 160, w: 200, h: 60, look: 'Un laghetto con le ninfee. Una rana ci farebbe un tuffo!' },
            { id: 'exit', name: 'Verso il giardino', x: 0, y: 212, w: 108, h: 38, go: 'giardino' },
          ],
        },
        bosco: {
          name: '🌳 Il Bosco',
          draw: () => skyGrad('#caffbf', '#e9f5db') + '<rect y="170" width="400" height="80" fill="#95d5b2"/>' +
            '<rect x="300" y="50" width="20" height="150" fill="#6b4423"/><circle cx="310" cy="50" r="56" fill="#2d6a4f"/><path d="M262 90 L360 80" stroke="#6b4423" stroke-width="8"/>' +
            (A.f.s_gomitolo ? '' : '<circle cx="342" cy="70" r="9" fill="#ff8fab"/><path d="M335 66 Q342 72 350 66" stroke="#fff" fill="none"/>') +
            kuromi(300, 92, 0.6, A.f.s_gomitolo) +
            house(30, 110, '#fff0f6', '#ff8fab').replace('stroke="#e63946"', 'stroke="#ff8fab"') +
            melody(196, 236) + exitSign(8, 222, '⬅ Pasticceria'),
          spots: () => [
            { id: 'melody', name: '🐰 My Melody', x: 162, y: 120, w: 70, h: 118, talk: () => (A.f.s_sciarpa ? say(MELODY, 'Spero che a Mimmy piaccia la sciarpa! L’ho fatta con tanto amore! 💗') : say(MELODY, 'Ciao! Che bello, una festa per Mimmy! Le farei una sciarpa a maglia come regalo... ma Kuromi mi ha preso il gomitolo di lana ed è scappata sull’albero! 😢')), look: 'My Melody, la coniglietta con il cappuccio rosa. È dolcissima!', use: { gomitolo: () => { drop('gomitolo'); give('sciarpa'); step('sciarpa', 100); dialog([[MELODY, 'Il mio gomitolo! Grazie! Ora sferruzzo... uno, due, uno, due... 🧶'], [MELODY, 'Ecco una sciarpa rosa per Mimmy! L’ho anche incartata con un fiocco. È il regalo perfetto! 🧣🎁']]); } } },
            { id: 'kuromi', name: '💀 Kuromi sull’albero', x: 270, y: 20, w: 92, h: 80, talk: () => (A.f.s_gomitolo ? say(KUROMI, 'Mmm, questa caramella è buonissima... ma non dirlo a nessuno che sono stata gentile! 😤💜') : say(KUROMI, 'Eh eh eh! Il gomitolo ce l’ho io e non lo ridò! 😈 ...A meno che... hai qualcosa di dolce? Io adoro le caramelle!')), look: 'Kuromi, la birichina con il cappuccio nero e il teschietto rosa. Ha in mano un gomitolo rosa!', use: { caramella: () => { drop('caramella'); give('gomitolo'); step('gomitolo', 100); dialog([[KUROMI, 'Una caramella alla fragola?! La mia preferita! Gnam! 🍬'], [KUROMI, 'Va bene, va bene, tieni il gomitolo. Tanto mi annoiavo! 😝']]); render(); } } },
            { id: 'casetta', name: '🏡 Casetta di My Melody', x: 22, y: 60, w: 130, h: 140, look: 'La casetta rosa di My Melody, con le tendine a fiori.' },
            { id: 'exit', name: 'Verso la pasticceria', x: 0, y: 212, w: 120, h: 38, go: 'pasticceria' },
          ],
        },
      };

      function fixPump() {
        if (A.f.s_palloncini) return say(KERO, 'La pompa funziona benissimo ora!');
        drop('nastro');
        give('palloncini');
        step('palloncini', 100);
        dialog([[null, 'Metti un pezzo di nastro adesivo sul buchino della pompa: niente più fsss! 🩹'], [KERO, 'Kero kero! Funziona! Pff pff pff... ecco un mazzo di palloncini colorati per la festa! 🎈🎈🎈']]);
        render();
      }

      function talkKitty() {
        if (!A.f.s_q) {
          return dialog([
            [KITTY, `Ciao ${App.playerName()}! Che bello che sei qui! 🎀`],
            [KITTY, 'Oggi è il compleanno di Mimmy, la mia sorellina gemella! Le preparo una FESTA A SORPRESA! 🎉'],
            [KITTY, 'Mi servono tre cose: una 🎂 torta, un 🎁 regalo e i 🎈 palloncini. Mi aiuti a trovarle prima che Mimmy torni a casa?'],
            [KITTY, 'Pompompurin fa torte buonissime, My Melody è bravissima a fare regali e Keroppi vende i palloncini al laghetto!'],
          ], () => step('q', 50));
        }
        const missing = [];
        if (!A.f.d_torta) missing.push('🎂 la torta');
        if (!A.f.d_sciarpa) missing.push('🎁 il regalo');
        if (!A.f.d_palloncini) missing.push('🎈 i palloncini');
        say(KITTY, missing.length ? `Per la festa mancano ancora: ${missing.join(', ')}. Quando li hai, dalli a me!` : 'È tutto pronto!');
      }

      function deliver(k) {
        drop(k);
        A.f['d_' + k] = true;
        step('d_' + k, 50);
        render();
        if (delivered() < 3) return say(KITTY, `Che bello! ${{ torta: 'La torta va sul tavolo! 🎂', sciarpa: 'Il regalo va accanto alla torta! 🎁', palloncini: 'I palloncini li appendiamo! 🎈' }[k]} Manca ancora qualcosa...`);
        step('festa', 300);
        A.finish({
          lines: [
            [KITTY, 'Torta, regalo, palloncini... è tutto pronto! Presto, nascondiamoci! Spegni la luce! 🤫'],
            [null, 'Click... la porta si apre piano piano. È Mimmy! 💛'],
            [null, '🎉 SORPRESAAAA! 🎉 Escono tutti: Kitty, My Melody, Keroppi, Pompompurin... e perfino Kuromi!'],
            [MIMMY, 'Una festa per me?! Che bello! È il compleanno più bello di sempre! 💛😍'],
            [KITTY, `Grazie ${App.playerName()}, senza di te non ce l’avremmo mai fatta! Prendi una fetta di torta! 🎂🎀`],
          ],
          title: 'Sorpresa! 🎉🎂',
          msg: 'Hai organizzato la festa di compleanno a sorpresa per Mimmy!',
        });
      }

      function hint() {
        const f = A.f;
        if (!f.s_q) return 'Parla con Hello Kitty in casa.';
        if (!f.d_torta) {
          if (has('torta')) return 'Dai la torta a Hello Kitty a casa.';
          if (has('fragole')) return 'Porta le fragole a Pompompurin nella pasticceria.';
          if (!f.s_cestino) return 'In casa c’è un cestino: prendilo.';
          return 'In giardino seleziona il cestino e tocca le fragole.';
        }
        if (!f.d_sciarpa) {
          if (has('sciarpa')) return 'Dai il regalo a Hello Kitty a casa.';
          if (has('gomitolo')) return 'Dai il gomitolo a My Melody nel bosco.';
          if (!f.s_caramella) return 'In casa c’è un barattolo di caramelle: prendine una.';
          return 'Nel bosco dai la caramella a Kuromi sull’albero.';
        }
        if (!f.d_palloncini) {
          if (has('palloncini')) return 'Dai i palloncini a Hello Kitty a casa.';
          if (!f.s_nastro) return 'In casa, nella cassettiera, c’è il nastro adesivo: prendilo.';
          return 'Al laghetto usa il nastro adesivo con la pompa bucata di Keroppi.';
        }
        return 'Dai tutto a Hello Kitty!';
      }

      const arrive = {
        casa: 'La casa di Hello Kitty: tutto è rosa e pieno di fiocchi!',
        giardino: 'Il giardino fiorito, con un orto pieno di fragole.',
        pasticceria: 'La pasticceria di Pompompurin: profumo di dolci ovunque!',
        laghetto: 'Il laghetto di Keroppi, con le ninfee e il chiosco dei palloncini.',
        bosco: 'Il bosco dove vive My Melody. Sull’albero c’è qualcuno di birichino...',
      };
      return { scenes, hint, arrive, welcome: `Sei a casa di Hello Kitty, ${U.esc(App.playerName())}! 🎀 Toccala e parla con lei: ha una missione per te! 👆` };
    },
  });

  /* ======================= CAPITOLO 2 ======================= */
  Adventure.chapter('kitty', {
    id: 'kitty2',
    title: 'La Stella dei Desideri',
    icon: '🌟',
    save: 'cg_adv_kitty2',
    start: 'piazza',
    done: f => f.s_stella,
    items: {
      lente: { icon: '🔍', name: 'Lente', look: 'Una lente di vetro rotonda, un po’ impolverata.' },
      penna: { icon: '🖊️', name: 'Penna con le stelline', look: 'Una penna che scrive con l’inchiostro glitterato.' },
      biscotti: { icon: '🍪', name: 'Biscotti', look: 'Biscotti al burro di Pompompurin. Profumano tantissimo!' },
      invito: { icon: '💌', name: 'Invito alla festa', look: '«Cara Kuromi, sei invitata alla Festa delle Stelle! Ti aspettiamo! Kitty e gli amici 💗»' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, go, render } = A;
      const night = (a = '#1d1e4f', b = '#5a4fcf') => skyGrad(a, b) + Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${(i * 29) % 110 + 6}" r="${1 + (i % 3) * 0.6}" fill="#fff"/>`).join('');

      const scenes = {
        piazza: {
          name: '🌟 La Festa delle Stelle',
          draw: () => night() + '<rect y="180" width="400" height="70" fill="#adb5bd"/>' +
            Array.from({ length: 9 }, (_, i) => `<path d="M${i * 50} 30 Q${i * 50 + 25} 50 ${i * 50 + 50} 30" stroke="#fff" stroke-width="1.5" fill="none"/><circle cx="${i * 50 + 25}" cy="46" r="5" fill="${['#ffd23f', '#ff8fab', '#4dd0ff'][i % 3]}"/>`).join('') +
            '<path d="M200 60 L200 120" stroke="#ced4da" stroke-width="4"/>' + (A.f.s_stella ? star(200, 50, 22, '#ffd23f') : '<circle cx="200" cy="50" r="22" fill="none" stroke="#adb5bd" stroke-width="2" stroke-dasharray="4 4"/><text x="200" y="56" font-size="18" text-anchor="middle" fill="#fff">?</text>') +
            '<ellipse cx="200" cy="200" rx="50" ry="12" fill="#4dd0ff" stroke="#ced4da" stroke-width="4"/><rect x="194" y="160" width="12" height="36" fill="#ced4da"/>' +
            '<rect x="290" y="120" width="100" height="70" fill="#fff"/>' + Array.from({ length: 5 }, (_, i) => `<path d="M${290 + i * 20} 110 L${310 + i * 20} 110 L${310 + i * 20} 126 Q${300 + i * 20} 132 ${290 + i * 20} 126 Z" fill="${i % 2 ? '#fff' : '#ffd166'}"/>`).join('') +
            purin(340, 240, 0.7) + kitty(70, 236, 0.85) + melody(140, 236, 0.85) + exitSign(268, 6, 'Osservatorio ⬆') + exitSign(316, 222, 'Bosco ➡'),
          spots: () => [
            { id: 'melody', name: '🐰 My Melody', x: 112, y: 116, w: 58, h: 122, talk: talkMelody, look: 'My Melody guarda in alto, preoccupata: la Stella dei Desideri non c’è più!' },
            { id: 'kitty', name: '🎀 Hello Kitty', x: 36, y: 152, w: 70, h: 86, talk: talkKitty2, look: 'Hello Kitty ha preparato tantissimi inviti per la festa... Li ha dati a tutti?', use: { penna: () => { if (A.f.s_invito) return say(KITTY, 'Abbiamo già scritto l’invito!'); if (!A.f.s_kuromiTriste) return say(KITTY, 'Una penna glitterata! Ma per scrivere cosa? 🤔'); drop('penna'); give('invito'); step('invito', 100); dialog([[KITTY, 'Hai ragione, scriviamo subito un invito per Kuromi! «Cara Kuromi, sei invitata alla Festa delle Stelle!» 💌'], [KITTY, 'Ecco qua, con tanti cuoricini! Portaglielo tu! 💗']]); } } },
            { id: 'purin', name: '🍮 Pompompurin', x: 308, y: 150, w: 64, h: 58, talk: () => { if (A.f.s_biscotti) return say(PURIN, 'Ti sono piaciuti i biscotti? Ne ho fatti mille! 🍪'); give('biscotti'); step('biscotti', 50); say(PURIN, 'Ciao! Vuoi assaggiare i miei biscotti al burro? Prendine un sacchetto, ne ho fatti mille! 🍪'); }, look: 'Pompompurin vende biscotti al chiosco della festa.' },
            { id: 'pennone', name: '🌟 Pennone della stella', x: 170, y: 20, w: 60, h: 100, look: A.f.s_stella ? 'La Stella dei Desideri brilla di nuovo in cima al pennone!' : 'In cima al pennone doveva brillare la Stella dei Desideri... ma è sparita!' },
            { id: 'fontana', name: '⛲ Fontana', x: 146, y: 156, w: 108, h: 58, look: 'Una fontana che fa zampilli argentati sotto la luna.' },
            { id: 'exitU', name: 'Verso l’osservatorio', x: 262, y: 0, w: 138, h: 32, go: 'osservatorio' },
            { id: 'exitR', name: 'Verso il bosco', x: 300, y: 212, w: 100, h: 38, go: 'bosco' },
          ],
        },
        osservatorio: {
          name: '🔭 L’Osservatorio',
          draw: () => '<rect width="400" height="250" fill="#2b2d42"/>' + '<path d="M60 0 L340 0 L300 110 L100 110 Z" fill="#14213d"/>' + Array.from({ length: 10 }, (_, i) => `<circle cx="${110 + (i * 37) % 190}" cy="${10 + (i * 23) % 90}" r="1.6" fill="#fff"/>`).join('') + '<rect y="200" width="400" height="50" fill="#5c677d"/>' +
            '<g transform="translate(250 150) rotate(-30)"><rect x="-10" y="-14" width="110" height="28" rx="8" fill="#ced4da" stroke="#6c757d" stroke-width="2"/><circle cx="100" cy="0" r="16" fill="' + (A.f.s_lente ? '#4dd0ff' : '#212529') + '" stroke="#6c757d" stroke-width="2"/></g><path d="M250 150 L230 200 M250 150 L270 200" stroke="#6c757d" stroke-width="5"/>' +
            '<rect x="40" y="150" width="110" height="50" fill="#8d5a32"/>' + (A.f.s_penna ? '' : '<path d="M70 146 L100 136" stroke="#c084fc" stroke-width="4" stroke-linecap="round"/>' + star(104, 134, 5, '#ffd23f')) + '<rect x="110" y="136" width="30" height="14" fill="#fff"/>' +
            keroppi(190, 236, 0.85) + exitSign(8, 222, '⬇ Piazza'),
          spots: () => [
            { id: 'kero', name: '🐸 Keroppi', x: 158, y: 140, w: 66, h: 98, talk: () => say(KERO, A.f.s_lente ? 'Kero kero! Guarda nel telescopio: si vede il castello di Kuromi! 🔭' : 'Kero kero! Volevo guardare dove è finita la stella con il mio telescopio... ma ho perso la lente nel bosco! Senza lente non si vede niente! 😢'), look: 'Keroppi stasera fa l’astronomo, con un cappellino a stelline.', use: { lente: () => fixScope() } },
            { id: 'telescopio', name: '🔭 Telescopio', x: 226, y: 90, w: 120, h: 112, look: A.f.s_lente ? 'Guardi nel telescopio... In lontananza vedi il castello di Kuromi! Sulla torre sventolano tre bandiere: la prima ha una 🌙 LUNA, la seconda una ⭐ STELLA, la terza una 🌙 LUNA.' : 'Un grande telescopio, ma manca la lente!', use: { lente: () => fixScope() } },
            ...(A.f.s_penna ? [] : [{ id: 'penna', name: '🖊️ Penna sulla scrivania', x: 60, y: 124, w: 56, h: 30, look: 'Sulla scrivania c’è una penna con le stelline.', take: () => { give('penna'); step('penna', 20); say(KERO, 'Prendi pure la mia penna glitterata! Scrive benissimo! ✨'); render(); } }]),
            { id: 'exit', name: 'Verso la piazza', x: 0, y: 212, w: 92, h: 38, go: 'piazza' },
          ],
        },
        bosco: {
          name: '🌙 Il Bosco di Notte',
          draw: () => night('#0b132b', '#1c2541') + '<rect y="170" width="400" height="80" fill="#1b4332"/>' +
            [[40, 70], [120, 50], [360, 60]].map(([x, h]) => `<rect x="${x}" y="${120 - h}" width="14" height="${h + 80}" fill="#3e2a1a"/><circle cx="${x + 7}" cy="${120 - h}" r="30" fill="#2d6a4f"/>`).join('') +
            '<g transform="translate(200 210) scale(1.4)"><rect x="-8" y="-30" width="16" height="30" rx="5" fill="#fff3e0"/><path d="M-30 -28 Q0 -64 30 -28 Z" fill="#ff8fab"/><circle cx="-12" cy="-38" r="4" fill="#fff"/><circle cx="6" cy="-46" r="5" fill="#fff"/></g>' +
            (A.f.s_lenteP ? '' : '<circle cx="200" cy="140" r="9" fill="#bde0fe" stroke="#adb5bd" stroke-width="3"/><path d="M196 136 L200 140" stroke="#fff" stroke-width="2"/>') +
            '<path d="M280 250 Q320 180 400 170" stroke="#c8a165" stroke-width="20" fill="none"/>' + exitSign(8, 222, '⬅ Piazza') + exitSign(300, 140, 'Castello ➡'),
          spots: () => [
            ...(A.f.s_lenteP ? [] : [{ id: 'lente', name: '🔍 Qualcosa che luccica', x: 182, y: 124, w: 36, h: 34, look: 'Sopra il fungo rosa luccica una lente di vetro!', take: () => { give('lente'); step('lenteP', 20); say(null, 'Hai trovato una lente! 🔍 Sarà quella del telescopio di Keroppi?'); render(); } }]),
            { id: 'fungo', name: '🍄 Fungo rosa', x: 150, y: 150, w: 100, h: 66, look: 'Un fungo rosa grande come un ombrellone.' },
            { id: 'exitL', name: 'Verso la piazza', x: 0, y: 212, w: 92, h: 38, go: 'piazza' },
            { id: 'exitR', name: 'Verso il castello', x: 296, y: 130, w: 104, h: 40, go: 'cancello' },
          ],
        },
        cancello: {
          name: '🏰 Il Cancello del Castello',
          draw: () => night('#240046', '#5a189a') + '<rect y="190" width="400" height="60" fill="#3c096c"/>' +
            '<rect x="60" y="40" width="280" height="150" fill="#240046"/>' + [60, 120, 180, 240, 300].map(x => `<rect x="${x}" y="28" width="30" height="16" fill="#240046"/>`).join('') +
            '<path d="M160 190 L160 110 Q200 80 240 110 L240 190 Z" fill="#10002b"/>' + Array.from({ length: 5 }, (_, i) => `<path d="M${166 + i * 17} 104 L${166 + i * 17} 190" stroke="#c084fc" stroke-width="3"/>`).join('') +
            '<circle cx="200" cy="70" r="16" fill="#ff8fab"/><circle cx="194" cy="68" r="3" fill="#240046"/><circle cx="206" cy="68" r="3" fill="#240046"/>' +
            baku(A.f.s_baku ? 320 : 200, 236, A.f.s_baku) + exitSign(8, 222, '⬅ Bosco'),
          spots: () => [
            { id: 'baku', name: '💜 Baku', x: A.f.s_baku ? 270 : 150, y: 160, w: 110, h: 80, talk: () => say(BAKU, A.f.s_baku ? 'Gnam gnam... che buoni i biscotti... passa pure! 💜' : 'Zzz... mmm... Sono Baku, il guardiano del castello di Kuromi... Non ti faccio passare... zzz... e poi ho tanta fame... 😴'), look: 'Baku, l’amico di Kuromi: un tapiro viola tondo tondo che dorme davanti al cancello.', use: { biscotti: () => { if (A.f.s_baku) return say(BAKU, 'Gnam! Ne ho già mangiati tanti!'); drop('biscotti'); step('baku', 100); dialog([[BAKU, '*sniff sniff* Biscotti al burro?! 😍 Gnam gnam gnam!'], [BAKU, 'Va bene, ti lascio passare... ma non dire a Kuromi che mi sono fatto corrompere dai biscotti! 💜']]); render(); } } },
            { id: 'cancelloC', name: A.f.s_baku ? '🏰 Cancello' : '🏰 Cancello (bloccato)', x: 156, y: 80, w: 88, h: 110, look: 'Il cancello del castello di Kuromi, con un teschietto rosa in cima.', go: () => (A.f.s_baku ? go('sala') : say(BAKU, 'Zzz... di qui non si passa... zzz... 😴')) },
            { id: 'exit', name: 'Verso il bosco', x: 0, y: 212, w: 92, h: 38, go: 'bosco' },
          ],
        },
        sala: {
          name: '💜 Il Castello di Kuromi',
          draw: () => '<rect width="400" height="250" fill="#3c096c"/>' + glow('advkuromi', '#ff8fab', 0.5, 0.4) + '<rect y="200" width="400" height="50" fill="#240046"/>' +
            Array.from({ length: 6 }, (_, i) => `<circle cx="${30 + i * 68}" cy="40" r="8" fill="#ff8fab"/><circle cx="${27 + i * 68}" cy="38" r="1.5" fill="#240046"/><circle cx="${33 + i * 68}" cy="38" r="1.5" fill="#240046"/>`).join('') +
            (A.f.s_portaK ? '<path d="M150 200 L150 100 Q200 60 250 100 L250 200 Z" fill="#10002b"/><path d="M158 200 L158 106 Q200 72 242 106 L242 200 Z" fill="#ffd23f" opacity=".25"/>'
              : '<path d="M150 200 L150 100 Q200 60 250 100 L250 200 Z" fill="#7b2cbf" stroke="#c084fc" stroke-width="4"/>' + [172, 200, 228].map(x => `<rect x="${x - 10}" y="130" width="20" height="20" rx="4" fill="#e0aaff" stroke="#5a189a"/>`).join('')) +
            exitSign(8, 222, '⬅ Cancello') + (A.f.s_portaK ? exitSign(160, 172, 'Entra ➡') : ''),
          spots: () => [
            { id: 'porta', name: A.f.s_portaK ? '🚪 Porta aperta' : '🚪 Porta di Kuromi', x: 146, y: 70, w: 108, h: 132, look: A.f.s_portaK ? 'La porta è aperta: dall’altra parte brilla una luce dorata!' : 'Una porta viola con 3 riquadri girevoli: luna, stella, sole, cuore... Serve la combinazione giusta!', go: A.f.s_portaK ? 'stanza' : null, take: A.f.s_portaK ? null : () => A.lock({
              title: '💜 Porta di Kuromi', text: 'Gira i 3 riquadri e scegli i simboli nell’ordine giusto:', symbols: ['💖', '🌙', '⭐', '☀️'], code: ['🌙', '⭐', '🌙'],
              ok: () => { step('portaK', 150); render(); say(null, 'CLIC CLIC CLIC! La porta viola si apre! Dentro brilla una luce dorata... ✨', [{ label: '➡ Entra', fn: () => go('stanza') }]); },
              fail: '🔊 «Eh eh eh! Sbagliato!» ride una vocina. Forse le bandiere sulla torre del castello sono un indizio...', leave: 'La porta resta chiusa.',
            }) },
            { id: 'exit', name: 'Verso il cancello', x: 0, y: 212, w: 104, h: 38, go: 'cancello' },
          ],
        },
        stanza: {
          name: '⭐ La Stanza della Stella',
          draw: () => '<rect width="400" height="250" fill="#5a189a"/>' + glow('advstar', '#ffd23f', 0.62, 0.4) + '<rect y="200" width="400" height="50" fill="#3c096c"/>' +
            '<rect x="40" y="60" width="90" height="70" rx="8" fill="#e0aaff"/>' + heart(85, 92, 1.4, '#ff8fab') +
            (A.f.s_stella ? '' : star(260, 90, 30, '#ffd23f') + '<circle cx="260" cy="90" r="40" fill="#ffd23f" opacity=".2"/>') +
            kuromi(190, 236, 1, A.f.s_stella) + exitSign(8, 222, '⬅ Sala'),
          spots: () => [
            { id: 'kuromi', name: '💀 Kuromi', x: 150, y: 110, w: 80, h: 128, talk: talkKuromi, look: 'Kuromi abbraccia la Stella dei Desideri. Ha gli occhi un po’ tristi...', use: { invito: () => { drop('invito'); step('stella', 300); render(); finale(); } } },
            { id: 'stella', name: '⭐ Stella dei Desideri', x: 224, y: 54, w: 72, h: 72, look: 'La Stella dei Desideri! Brilla così forte che illumina tutta la stanza.', take: () => say(KUROMI, 'GIÙ LE MANI! La stella è mia! 😤') },
            { id: 'exit', name: 'Verso la sala', x: 0, y: 212, w: 92, h: 38, go: 'sala' },
          ],
        },
      };

      function fixScope() {
        if (A.f.s_lente) return say(KERO, 'Il telescopio funziona già!');
        drop('lente');
        step('lente', 100);
        render();
        dialog([[KERO, 'La mia lente! Kero kero! La rimetto al suo posto... 🔍'], [KERO, 'Funziona! Guarda anche tu nel telescopio: tocca il telescopio e scegli “Guarda”! 🔭']]);
      }

      function talkMelody() {
        if (!A.f.s_q) {
          return dialog([
            [MELODY, `${App.playerName()}! Meno male che sei qui! 🐰`],
            [MELODY, 'Stasera c’è la Festa delle Stelle, ma la Stella dei Desideri è sparita dal pennone! 🌟'],
            [MELODY, 'Ho visto un’ombra con le orecchie a punta scappare verso il castello oltre il bosco... Forse Keroppi, con il suo telescopio, può vedere dov’è andata!'],
          ], () => step('q', 50));
        }
        say(MELODY, A.f.s_stella ? 'La stella è tornata! Grazie! 💗' : 'Speriamo di ritrovare la stella... Senza di lei niente desideri! 😢');
      }

      function talkKitty2() {
        if (A.f.s_kuromiTriste && !A.f.s_invito) return say(KITTY, 'Kuromi è triste perché nessuno la invita? Oh no! Scriviamole subito un invito! Mi serve una penna... 🖊️');
        say(KITTY, 'Ho dato gli inviti per la festa a tutti i miei amici! A tutti... credo. 🎀');
      }

      function talkKuromi() {
        if (A.f.s_stella) return say(KUROMI, 'Ok, ok, sono contenta. Ma non dirlo a nessuno! 💜');
        A.f.s_kuromiTriste = true;
        A.save();
        dialog([
          [KUROMI, 'Ehi! Chi ti ha fatto entrare?! La Stella dei Desideri è MIA! 😤'],
          [A.ME(), 'Ma Kuromi, perché l’hai presa?'],
          [KUROMI, 'Perché... perché tutti vanno alla Festa delle Stelle, ma a me nessuno mi invita mai! 😢 Così almeno il desiderio lo esprimo io!'],
          [null, 'Kuromi si gira dall’altra parte e tira su col naso. Forse non è cattiva... è solo triste. Chissà chi potrebbe scriverle un invito...'],
        ]);
      }

      function finale() {
        A.finish({
          lines: [
            [null, 'Dai a Kuromi l’invito con i cuoricini. 💌'],
            [KUROMI, '«Cara Kuromi, sei invitata alla Festa delle Stelle»... per me?! Davvero?! 😳💜'],
            [KUROMI, 'Va bene... allora vi ridò la stella. Ma alla festa mi siedo in prima fila!'],
            [null, 'Tutti insieme riportate la Stella dei Desideri sul pennone: brilla più forte che mai! 🌟'],
            [KITTY, `Che bella festa! Esprimiamo un desiderio tutti insieme: che siamo sempre amici! Grazie ${App.playerName()}! 🎀✨`],
          ],
          title: 'La stella brilla di nuovo! 🌟',
          msg: 'Hai ritrovato la Stella dei Desideri e fatto diventare Kuromi un’amica!',
        });
      }

      function hint() {
        const f = A.f;
        if (!f.s_q) return 'Parla con My Melody nella piazza.';
        if (!f.s_lente) return has('lente') ? 'Porta la lente a Keroppi all’osservatorio.' : 'Nel bosco, sopra il fungo rosa, luccica una lente: prendila.';
        if (!f.s_portaK) {
          if (!f.s_baku) return has('biscotti') ? 'Al castello dai i biscotti a Baku.' : 'Nella piazza parla con Pompompurin: ti regalerà dei biscotti per Baku.';
          return 'Guarda nel telescopio dell’osservatorio: le bandiere della torre sono la combinazione della porta di Kuromi. Poi tocca la porta e scegli “Prendi”.';
        }
        if (!f.s_kuromiTriste) return 'Entra nella stanza e parla con Kuromi.';
        if (!f.s_invito) return has('penna') ? 'Dai la penna a Hello Kitty nella piazza: scriverà un invito per Kuromi.' : 'All’osservatorio, sulla scrivania, c’è una penna con le stelline: prendila.';
        return 'Dai l’invito a Kuromi!';
      }

      const arrive = {
        piazza: 'La piazza è piena di lucine per la Festa delle Stelle... ma in cima al pennone manca la stella!',
        osservatorio: 'L’osservatorio: un grande telescopio punta verso il cielo stellato.',
        bosco: 'Il bosco di notte. Il sentiero porta verso un castello viola...',
        cancello: 'Il castello di Kuromi! Davanti al cancello dorme qualcuno di viola e tondo...',
        sala: 'Il salone del castello, pieno di teschietti rosa. C’è una porta con una combinazione.',
        stanza: 'Eccola! La Stella dei Desideri brilla nella stanza... e c’è Kuromi!',
      };
      return { scenes, hint, arrive, welcome: `È la sera della Festa delle Stelle, ${U.esc(App.playerName())}! 🌟 My Melody sembra preoccupata: toccala e parla con lei! 👆` };
    },
  });
})();
