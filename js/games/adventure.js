'use strict';
/*
 * L'Isola delle Scimmie Ballerine: piccola avventura punta-e-clicca in stile Monkey Island.
 * Si esplorano 6 luoghi, si raccolgono oggetti, si parla con i personaggi e si risolvono enigmi
 * (compreso un duello di insulti!) per trovare il tesoro di Capitan Banana.
 * I progressi vengono salvati sul telefono: si può continuare in un secondo momento.
 */
App.register({
  id: 'avventura',
  title: 'L’Isola delle Scimmie',
  desc: 'Un’avventura da pirati con enigmi, una storia e un duello di insulti: trova il tesoro di Capitan Banana!',
  color: '#0f4c5c',
  duration: null,
  art: () => '<span class="emo">🏴‍☠️</span><span class="emo">🐒</span>',

  start(ctx) {
    const SAVE = 'cg_adventure';
    const FONT = "font-family=\"'Baloo 2', 'Trebuchet MS', Arial, sans-serif\"";

    /* ---------------- oggetti dell'inventario ---------------- */
    const ITEMS = {
      secchio: { icon: '🪣', name: 'Secchio vuoto', look: 'Un vecchio secchio di legno. Vuoto, purtroppo.' },
      acqua: { icon: '💧', name: 'Secchio d’acqua', look: 'Un secchio pieno di acqua di mare. Splish splash!' },
      banana: { icon: '🍌', name: 'Banana', look: 'Una banana gialla e profumata. Chissà a chi piacerebbe...' },
      moneta: { icon: '🪙', name: 'Moneta d’oro', look: 'Una moneta d’oro tutta lucida. Ci si può comprare qualcosa!' },
      biscotto: { icon: '🍪', name: 'Biscotto', look: 'Un biscotto croccante al cocco. Resisti, non mangiarlo!' },
      corda: { icon: '🪢', name: 'Corda', look: 'Una corda robusta da marinaio. Serve sempre!' },
      torcia: { icon: '🪵', name: 'Torcia spenta', look: 'Una torcia di legno, ma è spenta. Bisogna accenderla.' },
      fuoco: { icon: '🔥', name: 'Torcia accesa', look: 'Una torcia accesa che illumina tutto. Addio buio!' },
      chiave: { icon: '🗝️', name: 'Chiave d’oro', look: 'La chiave d’oro della Spadaccina. Apre qualcosa di importante...' },
    };

    /* ---------------- stato e salvataggio ---------------- */
    const fresh = () => ({ scene: 'molo', inv: [], f: {}, hints: 0, pts: 0 });
    let st = fresh();
    let selected = null;
    let ended = false;
    const has = i => st.inv.includes(i);
    const give = i => { if (!has(i)) st.inv.push(i); renderInv(); save(); };
    const drop = i => { st.inv = st.inv.filter(x => x !== i); if (selected === i) selected = null; renderInv(); save(); };
    const save = () => { if (!ended) Store.set(SAVE, st); };

    function step(id, pts) {
      if (st.f['s_' + id]) return;
      st.f['s_' + id] = true;
      st.pts += pts;
      ctx.add(pts);
      ctx.popup(`+${pts} ⭐`, ctx.stage.clientWidth / 2, ctx.stage.clientHeight * 0.25, 'gold');
      Sound.good();
      save();
    }

    /* ---------------- disegni ---------------- */
    const TRICORN = '<path d="M-25 -96 Q0 -124 25 -96 Q12 -103 0 -101 Q-12 -103 -25 -96 Z" fill="#1b1b1b"/><circle cx="0" cy="-107" r="3.5" fill="#fff"/>';
    const bandana = c => `<path d="M-15 -92 Q0 -110 15 -92 Z" fill="${c}"/><path d="M14 -95 L25 -88 L16 -84 Z" fill="${c}"/>`;
    function person(x, y, o) {
      const skin = o.skin || '#f1c27d', pants = o.pants || '#3d2b1f';
      return `<g transform="translate(${x} ${y}) scale(${o.s || 1})">
        <ellipse cx="0" cy="0" rx="26" ry="5" fill="rgba(0,0,0,.25)"/>
        <rect x="-12" y="-32" width="9" height="30" fill="${pants}"/>
        ${o.peg ? '<rect x="5" y="-32" width="5" height="32" fill="#8d5a32"/>' : `<rect x="3" y="-32" width="9" height="30" fill="${pants}"/><ellipse cx="8" cy="-2" rx="8" ry="4" fill="#222"/>`}
        <ellipse cx="-8" cy="-2" rx="8" ry="4" fill="#222"/>
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
    const barbagrigia = (x, y) => person(x, y, { coat: '#1d3557', beard: '#cfcfcf', patch: true, peg: true, hat: TRICORN, belt: true });
    const oste = (x, y) => person(x, y, { coat: '#e9c46a', apron: true, mustache: '#3d2b1f', skin: '#e8b48c' });
    const spadaccina = (x, y) => person(x, y, {
      coat: '#9d0208', skin: '#e0ac69', blush: true, belt: true, pants: '#1b1b1b', hat: bandana('#e63946'),
      hairBack: '<path d="M8 -96 Q34 -92 26 -58 Q20 -80 6 -90 Z" fill="#16161d"/>',
      extra: '<path d="M26 -36 L52 -76" stroke="#d9d9d9" stroke-width="3.5" stroke-linecap="round"/><path d="M20 -40 L32 -32" stroke="#ffd23f" stroke-width="4"/>',
    });
    const parrot = (x, y, happy) => `<g transform="translate(${x} ${y})">
      <path d="M0 0 L0 70" stroke="#5a3418" stroke-width="4"/><path d="M-28 0 L28 0" stroke="#5a3418" stroke-width="5" stroke-linecap="round"/>
      <path d="M-4 -8 L-12 22 L2 -2 Z" fill="#e63946"/><ellipse cx="0" cy="-20" rx="12" ry="18" fill="#2ec27e"/>
      <path d="M-10 -24 Q-20 -10 -8 0 Z" fill="#1a9c60"/><circle cx="0" cy="-40" r="10" fill="#2ec27e"/>
      <path d="M7 -42 Q18 -38 9 -31 Z" fill="#ffd23f"/><circle cx="3" cy="-43" r="2.3" fill="#111"/>
      ${happy ? '<path d="M-8 -52 L-4 -46 M0 -54 L0 -48 M8 -52 L4 -46" stroke="#e63946" stroke-width="2"/>' : ''}</g>`;
    const monkey = (x, y, happy) => `<g transform="translate(${x} ${y})">
      <ellipse cx="0" cy="26" rx="13" ry="15" fill="#8d5a32"/><path d="M12 30 Q32 32 26 8" stroke="#8d5a32" stroke-width="4" fill="none"/>
      <circle cx="-15" cy="-4" r="6" fill="#8d5a32"/><circle cx="15" cy="-4" r="6" fill="#8d5a32"/>
      <circle cx="0" cy="0" r="16" fill="#8d5a32"/><ellipse cx="0" cy="4" rx="11" ry="9" fill="#e9c69a"/>
      <circle cx="-5" cy="-4" r="2.3" fill="#111"/><circle cx="5" cy="-4" r="2.3" fill="#111"/>
      ${happy ? '<path d="M-5 6 Q0 13 5 6 Z" fill="#7a2b3a"/>' : '<path d="M-4 9 Q0 6 4 9" stroke="#5a3418" stroke-width="1.6" fill="none"/>'}</g>`;
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

    /* ---------------- luoghi ---------------- */
    const SCENES = {
      molo: {
        name: '⚓ Il Molo',
        draw: () => skyGrad('#6ec6ff', '#d6f0ff') +
          '<circle cx="330" cy="40" r="20" fill="#ffd23f"/><rect y="140" width="400" height="110" fill="#1e88e5"/><path d="M0 150 Q25 144 50 150 T100 150 T150 150 T200 150 T250 150 T300 150 T350 150 T400 150" stroke="#bbdefb" stroke-width="2" fill="none"/>' +
          '<path d="M300 172 L380 172 L368 192 L312 192 Z" fill="#8d5a32"/><path d="M340 172 L340 110" stroke="#5a3418" stroke-width="4"/><path d="M342 112 L372 160 L342 160 Z" fill="#fff"/><path d="M340 110 L322 118 L340 124 Z" fill="#111"/>' +
          '<rect x="0" y="180" width="400" height="70" fill="#a0703c"/>' + Array.from({ length: 12 }, (_, i) => `<path d="M${i * 34} 180 L${i * 34} 250" stroke="#7a5230" stroke-width="2"/>`).join('') +
          '<path d="M8 60 L65 20 L122 60 Z" fill="#6b2d0b"/><rect x="14" y="60" width="102" height="122" fill="#a0522d"/><rect x="48" y="118" width="34" height="62" rx="4" fill="#5a3418"/><circle cx="76" cy="150" r="2.5" fill="#ffd23f"/>' +
          `<rect x="22" y="78" width="86" height="24" rx="4" fill="#3d2b1f"/><text x="65" y="95" font-size="11" font-weight="800" fill="#ffd23f" text-anchor="middle" ${FONT}>IL GROG ALLEGRO</text>` +
          '<rect x="22" y="116" width="18" height="18" fill="#ffe082"/><rect x="92" y="116" width="18" height="18" fill="#ffe082"/>' +
          '<rect x="286" y="112" width="12" height="80" fill="#5a3418"/>' +
          (st.f.s_corda ? '' : '<ellipse cx="292" cy="150" rx="15" ry="6" fill="none" stroke="#d4a373" stroke-width="5"/><ellipse cx="292" cy="160" rx="15" ry="6" fill="none" stroke="#d4a373" stroke-width="5"/>') +
          (has('secchio') || st.f.s_acqua ? '' : '<path d="M140 200 L164 200 L160 226 L144 226 Z" fill="#8d5a32" stroke="#5a3418" stroke-width="2"/><path d="M140 200 Q152 186 164 200" stroke="#555" stroke-width="2" fill="none"/>') +
          barbagrigia(218, 236) + exitSign(300, 214, 'Spiaggia ➡'),
        spots: () => [
          { id: 'taverna', name: '🚪 Porta della taverna', x: 44, y: 112, w: 44, h: 72, go: 'taverna', look: 'La taverna “Il Grog Allegro”. Da dentro arriva un profumino di biscotti.' },
          { id: 'cartello', name: '🪧 Insegna', x: 20, y: 76, w: 90, h: 28, look: '“Il Grog Allegro – Vietato l’ingresso alle scimmie (soprattutto se ballano)”.' },
          { id: 'barba', name: '🏴‍☠️ Capitan Barbagrigia', x: 186, y: 120, w: 64, h: 120, talk: talkBarba, look: 'Il vecchio Capitan Barbagrigia. Ha più rughe di una mappa stropicciata e una gamba di legno.' },
          ...(has('secchio') || st.f.s_acqua ? [] : [{ id: 'secchio', name: '🪣 Secchio', x: 132, y: 184, w: 40, h: 46, take: () => { give('secchio'); step('secchio', 20); say(null, 'Hai preso il secchio! Ora è nel tuo zaino. 🎒'); }, look: 'Un secchio di legno abbandonato sul molo.' }]),
          ...(st.f.s_corda ? [] : [{ id: 'corda', name: '🪢 Corda', x: 270, y: 136, w: 44, h: 34, take: () => { give('corda'); step('corda', 20); say(null, 'Hai slegato la corda dal palo. Potrebbe servire per riparare qualcosa!'); }, look: 'Una corda robusta arrotolata attorno al palo.' }]),
          { id: 'mare', name: '🌊 Mare', x: 130, y: 140, w: 160, h: 38, look: 'Il mare luccica. Ci sono un sacco di pesci curiosi.', use: { secchio: () => { drop('secchio'); give('acqua'); step('acqua', 50); say(null, 'Splash! Hai riempito il secchio con l’acqua di mare. 💧'); } } },
          { id: 'barca', name: '⛵ Barca', x: 296, y: 104, w: 90, h: 92, look: 'La barca di Barbagrigia. “Senza tesoro non si parte!”, dice sempre lui.' },
          { id: 'exit', name: 'Verso la spiaggia', x: 296, y: 204, w: 104, h: 40, go: 'spiaggia' },
        ],
      },
      taverna: {
        name: '🍺 Taverna “Il Grog Allegro”',
        draw: () => '<rect width="400" height="250" fill="#8d5a32"/>' + Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 20} L400 ${i * 20}" stroke="#7a4a22" stroke-width="2"/>`).join('') +
          '<rect y="196" width="400" height="54" fill="#5a3418"/>' +
          '<rect x="14" y="96" width="86" height="104" fill="#8a8a8a"/><rect x="26" y="130" width="62" height="70" fill="#2b2b2b"/>' + Array.from({ length: 4 }, (_, i) => `<path d="M14 ${106 + i * 24} L100 ${106 + i * 24}" stroke="#6b6b6b" stroke-width="2"/>`).join('') +
          '<path d="M40 200 Q46 170 56 186 Q60 160 70 184 Q78 168 76 200 Z" fill="#ff7b00"/><path d="M50 200 Q56 182 62 192 Q68 180 68 200 Z" fill="#ffd23f"/>' +
          (st.f.s_torcia ? '' : '<rect x="124" y="56" width="7" height="34" fill="#8d5a32" transform="rotate(-15 127 73)"/><ellipse cx="122" cy="56" rx="7" ry="5" fill="#3d2b1f"/><rect x="118" y="78" width="16" height="5" fill="#555"/>') +
          oste(222, 196) +
          '<rect x="140" y="140" width="164" height="60" fill="#6b4423"/><rect x="136" y="134" width="172" height="10" rx="3" fill="#a0703c"/>' +
          '<ellipse cx="168" cy="134" rx="18" ry="5" fill="#ddd"/><path d="M156 130 Q162 116 170 128 M162 130 Q170 112 178 128" stroke="#ffd23f" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="176" cy="128" r="5" fill="#e63946"/>' +
          '<rect x="262" y="108" width="26" height="28" rx="5" fill="rgba(200,230,255,.6)" stroke="#999"/><rect x="260" y="104" width="30" height="6" rx="2" fill="#8d5a32"/><circle cx="270" cy="124" r="5" fill="#c47a2c"/><circle cx="280" cy="128" r="5" fill="#c47a2c"/><circle cx="275" cy="118" r="5" fill="#c47a2c"/>' +
          parrot(352, 96, st.f.s_pw) +
          '<ellipse cx="312" cy="226" rx="34" ry="8" fill="#a0703c"/><rect x="306" y="226" width="12" height="22" fill="#6b4423"/>' +
          spadaccina(266, 246) + exitSign(8, 214, '⬅ Molo'),
        spots: () => [
          { id: 'oste', name: '👨‍🍳 Oste Gustavo', x: 196, y: 96, w: 56, h: 46, talk: talkOste, look: 'Gustavo, l’oste. Ha dei baffi così grandi che ci potrebbe nascondere un panino.', use: { acqua: () => { drop('acqua'); give('banana'); step('banana', 100); dialog([[OSTE, 'Un secchio d’acqua! Finalmente posso lavare i piatti! 🍽️'], [OSTE, 'Grazie, mozzo! Tieni, prendi una banana dalla mia fruttiera. 🍌']]); }, moneta: () => { drop('moneta'); give('biscotto'); step('biscotto', 100); dialog([[OSTE, 'Una moneta d’oro! Ecco a te il biscotto al cocco più croccante dell’isola! 🍪']]); } } },
          { id: 'frutta', name: '🍌 Fruttiera', x: 148, y: 110, w: 40, h: 30, look: 'Banane, mele e un ananas un po’ triste.', take: () => (has('banana') || st.f.s_banana ? say(OSTE, 'Ne hai già avuta una, golosone!') : say(OSTE, 'Ehi! Giù le mani! Le banane si guadagnano: portami un secchio d’acqua per lavare i piatti e te ne do una.')) },
          { id: 'biscotti', name: '🍪 Barattolo dei biscotti', x: 256, y: 100, w: 38, h: 38, look: 'Biscotti al cocco! Il cartellino dice: “1 moneta d’oro”.', take: () => say(OSTE, 'I biscotti costano una moneta d’oro, mozzo!') },
          { id: 'coco', name: '🦜 Pappagallo Coco', x: 326, y: 46, w: 52, h: 60, talk: talkCoco, look: 'Coco, il pappagallo dell’oste. Sa un sacco di segreti... e adora i biscotti.', use: { biscotto: () => { drop('biscotto'); step('pw', 150); st.f.pw = true; save(); dialog([[COCO, 'Crà! Biscotto! Gnam gnam gnam! 🍪'], [COCO, 'Crà! Ti dico il segreto: la parola d’ordine della Grotta del Teschio è... BANANA BALLERINA! Crà!'], [null, '📝 Hai imparato la parola d’ordine: <b>BANANA BALLERINA</b>.']]); render(); } } },
          ...(st.f.s_torcia ? [] : [{ id: 'torcia', name: '🪵 Torcia sul muro', x: 108, y: 46, w: 34, h: 50, look: 'Una torcia appesa al muro. È spenta.', take: () => { give('torcia'); step('torcia', 20); say(null, 'Hai preso la torcia! Però è spenta...'); } }]),
          { id: 'camino', name: '🔥 Camino', x: 14, y: 96, w: 88, h: 104, look: 'Un camino scoppiettante. Fa un bel calduccio.', use: { torcia: () => { drop('torcia'); give('fuoco'); step('fuoco', 100); say(null, 'Fiuuum! Hai acceso la torcia nel camino. 🔥 Ora puoi andare anche nei posti più bui!'); } } },
          { id: 'spada', name: '⚔️ Spadaccina', x: 234, y: 146, w: 60, h: 100, talk: talkSpada, look: 'La Spadaccina: la piratessa campionessa di duelli di insulti. Ha una chiave d’oro appesa alla cintura.' },
          { id: 'exit', name: 'Verso il molo', x: 0, y: 204, w: 96, h: 40, go: 'molo' },
        ],
      },
      spiaggia: {
        name: '🏝️ La Spiaggia',
        draw: () => skyGrad('#6ec6ff', '#e1f5fe') + '<rect y="110" width="400" height="40" fill="#1e88e5"/><path d="M0 150 Q100 136 200 150 T400 146 L400 250 L0 250 Z" fill="#f4d58d"/>' +
          palm(270, 236, 170) + monkey(250, 82, st.f.s_moneta) + crab(118, 220) +
          '<path d="M60 236 Q66 226 72 236 Z" fill="#ff8fab"/><circle cx="330" cy="230" r="5" fill="#fff"/>' +
          exitSign(8, 214, '⬅ Molo') + exitSign(300, 214, 'Giungla ➡'),
        spots: () => [
          { id: 'scimmia', name: '🐒 Scimmia Bubù', x: 224, y: 56, w: 54, h: 68, talk: () => (st.f.s_moneta ? say(BUBU, 'Uh uh ah ah! 💃 (La scimmia balla felice con la pancia piena.)') : say(BUBU, 'Uh uh! 🐒 (La scimmia si tocca la pancia e guarda le banane... ha una fame da lupo! In mano stringe qualcosa di luccicante.)')), look: 'Bubù, la scimmia ballerina. Tiene stretta in mano una moneta d’oro!', use: { banana: () => { drop('banana'); give('moneta'); step('moneta', 100); dialog([[BUBU, 'Uh uh ah ah! 🍌 (Bubù sbuccia la banana e la mangia in un boccone!)'], [null, 'Felice, Bubù fa una piroetta e ti lancia la sua moneta d’oro! 🪙']]); render(); } } },
          { id: 'palma', name: '🌴 Palma', x: 236, y: 120, w: 46, h: 116, look: 'Una palma altissima. In cima vive Bubù.' },
          { id: 'granchio', name: '🦀 Granchio', x: 92, y: 198, w: 54, h: 36, look: 'Un granchio che cammina di lato. Ti guarda storto.', talk: () => say({ name: 'Granchio', icon: '🦀' }, 'Clic clac! Io non so niente di tesori. So solo camminare di lato. Clic!') },
          { id: 'mare', name: '🌊 Mare', x: 0, y: 108, w: 400, h: 40, look: 'Il mare è così bello che vorresti fare il bagno. Ma prima il tesoro!' },
          { id: 'exitL', name: 'Verso il molo', x: 0, y: 204, w: 96, h: 40, go: 'molo' },
          { id: 'exitR', name: 'Verso la giungla', x: 296, y: 204, w: 104, h: 40, go: 'giungla' },
        ],
      },
      giungla: {
        name: '🌿 La Giungla',
        draw: () => skyGrad('#a7e3a0', '#4f9a33') +
          '<rect x="0" y="150" width="160" height="100" fill="#3e7a2a"/><rect x="250" y="150" width="150" height="100" fill="#3e7a2a"/><rect x="160" y="150" width="90" height="100" fill="#1b2a12"/>' +
          [[20, 60], [60, 80], [110, 50], [380, 70]].map(([x, h]) => `<rect x="${x}" y="${150 - h}" width="10" height="${h}" fill="#5a3418"/><circle cx="${x + 5}" cy="${150 - h}" r="26" fill="#2d6a4f"/>`).join('') +
          (st.f.s_ponte
            ? '<path d="M156 150 L254 150" stroke="#5a3418" stroke-width="3"/><path d="M156 132 Q205 146 254 132" stroke="#d4a373" stroke-width="3" fill="none"/>' + Array.from({ length: 9 }, (_, i) => `<rect x="${160 + i * 10.5}" y="147" width="8" height="8" fill="#a0703c"/>`).join('')
            : '<path d="M156 150 L172 178" stroke="#5a3418" stroke-width="3"/><rect x="164" y="166" width="8" height="8" fill="#a0703c" transform="rotate(50 168 170)"/><path d="M254 150 L240 184" stroke="#5a3418" stroke-width="3"/><rect x="236" y="176" width="8" height="8" fill="#a0703c" transform="rotate(-50 240 180)"/>') +
          '<path d="M290 150 Q290 84 336 84 Q382 84 382 150 Z" fill="#2b2b2b"/><path d="M300 150 Q300 96 336 96 Q372 96 372 150 Z" fill="#111"/>' +
          '<circle cx="336" cy="72" r="13" fill="#eee"/><circle cx="331" cy="70" r="3" fill="#111"/><circle cx="341" cy="70" r="3" fill="#111"/><rect x="330" y="80" width="12" height="6" fill="#eee"/>' +
          exitSign(8, 214, '⬅ Spiaggia'),
        spots: () => [
          { id: 'ponte', name: st.f.s_ponte ? '🌉 Ponte riparato' : '🌉 Ponte rotto', x: 152, y: 128, w: 106, h: 60, look: st.f.s_ponte ? 'Il ponte è di nuovo intero. Ottimo lavoro, mozzo!' : 'Il ponte di corda è rotto! Sotto c’è un burrone profondissimo. Servirebbe qualcosa per legarlo...', use: { corda: () => { drop('corda'); step('ponte', 150); say(null, 'Hai legato la corda ai due pali: il ponte è riparato! 🌉 Ora puoi attraversarlo.'); render(); } } },
          { id: 'grotta', name: '💀 Grotta del Teschio', x: 286, y: 56, w: 100, h: 98, look: 'La Grotta del Teschio. Dentro è buio pesto... brrr!', go: () => {
            if (!st.f.s_ponte) return say(null, 'Il ponte è rotto: non posso arrivare alla grotta! Devo ripararlo in qualche modo.');
            if (!has('fuoco')) return say(null, 'Dentro la grotta è buio pesto... Mi serve una torcia accesa! 🔦');
            go('grotta');
          } },
          { id: 'exit', name: 'Verso la spiaggia', x: 0, y: 204, w: 110, h: 40, go: 'spiaggia' },
        ],
      },
      grotta: {
        name: '💀 La Grotta del Teschio',
        draw: () => '<rect width="400" height="250" fill="#2b2620"/><defs><radialGradient id="advglow" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#ffb347" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="250" fill="url(#advglow)"/>' +
          '<path d="M0 0 L40 30 L80 0 L130 26 L180 0 L230 30 L290 0 L340 24 L400 0 Z" fill="#1a1612"/><rect y="210" width="400" height="40" fill="#1a1612"/>' +
          (st.f.s_porta
            ? '<path d="M140 210 L140 90 Q200 30 260 90 L260 210 Z" fill="#000"/><path d="M150 210 L150 96 Q200 46 250 96 L250 210 Z" fill="#ffd23f" opacity=".25"/>'
            : '<path d="M140 210 L140 90 Q200 30 260 90 L260 210 Z" fill="#6b6b6b" stroke="#4a4a4a" stroke-width="4"/><circle cx="200" cy="112" r="34" fill="#e0e0e0"/><circle cx="187" cy="106" r="9" fill="#111"/><circle cx="213" cy="106" r="9" fill="#111"/><circle cx="187" cy="106" r="3" fill="#ff1e1e"/><circle cx="213" cy="106" r="3" fill="#ff1e1e"/><path d="M196 122 L200 116 L204 122 Z" fill="#111"/><rect x="184" y="130" width="32" height="10" fill="#fff" stroke="#111"/><path d="M192 130 L192 140 M200 130 L200 140 M208 130 L208 140" stroke="#111"/>') +
          '<rect x="58" y="80" width="6" height="30" fill="#8d5a32"/><path d="M54 80 Q61 58 68 80 Z" fill="#ff7b00"/><rect x="336" y="80" width="6" height="30" fill="#8d5a32"/><path d="M332 80 Q339 58 346 80 Z" fill="#ff7b00"/>' +
          exitSign(8, 220, '⬅ Giungla') + (st.f.s_porta ? exitSign(150, 160, 'Entra ➡') : ''),
        spots: () => [
          { id: 'porta', name: st.f.s_porta ? '🚪 Passaggio segreto' : '💀 Porta del Teschio', x: 136, y: 40, w: 128, h: 172, look: st.f.s_porta ? 'La porta è aperta! Dall’altra parte brilla qualcosa d’oro...' : 'Una porta di pietra con un teschio. Gli occhi brillano di rosso!', talk: () => (st.f.s_porta ? go('tesoro') : askPassword()), go: st.f.s_porta ? 'tesoro' : null },
          { id: 'exit', name: 'Verso la giungla', x: 0, y: 210, w: 110, h: 40, go: 'giungla' },
        ],
      },
      tesoro: {
        name: '💰 La Sala del Tesoro',
        draw: () => '<rect width="400" height="250" fill="#3a2a10"/><defs><radialGradient id="advgold" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#ffd23f" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="250" fill="url(#advgold)"/>' +
          '<rect y="210" width="400" height="40" fill="#2a1d0a"/>' +
          [[60, 200], [330, 204], [100, 214], [300, 216]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="30" ry="12" fill="#e9b200"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${x - 20 + i * 8}" cy="${y - 4 - (i % 2) * 4}" r="5" fill="#ffd23f" stroke="#c99a00"/>`).join('')).join('') +
          (st.f.s_tesoro
            ? '<rect x="156" y="160" width="88" height="50" fill="#8d5a32" stroke="#5a3418" stroke-width="3"/><path d="M156 160 L162 112 L238 112 L244 160 Z" fill="#a0703c" stroke="#5a3418" stroke-width="3"/>' + Array.from({ length: 9 }, (_, i) => `<circle cx="${166 + i * 9}" cy="${158 - (i % 3) * 4}" r="6" fill="#ffd23f" stroke="#c99a00"/>`).join('') + '<path d="M184 140 L190 124 L198 136 L204 120 L210 136 L218 124 L222 140 Z" fill="#ffd23f" stroke="#c99a00"/><circle cx="204" cy="132" r="3" fill="#e63946"/>'
            : '<rect x="156" y="150" width="88" height="60" fill="#8d5a32" stroke="#5a3418" stroke-width="3"/><path d="M156 150 Q200 118 244 150 Z" fill="#a0703c" stroke="#5a3418" stroke-width="3"/><rect x="152" y="160" width="96" height="8" fill="#ffd23f"/><rect x="192" y="158" width="16" height="20" rx="3" fill="#ffd23f" stroke="#c99a00"/><circle cx="200" cy="166" r="3" fill="#111"/>') +
          exitSign(8, 220, '⬅ Grotta'),
        spots: () => [
          { id: 'scrigno', name: '🧰 Scrigno di Capitan Banana', x: 150, y: 110, w: 100, h: 104, look: st.f.s_tesoro ? 'Il tesoro di Capitan Banana! Monete, gioielli e una corona d’oro!' : 'Lo scrigno del leggendario Capitan Banana! È chiuso con un lucchetto d’oro.', take: () => say(null, 'È chiuso a chiave! Serve una chiave d’oro...'), use: { chiave: () => { drop('chiave'); step('tesoro', 300); render(); finale(); } } },
          { id: 'oro', name: '🪙 Monete', x: 30, y: 184, w: 100, h: 40, look: 'Quante monete! Ma il vero tesoro è nello scrigno.' },
          { id: 'exit', name: 'Verso la grotta', x: 0, y: 210, w: 110, h: 40, go: 'grotta' },
        ],
      },
    };

    /* ---------------- personaggi e dialoghi ---------------- */
    const BARBA = { name: 'Capitan Barbagrigia', icon: '🏴‍☠️' };
    const OSTE = { name: 'Oste Gustavo', icon: '👨‍🍳' };
    const COCO = { name: 'Coco', icon: '🦜' };
    const BUBU = { name: 'Bubù', icon: '🐒' };
    const SPADA = { name: 'Spadaccina', icon: '⚔️' };
    const ME = () => ({ name: App.playerName(), icon: '🧒' });

    function talkBarba() {
      if (!st.f.s_quest) {
        dialog([
          [BARBA, `Arrr! Chi abbiamo qui? Un mozzo! Come ti chiami?`],
          [ME(), `Mi chiamo ${App.playerName()} e voglio diventare un vero pirata!`],
          [BARBA, 'Ah ah! Un vero pirata deve trovare un vero tesoro! Si dice che il tesoro di Capitan Banana sia nascosto nella Grotta del Teschio, oltre la giungla.'],
          [BARBA, 'Ma attento: la porta della grotta si apre solo con la parola d’ordine segreta... e lo scrigno solo con la chiave d’oro della Spadaccina!'],
          [BARBA, 'Comincia dalla taverna: lì si sa sempre tutto. Buona fortuna, mozzo!'],
        ], () => step('quest', 50));
      } else if (st.f.s_tesoro) {
        say(BARBA, 'Arrr! Sei un vero pirata ora!');
      } else {
        const todo = [];
        if (!st.f.s_pw) todo.push('🔑 scoprire la parola d’ordine');
        if (!has('chiave') && !st.f.s_duello) todo.push('🗝️ vincere la chiave d’oro della Spadaccina');
        if (!st.f.s_ponte) todo.push('🌉 attraversare il burrone della giungla');
        if (!has('fuoco') && !st.f.s_porta) todo.push('🔥 trovare una luce per la grotta buia');
        say(BARBA, `Ricorda, mozzo! Per il tesoro devi ancora:<br>${todo.join('<br>') || 'aprire lo scrigno nella grotta!'}`);
      }
    }

    function talkOste() {
      choices('Cosa vuoi chiedere all’oste?', [
        { label: '👋 Ciao! Cosa sai del tesoro?', fn: () => say(OSTE, 'Il tesoro di Capitan Banana? Chiedi a Coco, il mio pappagallo: lui sa tutti i segreti dell’isola! Ma parla solo se ha la pancia piena di biscotti...') },
        { label: '🍌 Posso avere una banana?', fn: () => say(OSTE, st.f.s_banana ? 'Te l’ho già data, golosone!' : 'Solo se mi porti un secchio d’acqua: devo lavare una montagna di piatti!') },
        { label: '🍪 Vorrei un biscotto', fn: () => say(OSTE, 'Un biscotto al cocco costa una moneta d’oro. Hai una moneta?') },
        { label: '👋 Ciao ciao!', fn: () => say(OSTE, 'Torna presto, mozzo!') },
      ]);
    }

    function talkCoco() {
      if (st.f.pw) say(COCO, 'Crà! La parola d’ordine è BANANA BALLERINA! Crà! Non dirlo a nessuno!');
      else say(COCO, 'Crà! Niente biscotto, niente segreto! Crà! Crà!');
    }

    /* Il duello di insulti (in versione per bambini) */
    const INSULTS = [
      ['Sei così lento che le lumache ti sorpassano!', 'Si fermano solo per chiedermi l’autografo!', ['Le lumache sono carine.', 'Ehm... non è vero!']],
      ['La tua spada è più storta di una banana!', 'Perfetto, così ti faccio scivolare sulla buccia!', ['Me l’ha regalata la nonna.', 'Uffa, la raddrizzo dopo.']],
      ['Ho visto pirati più coraggiosi dentro una vasca da bagno!', 'Certo, eri tu che piangevi per lo shampoo negli occhi!', ['Anche a me piace il bagnetto.', 'Cosa c’entra la vasca?']],
      ['Puzzi come un pesce lesso!', 'Strano, i gatti seguono te, non me!', ['Mi sono lavato ieri!', 'Il pesce lesso è buono.']],
      ['Combatti come un pollo spennato!', 'Allora preparati al solletico con le piume che mi restano!', ['Coccodè!', 'Io non sono un pollo!']],
      ['Ti batterò prima che tu possa dire “pappagallo”!', 'Pappagallo! Ops... sei già in ritardo!', ['Pappa... gallo?', 'Non so dire pappagallo.']],
    ];
    function talkSpada() {
      if (st.f.s_duello) return say(SPADA, 'Sei la lingua più affilata dei sette mari, mozzo! La chiave è tua, usala bene.');
      dialog([
        [SPADA, 'Ehilà, mozzo! Io sono la Spadaccina, campionessa di duelli di insulti! ⚔️'],
        [SPADA, 'Vuoi la mia chiave d’oro? Allora battimi a duello! Io dico un insulto, tu rispondi con la battuta più furba. Se sbagli, hai perso!'],
      ], () => choices('Accetti la sfida?', [
        { label: '⚔️ Sì, in guardia!', fn: () => duel(U.shuffle(INSULTS.slice()).slice(0, 3), 0) },
        { label: '😅 Magari dopo...', fn: () => say(SPADA, 'Ah ah! Torna quando avrai il coraggio!') },
      ]));
    }
    function duel(rounds, i) {
      if (i >= rounds.length) {
        give('chiave');
        step('duello', 200);
        return dialog([[SPADA, 'Argh! Non ci posso credere... mi hai battuta! 😲'], [SPADA, 'Una promessa è una promessa: ecco la mia chiave d’oro! 🗝️']]);
      }
      const [insult, right, wrong] = rounds[i];
      const opts = U.shuffle([{ t: right, ok: true }, ...wrong.map(t => ({ t, ok: false }))]);
      say(SPADA, `<b>Round ${i + 1} di ${rounds.length}</b><br>“${insult}”`, opts.map(o => ({
        label: o.t,
        fn: () => {
          if (o.ok) { Sound.good(); say(ME(), `“${o.t}”`, [{ label: '⚔️ Avanti!', fn: () => duel(rounds, i + 1) }]); }
          else { Sound.bad(); dialog([[ME(), `“${o.t}”`], [SPADA, 'Ah ah ah! Che risposta moscia! Ho vinto io! Torna quando avrai la lingua più affilata. 😜']]); }
        },
      })));
    }

    function askPassword() {
      const opts = U.shuffle(['Apriti Sesamo!', 'Banana Ballerina!', 'Abracadabra!', 'Per favore, porta!']);
      say({ name: 'Porta del Teschio', icon: '💀' }, 'CHI OSA DISTURBARE IL MIO SONNO? Dimmi la parola d’ordine... o vattene!', opts.map(t => ({
        label: t,
        fn: () => {
          if (t === 'Banana Ballerina!') {
            step('porta', 150); render();
            say({ name: 'Porta del Teschio', icon: '💀' }, 'Grrr... è giusta! Puoi passare. *La porta si apre con un rumore di pietra*', [{ label: '➡ Entra', fn: () => go('tesoro') }]);
          } else {
            Sound.bad();
            say({ name: 'Porta del Teschio', icon: '💀' }, `“${t.replace('!', '')}”?! AH AH AH! Parola sbagliata! Chissà chi conosce la parola d’ordine...`);
          }
        },
      })));
    }

    function finale() {
      Sound.win();
      dialog([
        [null, '✨ Con la chiave d’oro apri lo scrigno... CLIC!'],
        [null, '💰 Monete, gioielli e la corona d’oro di Capitan Banana! Hai trovato il tesoro!'],
        [BARBA, `Arrr! ${App.playerName()}, da oggi non sei più un mozzo: sei un VERO PIRATA! 🏴‍☠️`],
      ], () => {
        ended = true;
        Store.set(SAVE, null);
        const stars = st.hints === 0 ? 3 : st.hints <= 3 ? 2 : 1;
        ctx.end({
          title: 'Sei un vero pirata! 🏴‍☠️',
          msg: `Hai trovato il tesoro di Capitan Banana!<br>Aiuti usati: <b>${st.hints}</b>`,
          stars,
        });
      });
    }

    /* ---------------- aiuti ---------------- */
    function hintText() {
      const f = st.f;
      if (!f.s_quest) return 'Parla con il vecchio Capitan Barbagrigia sul molo.';
      if (!f.s_acqua && !has('secchio')) return 'Sul molo c’è un secchio: prendilo!';
      if (!f.s_acqua) return 'Seleziona il secchio nello zaino e poi tocca il mare per riempirlo.';
      if (!f.s_banana) return 'L’oste vuole un secchio d’acqua: seleziona il secchio d’acqua e tocca l’oste.';
      if (!f.s_moneta) return 'La scimmia Bubù sulla palma in spiaggia ha fame: dalle la banana!';
      if (!f.s_biscotto) return 'Dai la moneta d’oro all’oste per comprare un biscotto.';
      if (!f.s_pw) return 'Dai il biscotto al pappagallo Coco: ti dirà la parola d’ordine.';
      if (!f.s_duello) return 'Parla con la Spadaccina nella taverna e sfidala! Scegli sempre la risposta più spiritosa, quella che ribalta l’insulto.';
      if (!f.s_ponte && !has('corda')) return 'Sul molo c’è una corda arrotolata al palo: prendila.';
      if (!f.s_ponte) return 'Seleziona la corda e tocca il ponte rotto nella giungla.';
      if (!f.s_fuoco && !has('torcia')) return 'Nella taverna c’è una torcia appesa al muro: prendila.';
      if (!f.s_fuoco) return 'Seleziona la torcia e toccala sul camino della taverna per accenderla.';
      if (!f.s_porta) return 'Vai nella grotta, tocca la porta del teschio e di’ la parola d’ordine del pappagallo.';
      return 'Seleziona la chiave d’oro e tocca lo scrigno!';
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
    function dialog(lines, then) {
      let i = 0;
      const next = () => {
        if (i >= lines.length) { if (then) then(); return; }
        const [who, text] = lines[i++];
        const last = i >= lines.length;
        say(who, text, (last && !then) ? [] : [{ label: last ? '✔ Ok' : '▶ Avanti', fn: next }]);
      };
      next();
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
      const sc = SCENES[st.scene];
      place.textContent = sc.name;
      const spots = sc.spots();
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
      const intro = {
        taverna: 'Entri nella taverna. Profumo di biscotti e di avventura!',
        spiaggia: 'Sabbia calda e onde che fanno shhh... Su una palma c’è una scimmia!',
        giungla: 'La giungla è piena di rumori strani. Più avanti c’è un burrone e, dall’altra parte, una grotta a forma di teschio!',
        grotta: 'La torcia illumina la grotta... davanti a te c’è una porta di pietra con un teschio!',
        tesoro: 'Oro dappertutto! Al centro c’è lo scrigno di Capitan Banana!',
        molo: 'Sei sul molo. Il mare luccica e i gabbiani strillano.',
      }[scene];
      say(null, intro);
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
      if (!h || ended) return;
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
      if (!b || ended) return;
      Sound.pop();
      if (b.dataset.b === 'hint') {
        st.hints++;
        st.pts = Math.max(0, st.pts - 20);
        ctx.add(-20);
        save();
        say({ name: 'Aiuto', icon: '💡' }, `${hintText()}<br><small>(Un aiuto costa 20 punti.)</small>`);
      }
      if (b.dataset.b === 'spots') {
        svgBox.classList.remove('show'); void svgBox.offsetWidth; svgBox.classList.add('show');
        setTimeout(() => svgBox.classList.remove('show'), 1800);
      }
      if (b.dataset.b === 'restart') {
        say(null, 'Vuoi davvero ricominciare l’avventura da capo?', [
          { label: '🔄 Sì, ricomincia', fn: () => { st = fresh(); ctx.add(-ctx.points); save(); go('molo'); talkBarbaHint(); } },
          { label: '↩️ No, continuo', fn: () => say(null, 'Bene, avanti tutta!') },
        ]);
      }
    });
    const talkBarbaHint = () => say(null, `Sei sul molo, ${U.esc(App.playerName())}. Vedi quel vecchio pirata? Toccalo e parla con lui! 👆`);

    /* ---------------- avvio ---------------- */
    const saved = Store.get(SAVE, null);
    const canResume = saved && saved.f && Object.keys(saved.f).length > 0;
    function begin(resume) {
      if (resume) { st = Object.assign(fresh(), saved); ctx.add(st.pts); }
      ctx.begin();
      render();
      renderInv();
      if (resume) say(null, `Bentornato, ${U.esc(App.playerName())}! Riprendiamo l’avventura da dove l’avevi lasciata. 🏴‍☠️`);
      else talkBarbaHint();
    }

    ctx.intro({
      title: 'L’Isola delle Scimmie Ballerine',
      art: '<span class="emo">🏴‍☠️</span><span class="emo">🏝️</span><span class="emo">🐒</span>',
      text: 'Sei un piccolo mozzo che sogna di diventare pirata! Esplora l’isola, parla con tutti, raccogli oggetti nello zaino e usali al posto giusto per trovare il <b>tesoro di Capitan Banana</b>. Tocca le cose nella scena per guardarle, prenderle o parlarci. Se sei bloccato, c’è il pulsante 💡 Aiuto!',
      buttons: canResume
        ? [{ label: '▶ Continua l’avventura', value: true }, { label: '🆕 Nuova avventura', value: false }]
        : [{ label: '🏴‍☠️ Inizia l’avventura!', value: false }],
    }, resume => {
      if (!resume) Store.set(SAVE, null);
      begin(!!resume);
    });

    return { stop() { save(); } };
  },
});
