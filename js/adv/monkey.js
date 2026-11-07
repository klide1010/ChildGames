'use strict';
/*
 * Mondo "L'Isola delle Scimmie": avventura da pirati in 3 capitoli.
 *  1. Il Tesoro di Capitan Banana   2. Il Fantasma del Vulcano   3. La Festa del Re delle Scimmie
 */
(() => {
  const { person, TRICORN, bandana, parrot, monkey, crab, palm, exitSign, skyGrad, glow, mushroom, label, FONT, star } = Adventure.art;

  const BARBA = { name: 'Capitan Barbagrigia', icon: '🏴‍☠️' };
  const OSTE = { name: 'Oste Gustavo', icon: '👨‍🍳' };
  const COCO = { name: 'Coco', icon: '🦜' };
  const BUBU = { name: 'Bubù', icon: '🐒' };
  const SPADA = { name: 'Spadaccina', icon: '⚔️' };
  const ME = () => ({ name: App.playerName(), icon: '🧒' });

  const barbagrigia = (x, y) => person(x, y, { coat: '#1d3557', beard: '#cfcfcf', patch: true, peg: true, hat: TRICORN, belt: true });
  const oste = (x, y) => person(x, y, { coat: '#e9c46a', apron: true, mustache: '#3d2b1f', skin: '#e8b48c' });
  const spadaccina = (x, y) => person(x, y, {
      coat: '#9d0208', skin: '#e0ac69', blush: true, belt: true, pants: '#1b1b1b', hat: bandana('#e63946'),
      hairBack: '<path d="M8 -96 Q34 -92 26 -58 Q20 -80 6 -90 Z" fill="#16161d"/>',
      extra: '<path d="M26 -36 L52 -76" stroke="#d9d9d9" stroke-width="3.5" stroke-linecap="round"/><path d="M20 -40 L32 -32" stroke="#ffd23f" stroke-width="4"/>',
    });

  Adventure.world({
    id: 'scimmie',
    title: 'L’Isola delle Scimmie',
    icon: '🐒',
    art: '🏴‍☠️🐒',
    desc: 'Sei un piccolo mozzo che sogna di diventare pirata, insieme al vecchio Capitan Barbagrigia, al pappagallo Coco e alla scimmia Bubù!',
  });

  /* ======================= CAPITOLO 1 ======================= */
  Adventure.chapter('scimmie', {
    id: 'scimmie1',
    title: 'Il Tesoro di Capitan Banana',
    icon: '🏴‍☠️',
    save: 'cg_adventure',
    start: 'molo',
    done: f => f.s_tesoro,
    items: {
      secchio: { icon: '🪣', name: 'Secchio vuoto', look: 'Un vecchio secchio di legno. Vuoto, purtroppo.' },
      acqua: { icon: '💧', name: 'Secchio d’acqua', look: 'Un secchio pieno di acqua di mare. Splish splash!' },
      banana: { icon: '🍌', name: 'Banana', look: 'Una banana gialla e profumata. Chissà a chi piacerebbe...' },
      moneta: { icon: '🪙', name: 'Moneta d’oro', look: 'Una moneta d’oro tutta lucida. Ci si può comprare qualcosa!' },
      biscotto: { icon: '🍪', name: 'Biscotto', look: 'Un biscotto croccante al cocco. Resisti, non mangiarlo!' },
      corda: { icon: '🪢', name: 'Corda', look: 'Una corda robusta da marinaio. Serve sempre!' },
      torcia: { icon: '🪵', name: 'Torcia spenta', look: 'Una torcia di legno, ma è spenta. Bisogna accenderla.' },
      fuoco: { icon: '🔥', name: 'Torcia accesa', look: 'Una torcia accesa che illumina tutto. Addio buio!' },
      chiave: { icon: '🗝️', name: 'Chiave d’oro', look: 'La chiave d’oro della Spadaccina. Apre qualcosa di importante...' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, choices, go, render } = A;
      const scenes = {
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
            (A.f.s_corda ? '' : '<ellipse cx="292" cy="150" rx="15" ry="6" fill="none" stroke="#d4a373" stroke-width="5"/><ellipse cx="292" cy="160" rx="15" ry="6" fill="none" stroke="#d4a373" stroke-width="5"/>') +
            (has('secchio') || A.f.s_acqua ? '' : '<path d="M140 200 L164 200 L160 226 L144 226 Z" fill="#8d5a32" stroke="#5a3418" stroke-width="2"/><path d="M140 200 Q152 186 164 200" stroke="#555" stroke-width="2" fill="none"/>') +
            barbagrigia(218, 236) + exitSign(300, 214, 'Spiaggia ➡'),
          spots: () => [
            { id: 'taverna', name: '🚪 Porta della taverna', x: 44, y: 112, w: 44, h: 72, go: 'taverna', look: 'La taverna “Il Grog Allegro”. Da dentro arriva un profumino di biscotti.' },
            { id: 'cartello', name: '🪧 Insegna', x: 20, y: 76, w: 90, h: 28, look: '“Il Grog Allegro – Vietato l’ingresso alle scimmie (soprattutto se ballano)”.' },
            { id: 'barba', name: '🏴‍☠️ Capitan Barbagrigia', x: 186, y: 120, w: 64, h: 120, talk: talkBarba, look: 'Il vecchio Capitan Barbagrigia. Ha più rughe di una mappa stropicciata e una gamba di legno.' },
            ...(has('secchio') || A.f.s_acqua ? [] : [{ id: 'secchio', name: '🪣 Secchio', x: 132, y: 184, w: 40, h: 46, take: () => { give('secchio'); step('secchio', 20); say(null, 'Hai preso il secchio! Ora è nel tuo zaino. 🎒'); }, look: 'Un secchio di legno abbandonato sul molo.' }]),
            ...(A.f.s_corda ? [] : [{ id: 'corda', name: '🪢 Corda', x: 270, y: 136, w: 44, h: 34, take: () => { give('corda'); step('corda', 20); say(null, 'Hai slegato la corda dal palo. Potrebbe servire per riparare qualcosa!'); }, look: 'Una corda robusta arrotolata attorno al palo.' }]),
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
            (A.f.s_torcia ? '' : '<rect x="124" y="56" width="7" height="34" fill="#8d5a32" transform="rotate(-15 127 73)"/><ellipse cx="122" cy="56" rx="7" ry="5" fill="#3d2b1f"/><rect x="118" y="78" width="16" height="5" fill="#555"/>') +
            oste(222, 196) +
            '<rect x="140" y="140" width="164" height="60" fill="#6b4423"/><rect x="136" y="134" width="172" height="10" rx="3" fill="#a0703c"/>' +
            '<ellipse cx="168" cy="134" rx="18" ry="5" fill="#ddd"/><path d="M156 130 Q162 116 170 128 M162 130 Q170 112 178 128" stroke="#ffd23f" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="176" cy="128" r="5" fill="#e63946"/>' +
            '<rect x="262" y="108" width="26" height="28" rx="5" fill="rgba(200,230,255,.6)" stroke="#999"/><rect x="260" y="104" width="30" height="6" rx="2" fill="#8d5a32"/><circle cx="270" cy="124" r="5" fill="#c47a2c"/><circle cx="280" cy="128" r="5" fill="#c47a2c"/><circle cx="275" cy="118" r="5" fill="#c47a2c"/>' +
            parrot(352, 96, A.f.s_pw) +
            '<ellipse cx="312" cy="226" rx="34" ry="8" fill="#a0703c"/><rect x="306" y="226" width="12" height="22" fill="#6b4423"/>' +
            spadaccina(266, 246) + exitSign(8, 214, '⬅ Molo'),
          spots: () => [
            { id: 'oste', name: '👨‍🍳 Oste Gustavo', x: 196, y: 96, w: 56, h: 46, talk: talkOste, look: 'Gustavo, l’oste. Ha dei baffi così grandi che ci potrebbe nascondere un panino.', use: { acqua: () => { drop('acqua'); give('banana'); step('banana', 100); dialog([[OSTE, 'Un secchio d’acqua! Finalmente posso lavare i piatti! 🍽️'], [OSTE, 'Grazie, mozzo! Tieni, prendi una banana dalla mia fruttiera. 🍌']]); }, moneta: () => { drop('moneta'); give('biscotto'); step('biscotto', 100); dialog([[OSTE, 'Una moneta d’oro! Ecco a te il biscotto al cocco più croccante dell’isola! 🍪']]); } } },
            { id: 'frutta', name: '🍌 Fruttiera', x: 148, y: 110, w: 40, h: 30, look: 'Banane, mele e un ananas un po’ triste.', take: () => (has('banana') || A.f.s_banana ? say(OSTE, 'Ne hai già avuta una, golosone!') : say(OSTE, 'Ehi! Giù le mani! Le banane si guadagnano: portami un secchio d’acqua per lavare i piatti e te ne do una.')) },
            { id: 'biscotti', name: '🍪 Barattolo dei biscotti', x: 256, y: 100, w: 38, h: 38, look: 'Biscotti al cocco! Il cartellino dice: “1 moneta d’oro”.', take: () => say(OSTE, 'I biscotti costano una moneta d’oro, mozzo!') },
            { id: 'coco', name: '🦜 Pappagallo Coco', x: 326, y: 46, w: 52, h: 60, talk: talkCoco, look: 'Coco, il pappagallo dell’oste. Sa un sacco di segreti... e adora i biscotti.', use: { biscotto: () => { drop('biscotto'); step('pw', 150); A.f.pw = true; A.save(); dialog([[COCO, 'Crà! Biscotto! Gnam gnam gnam! 🍪'], [COCO, 'Crà! Ti dico il segreto: la parola d’ordine della Grotta del Teschio è... BANANA BALLERINA! Crà!'], [null, '📝 Hai imparato la parola d’ordine: <b>BANANA BALLERINA</b>.']]); render(); } } },
            ...(A.f.s_torcia ? [] : [{ id: 'torcia', name: '🪵 Torcia sul muro', x: 108, y: 46, w: 34, h: 50, look: 'Una torcia appesa al muro. È spenta.', take: () => { give('torcia'); step('torcia', 20); say(null, 'Hai preso la torcia! Però è spenta...'); } }]),
            { id: 'camino', name: '🔥 Camino', x: 14, y: 96, w: 88, h: 104, look: 'Un camino scoppiettante. Fa un bel calduccio.', use: { torcia: () => { drop('torcia'); give('fuoco'); step('fuoco', 100); say(null, 'Fiuuum! Hai acceso la torcia nel camino. 🔥 Ora puoi andare anche nei posti più bui!'); } } },
            { id: 'spada', name: '⚔️ Spadaccina', x: 234, y: 146, w: 60, h: 100, talk: talkSpada, look: 'La Spadaccina: la piratessa campionessa di duelli di insulti. Ha una chiave d’oro appesa alla cintura.' },
            { id: 'exit', name: 'Verso il molo', x: 0, y: 204, w: 96, h: 40, go: 'molo' },
          ],
        },
        spiaggia: {
          name: '🏝️ La Spiaggia',
          draw: () => skyGrad('#6ec6ff', '#e1f5fe') + '<rect y="110" width="400" height="40" fill="#1e88e5"/><path d="M0 150 Q100 136 200 150 T400 146 L400 250 L0 250 Z" fill="#f4d58d"/>' +
            palm(270, 236, 170) + monkey(250, 82, A.f.s_moneta) + crab(118, 220) +
            '<path d="M60 236 Q66 226 72 236 Z" fill="#ff8fab"/><circle cx="330" cy="230" r="5" fill="#fff"/>' +
            exitSign(8, 214, '⬅ Molo') + exitSign(300, 214, 'Giungla ➡'),
          spots: () => [
            { id: 'scimmia', name: '🐒 Scimmia Bubù', x: 224, y: 56, w: 54, h: 68, talk: () => (A.f.s_moneta ? say(BUBU, 'Uh uh ah ah! 💃 (La scimmia balla felice con la pancia piena.)') : say(BUBU, 'Uh uh! 🐒 (La scimmia si tocca la pancia e guarda le banane... ha una fame da lupo! In mano stringe qualcosa di luccicante.)')), look: 'Bubù, la scimmia ballerina. Tiene stretta in mano una moneta d’oro!', use: { banana: () => { drop('banana'); give('moneta'); step('moneta', 100); dialog([[BUBU, 'Uh uh ah ah! 🍌 (Bubù sbuccia la banana e la mangia in un boccone!)'], [null, 'Felice, Bubù fa una piroetta e ti lancia la sua moneta d’oro! 🪙']]); render(); } } },
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
            (A.f.s_ponte
              ? '<path d="M156 150 L254 150" stroke="#5a3418" stroke-width="3"/><path d="M156 132 Q205 146 254 132" stroke="#d4a373" stroke-width="3" fill="none"/>' + Array.from({ length: 9 }, (_, i) => `<rect x="${160 + i * 10.5}" y="147" width="8" height="8" fill="#a0703c"/>`).join('')
              : '<path d="M156 150 L172 178" stroke="#5a3418" stroke-width="3"/><rect x="164" y="166" width="8" height="8" fill="#a0703c" transform="rotate(50 168 170)"/><path d="M254 150 L240 184" stroke="#5a3418" stroke-width="3"/><rect x="236" y="176" width="8" height="8" fill="#a0703c" transform="rotate(-50 240 180)"/>') +
            '<path d="M290 150 Q290 84 336 84 Q382 84 382 150 Z" fill="#2b2b2b"/><path d="M300 150 Q300 96 336 96 Q372 96 372 150 Z" fill="#111"/>' +
            '<circle cx="336" cy="72" r="13" fill="#eee"/><circle cx="331" cy="70" r="3" fill="#111"/><circle cx="341" cy="70" r="3" fill="#111"/><rect x="330" y="80" width="12" height="6" fill="#eee"/>' +
            exitSign(8, 214, '⬅ Spiaggia'),
          spots: () => [
            { id: 'ponte', name: A.f.s_ponte ? '🌉 Ponte riparato' : '🌉 Ponte rotto', x: 152, y: 128, w: 106, h: 60, look: A.f.s_ponte ? 'Il ponte è di nuovo intero. Ottimo lavoro, mozzo!' : 'Il ponte di corda è rotto! Sotto c’è un burrone profondissimo. Servirebbe qualcosa per legarlo...', use: { corda: () => { drop('corda'); step('ponte', 150); say(null, 'Hai legato la corda ai due pali: il ponte è riparato! 🌉 Ora puoi attraversarlo.'); render(); } } },
            { id: 'grotta', name: '💀 Grotta del Teschio', x: 286, y: 56, w: 100, h: 98, look: 'La Grotta del Teschio. Dentro è buio pesto... brrr!', go: () => {
              if (!A.f.s_ponte) return say(null, 'Il ponte è rotto: non posso arrivare alla grotta! Devo ripararlo in qualche modo.');
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
            (A.f.s_porta
              ? '<path d="M140 210 L140 90 Q200 30 260 90 L260 210 Z" fill="#000"/><path d="M150 210 L150 96 Q200 46 250 96 L250 210 Z" fill="#ffd23f" opacity=".25"/>'
              : '<path d="M140 210 L140 90 Q200 30 260 90 L260 210 Z" fill="#6b6b6b" stroke="#4a4a4a" stroke-width="4"/><circle cx="200" cy="112" r="34" fill="#e0e0e0"/><circle cx="187" cy="106" r="9" fill="#111"/><circle cx="213" cy="106" r="9" fill="#111"/><circle cx="187" cy="106" r="3" fill="#ff1e1e"/><circle cx="213" cy="106" r="3" fill="#ff1e1e"/><path d="M196 122 L200 116 L204 122 Z" fill="#111"/><rect x="184" y="130" width="32" height="10" fill="#fff" stroke="#111"/><path d="M192 130 L192 140 M200 130 L200 140 M208 130 L208 140" stroke="#111"/>') +
            '<rect x="58" y="80" width="6" height="30" fill="#8d5a32"/><path d="M54 80 Q61 58 68 80 Z" fill="#ff7b00"/><rect x="336" y="80" width="6" height="30" fill="#8d5a32"/><path d="M332 80 Q339 58 346 80 Z" fill="#ff7b00"/>' +
            exitSign(8, 220, '⬅ Giungla') + (A.f.s_porta ? exitSign(150, 160, 'Entra ➡') : ''),
          spots: () => [
            { id: 'porta', name: A.f.s_porta ? '🚪 Passaggio segreto' : '💀 Porta del Teschio', x: 136, y: 40, w: 128, h: 172, look: A.f.s_porta ? 'La porta è aperta! Dall’altra parte brilla qualcosa d’oro...' : 'Una porta di pietra con un teschio. Gli occhi brillano di rosso!', talk: () => (A.f.s_porta ? go('tesoro') : askPassword()), go: A.f.s_porta ? 'tesoro' : null },
            { id: 'exit', name: 'Verso la giungla', x: 0, y: 210, w: 110, h: 40, go: 'giungla' },
          ],
        },
        tesoro: {
          name: '💰 La Sala del Tesoro',
          draw: () => '<rect width="400" height="250" fill="#3a2a10"/><defs><radialGradient id="advgold" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#ffd23f" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="250" fill="url(#advgold)"/>' +
            '<rect y="210" width="400" height="40" fill="#2a1d0a"/>' +
            [[60, 200], [330, 204], [100, 214], [300, 216]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="30" ry="12" fill="#e9b200"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${x - 20 + i * 8}" cy="${y - 4 - (i % 2) * 4}" r="5" fill="#ffd23f" stroke="#c99a00"/>`).join('')).join('') +
            (A.f.s_tesoro
              ? '<rect x="156" y="160" width="88" height="50" fill="#8d5a32" stroke="#5a3418" stroke-width="3"/><path d="M156 160 L162 112 L238 112 L244 160 Z" fill="#a0703c" stroke="#5a3418" stroke-width="3"/>' + Array.from({ length: 9 }, (_, i) => `<circle cx="${166 + i * 9}" cy="${158 - (i % 3) * 4}" r="6" fill="#ffd23f" stroke="#c99a00"/>`).join('') + '<path d="M184 140 L190 124 L198 136 L204 120 L210 136 L218 124 L222 140 Z" fill="#ffd23f" stroke="#c99a00"/><circle cx="204" cy="132" r="3" fill="#e63946"/>'
              : '<rect x="156" y="150" width="88" height="60" fill="#8d5a32" stroke="#5a3418" stroke-width="3"/><path d="M156 150 Q200 118 244 150 Z" fill="#a0703c" stroke="#5a3418" stroke-width="3"/><rect x="152" y="160" width="96" height="8" fill="#ffd23f"/><rect x="192" y="158" width="16" height="20" rx="3" fill="#ffd23f" stroke="#c99a00"/><circle cx="200" cy="166" r="3" fill="#111"/>') +
            exitSign(8, 220, '⬅ Grotta'),
          spots: () => [
            { id: 'scrigno', name: '🧰 Scrigno di Capitan Banana', x: 150, y: 110, w: 100, h: 104, look: A.f.s_tesoro ? 'Il tesoro di Capitan Banana! Monete, gioielli e una corona d’oro!' : 'Lo scrigno del leggendario Capitan Banana! È chiuso con un lucchetto d’oro.', take: () => say(null, 'È chiuso a chiave! Serve una chiave d’oro...'), use: { chiave: () => { drop('chiave'); step('tesoro', 300); render(); finale(); } } },
            { id: 'oro', name: '🪙 Monete', x: 30, y: 184, w: 100, h: 40, look: 'Quante monete! Ma il vero tesoro è nello scrigno.' },
            { id: 'exit', name: 'Verso la grotta', x: 0, y: 210, w: 110, h: 40, go: 'grotta' },
          ],
        },
      };


      function talkBarba() {
        if (!A.f.s_quest) {
          dialog([
            [BARBA, `Arrr! Chi abbiamo qui? Un mozzo! Come ti chiami?`],
            [ME(), `Mi chiamo ${App.playerName()} e voglio diventare un vero pirata!`],
            [BARBA, 'Ah ah! Un vero pirata deve trovare un vero tesoro! Si dice che il tesoro di Capitan Banana sia nascosto nella Grotta del Teschio, oltre la giungla.'],
            [BARBA, 'Ma attento: la porta della grotta si apre solo con la parola d’ordine segreta... e lo scrigno solo con la chiave d’oro della Spadaccina!'],
            [BARBA, 'Comincia dalla taverna: lì si sa sempre tutto. Buona fortuna, mozzo!'],
          ], () => step('quest', 50));
        } else if (A.f.s_tesoro) {
          say(BARBA, 'Arrr! Sei un vero pirata ora!');
        } else {
          const todo = [];
          if (!A.f.s_pw) todo.push('🔑 scoprire la parola d’ordine');
          if (!has('chiave') && !A.f.s_duello) todo.push('🗝️ vincere la chiave d’oro della Spadaccina');
          if (!A.f.s_ponte) todo.push('🌉 attraversare il burrone della giungla');
          if (!has('fuoco') && !A.f.s_porta) todo.push('🔥 trovare una luce per la grotta buia');
          say(BARBA, `Ricorda, mozzo! Per il tesoro devi ancora:<br>${todo.join('<br>') || 'aprire lo scrigno nella grotta!'}`);
        }
      }

      function talkOste() {
        choices('Cosa vuoi chiedere all’oste?', [
          { label: '👋 Ciao! Cosa sai del tesoro?', fn: () => say(OSTE, 'Il tesoro di Capitan Banana? Chiedi a Coco, il mio pappagallo: lui sa tutti i segreti dell’isola! Ma parla solo se ha la pancia piena di biscotti...') },
          { label: '🍌 Posso avere una banana?', fn: () => say(OSTE, A.f.s_banana ? 'Te l’ho già data, golosone!' : 'Solo se mi porti un secchio d’acqua: devo lavare una montagna di piatti!') },
          { label: '🍪 Vorrei un biscotto', fn: () => say(OSTE, 'Un biscotto al cocco costa una moneta d’oro. Hai una moneta?') },
          { label: '👋 Ciao ciao!', fn: () => say(OSTE, 'Torna presto, mozzo!') },
        ]);
      }

      function talkCoco() {
        if (A.f.pw) say(COCO, 'Crà! La parola d’ordine è BANANA BALLERINA! Crà! Non dirlo a nessuno!');
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
        if (A.f.s_duello) return say(SPADA, 'Sei la lingua più affilata dei sette mari, mozzo! La chiave è tua, usala bene.');
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
        A.finish({
          lines: [
            [null, '✨ Con la chiave d’oro apri lo scrigno... CLIC!'],
            [null, '💰 Monete, gioielli e la corona d’oro di Capitan Banana! Hai trovato il tesoro!'],
            [BARBA, `Arrr! ${App.playerName()}, da oggi non sei più un mozzo: sei un VERO PIRATA! 🏴‍☠️`],
          ],
          title: 'Sei un vero pirata! 🏴‍☠️',
          msg: 'Hai trovato il tesoro di Capitan Banana!',
        });
      }

      function hint() {
        const f = A.f;
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

      const arrive = {
        molo: 'Sei sul molo. Il mare luccica e i gabbiani strillano.',
        taverna: 'Entri nella taverna. Profumo di biscotti e di avventura!',
        spiaggia: 'Sabbia calda e onde che fanno shhh... Su una palma c’è una scimmia!',
        giungla: 'La giungla è piena di rumori strani. Più avanti c’è un burrone e, dall’altra parte, una grotta a forma di teschio!',
        grotta: 'La torcia illumina la grotta... davanti a te c’è una porta di pietra con un teschio!',
        tesoro: 'Oro dappertutto! Al centro c’è lo scrigno di Capitan Banana!',
      };
      return { scenes, hint, arrive, welcome: `Sei sul molo, ${U.esc(App.playerName())}. Vedi quel vecchio pirata? Toccalo e parla con lui! 👆` };
    },
  });

  /* ======================= CAPITOLO 2 ======================= */
  const nonna = (x, y) => person(x, y, {
      coat: '#7b2cbf', skin: '#f1c27d', blush: true, pants: '#5a189a',
      hairBack: '<path d="M-16 -88 Q0 -110 16 -88 L16 -78 L-16 -78 Z" fill="#eee"/>',
      hat: '<path d="M-15 -92 Q0 -106 15 -92 Q0 -98 -15 -92 Z" fill="#eee"/><circle cx="0" cy="-104" r="8" fill="#eee"/>',
      extra: '<circle cx="-5" cy="-88" r="5" fill="none" stroke="#5a3418" stroke-width="1.5"/><circle cx="5" cy="-88" r="5" fill="none" stroke="#5a3418" stroke-width="1.5"/><path d="M-22 -70 Q0 -56 22 -70 L22 -62 Q0 -48 -22 -62 Z" fill="#ff6f91"/>',
    });
  const fornaio = (x, y) => person(x, y, {
      coat: '#fdfdfd', mustache: '#3d2b1f', pants: '#555', skin: '#e8b48c',
      hat: '<path d="M-14 -97 Q-22 -118 -7 -113 Q0 -126 8 -113 Q22 -118 14 -97 Z" fill="#fff" stroke="#ddd"/>',
      extra: '<path d="M-20 -60 L20 -60" stroke="#e63946" stroke-width="3"/>',
    });
  const guardiano = (x, y, glasses) => person(x, y, {
      coat: '#1d3557', beard: '#8d5a32', skin: '#f1c27d',
      hat: '<path d="M-16 -95 Q0 -112 16 -95 Z" fill="#1d3557"/><rect x="-18" y="-97" width="30" height="4" fill="#111"/>',
      extra: glasses ? '<circle cx="-5" cy="-88" r="5" fill="rgba(255,255,255,.3)" stroke="#111" stroke-width="1.6"/><circle cx="5" cy="-88" r="5" fill="rgba(255,255,255,.3)" stroke="#111" stroke-width="1.6"/>' : '<text x="16" y="-102" font-size="18" font-weight="900" fill="#ffd23f">?</text>',
    });
  const gull = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-6 -4 Q-22 -24 -28 -8 Z" fill="#cfd8dc"/><ellipse rx="14" ry="9" fill="#fff"/><circle cx="12" cy="-8" r="6.5" fill="#fff"/><path d="M17 -9 L27 -6 L17 -4 Z" fill="#ffb703"/><circle cx="13" cy="-9.5" r="1.5" fill="#111"/><path d="M-4 8 L-4 14 M4 8 L4 14" stroke="#ffb703" stroke-width="2"/></g>`;
  const ghost = (x, y, nice) => `<g transform="translate(${x} ${y})">
      <path d="M-34 0 Q-38 -84 0 -94 Q38 -84 34 0 L23 -12 L12 0 L0 -12 L-12 0 L-23 -12 Z" fill="#e8f4ff" opacity=".9" stroke="#a9c7e8" stroke-width="2"/>
      <path d="M-30 -86 Q0 -116 30 -86 Q14 -94 0 -92 Q-14 -94 -30 -86 Z" fill="#1b1b1b"/>
      ${nice
        ? '<path d="M-17 -62 Q-11 -68 -5 -62 M5 -62 Q11 -68 17 -62" stroke="#1d3557" stroke-width="3" fill="none"/><path d="M-12 -44 Q0 -30 12 -44 Z" fill="#ff6f91"/><circle cx="-20" cy="-50" r="5" fill="#ff8fab" opacity=".6"/><circle cx="20" cy="-50" r="5" fill="#ff8fab" opacity=".6"/>'
        : '<path d="M-20 -72 L-6 -66 M20 -72 L6 -66" stroke="#1d3557" stroke-width="3"/><ellipse cx="-11" cy="-60" rx="5" ry="7" fill="#1d3557"/><ellipse cx="11" cy="-60" rx="5" ry="7" fill="#1d3557"/><ellipse cx="0" cy="-38" rx="10" ry="8" fill="#1d3557"/>'}
      <path d="M-34 -40 Q-50 -50 -46 -64 M34 -40 Q50 -50 46 -64" stroke="#e8f4ff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/></g>`;

  const NONNA = { name: 'Nonna Mirtilla', icon: '👵' };
  const PINO = { name: 'Fornaio Pino', icon: '👨‍🍳' };
  const FAUSTO = { name: 'Guardiano Fausto', icon: '🧔' };
  const GULL = { name: 'Gabbiano Gigi', icon: '🐦' };
  const BRONTO = { name: 'Capitan Brontolo', icon: '👻' };

  Adventure.chapter('scimmie', {
    id: 'scimmie2',
    title: 'Il Fantasma del Vulcano',
    icon: '👻',
    save: 'cg_adventure2',
    start: 'approdo',
    done: f => f.s_coco,
    items: {
      messaggio: { icon: '📜', name: 'Messaggio', look: 'C’è scritto: «Se il lucchetto vuoi aprire, la nave devi osservare: conta le <b>VELE</b>, poi i <b>CANNONI</b> e alla fine i <b>TESCHI</b>. — Capitan Banana»' },
      barattolo: { icon: '🫙', name: 'Bottiglia vuota', look: 'Una bottiglia di vetro vuota, con il tappo. Ci si può mettere dentro qualcosa di piccolo.' },
      conchiglia: { icon: '🐚', name: 'Conchiglia luccicante', look: 'Una conchiglia che brilla come l’arcobaleno. A qualcuno piaceranno le cose luccicanti...' },
      occhiali: { icon: '👓', name: 'Occhiali', look: 'Un paio di occhiali spessi spessi. Qualcuno li avrà persi.' },
      mattarello: { icon: '🥢', name: 'Mattarello', look: 'Un mattarello da cucina, tutto infarinato.' },
      lucciola: { icon: '✨', name: 'Lucciola in bottiglia', look: 'Una lucciola che brilla dentro la bottiglia. Che bella luce!' },
      piuma: { icon: '🪶', name: 'Piuma d’oro', look: 'Una piuma d’oro: è il primo ingrediente magico!' },
      guanti: { icon: '🧤', name: 'Guanti da forno', look: 'Guanti spessi per toccare le cose bollenti.' },
      peperoncino: { icon: '🌶️', name: 'Peperoncino del vulcano', look: 'Un peperoncino così piccante che fuma!' },
      remo: { icon: '🛶', name: 'Remo', look: 'Il remo della barca di Barbagrigia.' },
      pozione: { icon: '🧪', name: 'Pozione anti-fantasma', look: 'Una pozione verde che fa le bollicine. I fantasmi la odiano... o forse no?' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, choices, go, render } = A;
      const scenes = {
        approdo: {
          name: '🌋 Spiaggia del Vulcano',
          draw: () => skyGrad('#ff9a5a', '#ffe0b2') +
            '<path d="M250 130 L320 30 L340 30 L410 130 Z" fill="#6b4a3a"/><path d="M318 32 Q330 10 342 32 Z" fill="#ff5e1a"/><circle cx="326" cy="14" r="10" fill="#9e9e9e" opacity=".6"/><circle cx="340" cy="2" r="13" fill="#9e9e9e" opacity=".5"/>' +
            '<rect y="120" width="400" height="50" fill="#1e88e5"/><path d="M0 160 Q100 146 200 160 T400 156 L400 250 L0 250 Z" fill="#f4d58d"/>' +
            '<path d="M24 172 L124 172 L112 196 L36 196 Z" fill="#8d5a32" stroke="#5a3418" stroke-width="2"/>' + (A.f.s_barca ? '<path d="M110 168 L140 140" stroke="#a0703c" stroke-width="4"/>' : '') +
            barbagrigia(176, 238) +
            (has('barattolo') || has('messaggio') || A.f.s_bottiglia ? '' : '<g transform="rotate(-20 236 222)"><rect x="226" y="214" width="26" height="12" rx="5" fill="rgba(160,220,200,.75)" stroke="#2a9d8f"/><rect x="250" y="217" width="7" height="6" fill="#8d5a32"/><rect x="230" y="217" width="14" height="5" fill="#fff3e0"/></g>') +
            (A.f.s_conchiglia ? '' : '<path d="M296 236 Q306 214 316 236 Z" fill="#ff8fd8" stroke="#c084fc" stroke-width="2"/><path d="M300 236 L306 222 M306 236 L306 220 M312 236 L306 222" stroke="#fff" stroke-width="1.2"/><circle cx="318" cy="218" r="2" fill="#fff"/>') +
            exitSign(296, 196, 'Villaggio ➡'),
          spots: () => [
            { id: 'barba', name: '🏴‍☠️ Capitan Barbagrigia', x: 144, y: 122, w: 64, h: 120, talk: talkBarba2, look: 'Barbagrigia guarda il mare preoccupato. Gli manca il suo amico Coco...' },
            { id: 'barca', name: '🚣 Barca', x: 18, y: 150, w: 112, h: 52, look: A.f.s_barca ? 'La barca è pronta! Si va alla nave fantasma.' : 'La barca di Barbagrigia. Senza remo non si va da nessuna parte!', go: A.f.s_barca ? () => go('nave') : null, use: { remo: () => { drop('remo'); step('barca', 100); dialog([[BARBA, 'Il mio remo! Bravo mozzo! Salta a bordo: si va alla nave fantasma! ⛵']], () => go('nave')); } } },
            ...(has('barattolo') || has('messaggio') || A.f.s_bottiglia ? [] : [{ id: 'bottiglia', name: '🍾 Bottiglia', x: 220, y: 204, w: 44, h: 32, look: 'Una bottiglia portata dal mare. Dentro c’è un foglietto!', take: () => { give('messaggio'); give('barattolo'); step('bottiglia', 50); say(null, 'Hai aperto la bottiglia: dentro c’era un <b>messaggio</b>! 📜 Ora hai anche una bottiglia vuota. (Tocca due volte il messaggio nello zaino per leggerlo.)'); render(); } }]),
            ...(A.f.s_conchiglia ? [] : [{ id: 'conchiglia', name: '🐚 Conchiglia', x: 288, y: 208, w: 40, h: 34, look: 'Una conchiglia che luccica come l’arcobaleno!', take: () => { give('conchiglia'); step('conchiglia', 20); say(null, 'Hai preso la conchiglia luccicante! ✨'); render(); } }]),
            { id: 'vulcano', name: '🌋 Vulcano', x: 252, y: 0, w: 148, h: 120, look: 'Il vulcano fuma come la pentola della nonna. Dietro, dicono, c’è la nave fantasma...' },
            { id: 'exit', name: 'Verso il villaggio', x: 292, y: 186, w: 108, h: 40, go: 'villaggio' },
          ],
        },
        villaggio: {
          name: '🏘️ Il Villaggio',
          draw: () => skyGrad('#8fd3ff', '#e1f5fe') + '<rect y="170" width="400" height="80" fill="#c8a165"/>' +
            '<path d="M8 90 L80 40 L152 90 Z" fill="#5a189a"/><rect x="18" y="90" width="124" height="90" fill="#d4b5f5"/><rect x="62" y="122" width="34" height="58" rx="16" fill="#7b2cbf"/><circle cx="40" cy="116" r="10" fill="#fff3a3"/>' +
            '<path d="M250 90 L322 44 L394 90 Z" fill="#8d5a32"/><rect x="258" y="90" width="128" height="90" fill="#ffe8d6"/><rect x="306" y="124" width="32" height="56" fill="#a0703c"/>' +
            `<rect x="270" y="98" width="104" height="20" rx="4" fill="#a0703c"/><text x="322" y="113" font-size="11" font-weight="800" fill="#fff" text-anchor="middle" ${FONT}>🥖 FORNO DI PINO</text>` +
            '<rect x="196" y="96" width="6" height="80" fill="#5a3418"/>' + `<rect x="168" y="96" width="62" height="20" rx="4" fill="#fff"/><text x="199" y="111" font-size="11" font-weight="800" fill="#1d3557" text-anchor="middle" ${FONT}>⬆ FARO</text>` +
            nonna(110, 238) + fornaio(262, 238) + exitSign(8, 216, '⬅ Spiaggia') + exitSign(304, 216, 'Foresta ➡'),
          spots: () => [
            { id: 'nonna', name: '👵 Nonna Mirtilla', x: 80, y: 136, w: 60, h: 106, talk: talkNonna, look: 'Nonna Mirtilla, la saggia dell’isola. Sa fare pozioni per ogni cosa, anche per il singhiozzo!', use: { piuma: () => ingredient('piuma'), peperoncino: () => ingredient('peperoncino'), lucciola: () => ingredient('lucciola') } },
            { id: 'pino', name: '👨‍🍳 Fornaio Pino', x: 232, y: 136, w: 60, h: 106, talk: () => (A.f.s_guanti ? say(PINO, 'Grazie ancora per il mattarello! Il pane profuma già! 🥖') : say(PINO, 'Che disastro! Ho perso il mio mattarello nella foresta dei funghi... Senza non posso fare il pane! 😭')), look: 'Pino il fornaio. È tutto infarinato, perfino i baffi.', use: { mattarello: () => { drop('mattarello'); give('guanti'); step('guanti', 100); dialog([[PINO, 'Il mio mattarello! Evviva, stasera si mangia pane! 🥖'], [PINO, 'Tieni, ti regalo i miei guanti da forno: con questi puoi toccare anche le cose bollenti! 🧤']]); } } },
            { id: 'faro', name: '🗼 Sentiero del faro', x: 166, y: 92, w: 66, h: 84, go: 'faro', look: 'Un cartello: “Faro”. Il sentiero sale verso la scogliera.' },
            { id: 'casa', name: '🏠 Casa della Nonna', x: 18, y: 50, w: 130, h: 70, look: 'La casetta viola di Nonna Mirtilla. Dal camino escono bollicine colorate!' },
            { id: 'exitL', name: 'Verso la spiaggia', x: 0, y: 206, w: 112, h: 40, go: 'approdo' },
            { id: 'exitR', name: 'Verso la foresta', x: 300, y: 206, w: 100, h: 40, go: 'foresta' },
          ],
        },
        foresta: {
          name: '🍄 La Foresta dei Funghi',
          draw: () => skyGrad('#1b4332', '#2d6a4f') + '<rect y="190" width="400" height="60" fill="#1b4332"/>' +
            [[40, 70], [150, 50], [360, 60]].map(([x, h]) => `<rect x="${x}" y="${120 - h}" width="14" height="${h + 80}" fill="#3e2a1a"/><circle cx="${x + 7}" cy="${120 - h}" r="34" fill="#2d6a4f"/>`).join('') +
            mushroom(90, 200, 1.6, '#e63946') + mushroom(200, 214, 1, '#ff9f1c') + mushroom(160, 230, 0.7, '#c084fc') +
            (A.f.s_occhiali ? '' : '<g transform="translate(90 112)"><circle cx="-8" cy="0" r="7" fill="rgba(255,255,255,.3)" stroke="#111" stroke-width="2"/><circle cx="8" cy="0" r="7" fill="rgba(255,255,255,.3)" stroke="#111" stroke-width="2"/><path d="M-1 0 L1 0" stroke="#111" stroke-width="2"/></g>') +
            '<path d="M246 236 Q256 216 276 230 Q290 214 300 236 Z" fill="#3e2a1a"/>' +
            (A.f.s_mattarello ? '' : '<g transform="rotate(-25 270 222)"><rect x="252" y="218" width="40" height="8" rx="4" fill="#e9c69a"/><rect x="244" y="220" width="10" height="4" rx="2" fill="#a0703c"/><rect x="290" y="220" width="10" height="4" rx="2" fill="#a0703c"/></g>') +
            (A.f.s_lucciola ? '' : Array.from({ length: 9 }, (_, i) => `<circle cx="${300 + (i * 23) % 70}" cy="${70 + (i * 17) % 60}" r="4" fill="#fff59d"/><circle cx="${300 + (i * 23) % 70}" cy="${70 + (i * 17) % 60}" r="9" fill="#fff59d" opacity=".25"/>`).join('')) +
            exitSign(8, 216, '⬅ Villaggio') + exitSign(304, 216, 'Vulcano ➡'),
          spots: () => [
            ...(A.f.s_occhiali ? [] : [{ id: 'occhiali', name: '👓 Occhiali sul fungo', x: 66, y: 96, w: 50, h: 32, look: 'Sopra il fungo rosso ci sono un paio di occhiali spessi spessi!', take: () => { give('occhiali'); step('occhiali', 20); say(null, 'Hai preso gli occhiali! Di chi saranno? 👓'); render(); } }]),
            ...(A.f.s_mattarello ? [] : [{ id: 'mattarello', name: '🥢 Mattarello', x: 240, y: 204, w: 64, h: 36, look: 'Tra le radici c’è un mattarello tutto infarinato. Chi l’avrà perso?', take: () => { give('mattarello'); step('mattarello', 20); say(null, 'Hai preso il mattarello!'); render(); } }]),
            { id: 'lucciole', name: '✨ Lucciole', x: 290, y: 56, w: 90, h: 84, look: A.f.s_lucciola ? 'Le lucciole ti salutano lampeggiando.' : 'Tante lucciole che brillano nel buio della foresta. Che magia!', take: () => say(null, 'Le lucciole volano via quando provi a prenderle con le mani! Ci vorrebbe un contenitore...'), use: { barattolo: () => { drop('barattolo'); give('lucciola'); step('lucciola', 100); say(null, 'Hai avvicinato la bottiglia e una lucciola ci è entrata dentro! ✨ Che bella luce!'); render(); } } },
            { id: 'funghi', name: '🍄 Funghi giganti', x: 136, y: 184, w: 100, h: 50, look: 'Funghi grandi come ombrelli! Meglio non mangiarli.' },
            { id: 'exitL', name: 'Verso il villaggio', x: 0, y: 206, w: 112, h: 40, go: 'villaggio' },
            { id: 'exitR', name: 'Verso il vulcano', x: 300, y: 206, w: 100, h: 40, go: 'vulcano' },
          ],
        },
        faro: {
          name: '🗼 Il Faro',
          draw: () => skyGrad('#4fc3f7', '#e1f5fe') + '<rect y="150" width="400" height="100" fill="#1e88e5"/><path d="M180 250 L180 150 Q260 130 400 150 L400 250 Z" fill="#8d8d8d"/>' +
            '<path d="M246 160 L256 40 L290 40 L300 160 Z" fill="#fff"/>' + [60, 90, 120].map(y => `<path d="M${253 - (y - 40) * 0.08} ${y} L${293 + (y - 40) * 0.08} ${y} L${294 + (y - 40) * 0.09} ${y + 14} L${252 - (y - 40) * 0.09} ${y + 14} Z" fill="#e63946"/>`).join('') +
            '<rect x="250" y="24" width="46" height="18" fill="#ffd23f" stroke="#555" stroke-width="2"/><path d="M246 24 L273 6 L300 24 Z" fill="#e63946"/><rect x="242" y="40" width="62" height="4" fill="#555"/>' +
            '<path d="M0 250 L0 190 Q90 176 180 190 L180 250 Z" fill="#a1887f"/>' +
            (A.f.s_piuma ? gull(330, 120) : gull(296, 34)) + guardiano(110, 240, A.f.s_remo) + exitSign(8, 218, '⬅ Villaggio'),
          spots: () => [
            { id: 'fausto', name: '🧔 Guardiano Fausto', x: 78, y: 130, w: 64, h: 112, talk: () => (A.f.s_remo ? say(FAUSTO, 'Ci vedo benissimo! Laggiù, oltre il vulcano... vedo una nave che brilla di verde. È la nave fantasma! Brrr! 👻') : say(FAUSTO, 'Eh? Chi è là? Senza i miei occhiali non vedo un granché! Li ho persi passeggiando nella foresta dei funghi... 🍄')), look: 'Fausto, il guardiano del faro. Strizza gli occhi... gli mancano gli occhiali!', use: { occhiali: () => { drop('occhiali'); give('remo'); step('remo', 100); dialog([[FAUSTO, 'I miei occhiali! Ora ci vedo di nuovo! 👓'], [FAUSTO, 'Ehi, ma tu sei il mozzo di Barbagrigia! Ha lasciato qui il suo remo l’altra volta: riportaglielo tu! 🛶']]); render(); } } },
            { id: 'gigi', name: '🐦 Gabbiano Gigi', x: A.f.s_piuma ? 300 : 266, y: A.f.s_piuma ? 96 : 10, w: 60, h: 44, talk: () => say(GULL, A.f.s_piuma ? 'Squaaak! La mia conchiglia! Bella bella bella! 🐚' : 'Squaaak! Luccica? Hai qualcosa che luccica? Squaaak! (Gigi adora le cose luccicanti. Sulla coda ha una piuma d’oro!)'), look: 'Gigi, il gabbiano del faro. Ha una piuma d’oro sulla coda!', use: { conchiglia: () => { drop('conchiglia'); give('piuma'); step('piuma', 100); dialog([[GULL, 'Squaaak! Che bella conchiglia luccicante! È mia, è mia!'], [null, 'Gigi è così contento che si scuote tutto... e gli cade la piuma d’oro! Tu la raccogli. 🪶']]); render(); } } },
            { id: 'faroT', name: '🗼 Faro', x: 240, y: 46, w: 66, h: 112, look: 'Un faro bianco e rosso. Di notte guida le navi... e forse anche i fantasmi.' },
            { id: 'exit', name: 'Verso il villaggio', x: 0, y: 208, w: 120, h: 40, go: 'villaggio' },
          ],
        },
        vulcano: {
          name: '🌋 Il Vulcano',
          draw: () => skyGrad('#5a1d1d', '#ff7b00') + '<path d="M60 250 L170 40 L230 40 L340 250 Z" fill="#4a2c22"/><path d="M168 42 Q200 10 232 42 Z" fill="#ff5e1a"/>' +
            '<path d="M196 44 Q186 120 214 170 Q236 210 220 250 L250 250 Q262 200 238 160 Q214 120 206 44 Z" fill="#ff5e1a"/><path d="M200 60 Q194 120 218 170" stroke="#ffd23f" stroke-width="3" fill="none"/>' +
            '<rect y="220" width="400" height="30" fill="#2b1a14"/>' +
            (A.f.s_peperoncino ? '<ellipse cx="300" cy="218" rx="26" ry="12" fill="#2d6a4f"/>' : '<ellipse cx="300" cy="214" rx="28" ry="16" fill="#2d6a4f"/><path d="M290 206 Q284 222 292 228 Q296 214 290 206 Z M306 202 Q302 220 310 226 Q314 210 306 202 Z" fill="#e63946"/><path d="M300 194 Q304 186 300 180 M312 190 Q316 182 312 176" stroke="#bbb" stroke-width="2" fill="none" opacity=".7"/>') +
            exitSign(8, 196, '⬅ Foresta'),
          spots: () => [
            ...(A.f.s_peperoncino ? [] : [{ id: 'pepe', name: '🌶️ Peperoncino del vulcano', x: 264, y: 176, w: 72, h: 56, look: 'Un cespuglio di peperoncini che fumano per il calore del vulcano!', take: () => { Sound.bad(); say(null, 'AHIA! Scotta come la lava! 🔥 Mi servirebbe qualcosa per proteggere le mani...'); }, use: { guanti: () => { drop('guanti'); give('peperoncino'); step('peperoncino', 100); say(null, 'Con i guanti da forno hai raccolto il peperoncino bollente! 🌶️ Ora ce l’hai!'); render(); } } }]),
            { id: 'lava', name: '🔥 Lava', x: 186, y: 44, w: 70, h: 176, look: 'Un fiume di lava arancione. Non avvicinarti troppo!', take: () => say(null, 'Prendere la lava?! Neanche per sogno! 😱') },
            { id: 'exit', name: 'Verso la foresta', x: 0, y: 186, w: 112, h: 40, go: 'foresta' },
          ],
        },
        nave: {
          name: '👻 La Nave Fantasma',
          draw: () => skyGrad('#0b132b', '#1c2541') + '<circle cx="340" cy="40" r="20" fill="#e8f4ff"/>' +
            Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 61) % 400}" cy="${(i * 37) % 100 + 6}" r="1.5" fill="#fff"/>`).join('') +
            '<rect x="0" y="176" width="400" height="74" fill="#3b2f4a"/>' + Array.from({ length: 10 }, (_, i) => `<path d="M${i * 44} 176 L${i * 44} 250" stroke="#2b2238" stroke-width="2"/>`).join('') +
            '<rect x="0" y="150" width="400" height="26" fill="#4a3b5c"/>' +
            [34, 92, 228, 280].map(x => `<circle cx="${x}" cy="163" r="9" fill="#111"/><rect x="${x - 4}" y="${159}" width="22" height="8" fill="#222"/>`).join('') +
            [[60, 'M60 150 L60 20'], [210, 'M210 150 L210 30']].map(([x, d]) => `<path d="${d}" stroke="#5a3418" stroke-width="5"/><path d="M${x + 3} 40 Q${x + 50} 70 ${x + 3} 110 Z" fill="#cfe8d6" opacity=".75"/>`).join('') +
            [[60, 50], [210, 36], [366, 150]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="0" y="-4" width="26" height="18" fill="#111"/><circle cx="13" cy="4" r="5" fill="#fff"/><circle cx="11" cy="3" r="1.2" fill="#111"/><circle cx="15" cy="3" r="1.2" fill="#111"/><rect x="10" y="8" width="6" height="2" fill="#fff"/></g>`).join('') +
            (A.f.s_coco
              ? parrot(330, 156, true)
              : '<rect x="300" y="86" width="56" height="70" rx="6" fill="none" stroke="#c99a00" stroke-width="3"/>' + parrot(328, 150, false) + Array.from({ length: 6 }, (_, i) => `<path d="M${304 + i * 10} 86 L${304 + i * 10} 156" stroke="#c99a00" stroke-width="2"/>`).join('') + '<rect x="318" y="140" width="20" height="16" rx="3" fill="#ffd23f" stroke="#c99a00"/><circle cx="328" cy="148" r="2.5" fill="#111"/>') +
            ghost(170, 230, A.f.s_fantasma) + exitSign(8, 222, '⬅ Barca'),
          spots: () => [
            { id: 'fantasma', name: '👻 Capitan Brontolo', x: 130, y: 128, w: 80, h: 104, talk: talkGhost, look: A.f.s_fantasma ? 'Capitan Brontolo sorride. Non fa più paura a nessuno!' : 'Il terribile fantasma Capitan Brontolo! È trasparente e fa BUUU!', use: { pozione: () => { drop('pozione'); step('fantasma', 200); render(); dialog([[null, 'Lanci la pozione anti-fantasma... SPLASH! 🧪'], [BRONTO, 'Etciù! Etciùùù! Ah ah ah! Mi fa il solletico! Basta, basta! 😆'], [BRONTO, 'Va bene, va bene... Scusate. Ho rapito Coco perché mi sentivo tanto solo. Volevo solo qualcuno con cui chiacchierare... 😢'], [BRONTO, 'Il pappagallo è nella gabbia, ma il lucchetto ha un codice segreto... e io l’ho dimenticato! Forse qualcuno ha lasciato un indizio...']]); } } },
            { id: 'gabbia', name: A.f.s_coco ? '🦜 Coco' : '🔒 Gabbia di Coco', x: 296, y: 46, w: 64, h: 114, look: A.f.s_coco ? 'Coco è libero e saltella felice!' : 'Coco è chiuso in una gabbia d’oro con un lucchetto a combinazione: 3 rotelle con i numeri.', talk: () => say(COCO, A.f.s_coco ? 'Crà! Grazie mozzo! Crà!' : 'Crà! Aiuto! Fammi uscire! Crà! Il codice... il codice è nella nave! Crà!'), take: () => (A.f.s_fantasma ? openCage() : say(BRONTO, 'BUUUU! Giù le mani dalla gabbia! Questo pappagallo è mio! 👻')) },
            { id: 'vele', name: '⛵ Vele', x: 60, y: 30, w: 210, h: 90, look: 'Le vele della nave fantasma, sottili come lenzuola. Quante sono? Contale bene!' },
            { id: 'cannoni', name: '💣 Cannoni', x: 20, y: 150, w: 290, h: 26, look: 'I cannoni della nave, tutti in fila. Quanti sono?' },
            { id: 'exit', name: 'Torna alla barca', x: 0, y: 212, w: 100, h: 38, go: 'approdo' },
          ],
        },
      };

      function talkBarba2() {
        if (!A.f.s_q2) {
          dialog([
            [BARBA, `Arrr! ${App.playerName()}, che brutta notizia: il fantasma Capitan Brontolo ha rapito Coco, il pappagallo! 🦜`],
            [BARBA, 'L’ha portato sulla sua nave fantasma, che si nasconde dietro il vulcano.'],
            [BARBA, 'I fantasmi hanno paura di una cosa sola: la Pozione Anti-Fantasma di Nonna Mirtilla. Vai al villaggio a chiederle aiuto!'],
            [BARBA, 'E per raggiungere la nave serve la mia barca... ma ho perso il remo! Forse il guardiano del faro sa dov’è.'],
          ], () => step('q2', 50));
        } else if (A.f.s_coco) {
          say(BARBA, 'Coco è salvo! Sei il pirata più coraggioso dei sette mari!');
        } else {
          const todo = [];
          if (!A.f.s_pozione) todo.push('🧪 farti preparare la pozione da Nonna Mirtilla');
          if (!A.f.s_barca) todo.push('🛶 ritrovare il mio remo');
          todo.push('🦜 liberare Coco dalla nave fantasma');
          say(BARBA, `Forza, mozzo! Devi ancora:<br>${todo.join('<br>')}`);
        }
      }

      const ING = { piuma: 'una 🪶 piuma d’oro', peperoncino: 'un 🌶️ peperoncino del vulcano', lucciola: 'una ✨ lucciola luminosa' };
      function talkNonna() {
        if (A.f.s_pozione) return say(NONNA, 'Usa bene la pozione, tesoro! E salutami Coco! 💜');
        if (!A.f.s_nonna) {
          return dialog([
            [NONNA, 'Ciao tesoro! Una pozione anti-fantasma? Ma certo, la so fare a occhi chiusi! 🧪'],
            [NONNA, 'Però mi servono 3 ingredienti magici: una 🪶 <b>piuma d’oro</b>, un 🌶️ <b>peperoncino del vulcano</b> e una ✨ <b>lucciola luminosa</b>.'],
            [NONNA, 'Portameli e ti preparo la pozione più potente dell’isola!'],
          ], () => step('nonna', 50));
        }
        const missing = Object.keys(ING).filter(k => !A.f['ing_' + k]).map(k => ING[k]);
        say(NONNA, `Mi mancano ancora: ${missing.join(', ')}. Portameli, tesoro!`);
      }
      function ingredient(k) {
        drop(k);
        A.f['ing_' + k] = true;
        step('ing_' + k, 50);
        const missing = Object.keys(ING).filter(x => !A.f['ing_' + x]);
        if (missing.length) return say(NONNA, `Oh, ${ING[k]}! Perfetto! Mi mancano ancora: ${missing.map(x => ING[x]).join(', ')}.`);
        give('pozione');
        step('pozione', 150);
        dialog([[NONNA, `Ecco l’ultimo ingrediente! Ora mescolo... una piuma, un peperoncino, una lucciola... BLUB BLUB! 🧪✨`], [NONNA, 'Ecco la Pozione Anti-Fantasma! Lanciala al fantasma e vedrai cosa succede! 💚']]);
      }

      function talkGhost() {
        if (A.f.s_coco) return say(BRONTO, 'Grazie per avermi fatto ridere, mozzo! Ora Coco mi viene a trovare tutti i giorni! 👻💚');
        if (A.f.s_fantasma) return say(BRONTO, 'Il lucchetto, il lucchetto... il codice era scritto da qualche parte. Uffa, non ho memoria! Sarà l’età: ho 300 anni!');
        say(BRONTO, 'BUUUUU! Sono il terribile Capitan Brontolo! Questo pappagallo ora è mio! Andatevene, o vi faccio... BUUU! 👻');
      }

      function openCage() {
        A.lock({
          text: 'Il lucchetto della gabbia ha 3 rotelle con i numeri. Scegli la combinazione giusta:',
          code: [2, 4, 3],
          ok: () => { step('coco', 300); render(); finale2(); },
          fail: 'Clic... il lucchetto non si apre! Prova un altro codice. Chissà se c’è un indizio da qualche parte...',
          leave: 'Il lucchetto resta chiuso. Coco ti guarda speranzoso.',
        });
      }

      function finale2() {
        A.finish({
          lines: [
            [null, '🔓 CLIC! Il lucchetto si apre!'],
            [COCO, 'Crà! Libero! Libero! Grazie mozzo! Crà! 🦜💚'],
            [BRONTO, 'Che bello... Coco, verresti qualche volta a chiacchierare con me?'],
            [COCO, 'Crà! Certo! Ma solo se ci sono i biscotti! Crà!'],
            [BARBA, `Arrr! ${App.playerName()}, hai salvato Coco e hai trasformato un fantasma brontolone in un amico. Sei un pirata leggendario! 🏴‍☠️`],
          ],
          title: 'Pirata leggendario! 🏴‍☠️👻',
          msg: 'Hai liberato Coco e fatto amicizia con il fantasma!',
        });
      }

      function hint() {
        const f = A.f;
        if (!f.s_q2) return 'Parla con Capitan Barbagrigia sulla spiaggia.';
        if (!f.s_nonna) return 'Vai al villaggio e parla con Nonna Mirtilla.';
        if (!f.s_bottiglia) return 'Sulla spiaggia c’è una bottiglia portata dal mare: prendila!';
        if (!f.ing_lucciola) return has('lucciola') ? 'Dai la lucciola a Nonna Mirtilla.' : 'Nella foresta ci sono le lucciole: seleziona la bottiglia vuota e tocca le lucciole.';
        if (!f.ing_piuma) {
          if (has('piuma')) return 'Dai la piuma d’oro a Nonna Mirtilla.';
          if (!f.s_conchiglia) return 'Sulla spiaggia c’è una conchiglia luccicante: prendila.';
          return 'Al faro c’è il gabbiano Gigi che adora le cose luccicanti: dagli la conchiglia.';
        }
        if (!f.ing_peperoncino) {
          if (has('peperoncino')) return 'Dai il peperoncino a Nonna Mirtilla.';
          if (has('guanti')) return 'Vai al vulcano e usa i guanti da forno con il peperoncino.';
          if (!f.s_mattarello) return 'Nella foresta, tra le radici, c’è il mattarello del fornaio: prendilo.';
          return 'Riporta il mattarello al fornaio Pino nel villaggio.';
        }
        if (!f.s_barca) {
          if (has('remo')) return 'Seleziona il remo e tocca la barca sulla spiaggia.';
          if (!f.s_occhiali) return 'Nella foresta, sopra il fungo rosso, ci sono degli occhiali: prendili.';
          return 'Dai gli occhiali al guardiano del faro.';
        }
        if (!f.s_fantasma) return 'Sulla nave seleziona la pozione e tocca il fantasma Capitan Brontolo.';
        return 'Leggi il messaggio della bottiglia (tocca due volte il messaggio nello zaino): conta le vele, poi i cannoni, poi i teschi della nave. Poi tocca la gabbia e scegli Prendi.';
      }

      const arrive = {
        approdo: 'La spiaggia ai piedi del vulcano. La sabbia è nera e calda!',
        villaggio: 'Un villaggio con case colorate. Si sente profumo di pane e di magia.',
        foresta: 'Una foresta di funghi giganti. Al buio brillano tante lucine...',
        faro: 'In cima alla scogliera c’è un faro bianco e rosso. Il vento soffia forte!',
        vulcano: 'Fa un caldo bollente! Il vulcano brontola come un drago addormentato.',
        nave: 'Sei salito sulla nave fantasma... tutto è verde e trasparente. Brrr! 👻',
      };
      return { scenes, hint, arrive, welcome: `Capitolo 2: il fantasma del vulcano! 👻 Sei sulla spiaggia, ${U.esc(App.playerName())}. Barbagrigia sembra preoccupato: toccalo e parla con lui! 👆` };
    },
  });

  /* ======================= CAPITOLO 3 ======================= */
  const TITO = { name: 'Tito il Tamburaio', icon: '🥁' };
  const LOLA = { name: 'Cuoca Lola', icon: '👩‍🍳' };
  const MARINA = { name: 'Sirena Marina', icon: '🧜‍♀️' };
  const RE = { name: 'Re Bananone', icon: '👑' };
  const tito = (x, y) => person(x, y, { coat: '#2a9d8f', skin: '#c68642', pants: '#264653', hat: bandana('#ffd23f'), extra: '<ellipse cx="0" cy="-30" rx="18" ry="8" fill="#e63946" stroke="#9d0208"/><rect x="-18" y="-30" width="36" height="22" fill="#e63946"/><ellipse cx="0" cy="-8" rx="18" ry="6" fill="#9d0208"/><path d="M-12 -28 L12 -10 M12 -28 L-12 -10" stroke="#ffd23f" stroke-width="2"/>' });
  const lola = (x, y) => person(x, y, { coat: '#ff8fab', apron: true, skin: '#e0ac69', blush: true, hat: '<path d="M-14 -97 Q-22 -118 -7 -113 Q0 -126 8 -113 Q22 -118 14 -97 Z" fill="#fff" stroke="#ddd"/>', hairBack: '<path d="M-16 -88 Q-20 -64 -12 -60 L12 -60 Q20 -64 16 -88 Z" fill="#5a3418"/>' });
  const mermaid = (x, y) => `<g transform="translate(${x} ${y})">
    <path d="M-6 -10 Q-30 10 -14 34 Q-4 40 6 30 Q10 20 0 10 Z" fill="#2ec4b6" stroke="#138a80" stroke-width="2"/><path d="M-14 34 L-30 46 L-6 42 L2 50 L6 30 Z" fill="#2ec4b6" stroke="#138a80" stroke-width="2"/>
    <path d="M-14 -46 Q-16 -8 -6 -10 L10 -10 Q16 -30 10 -46 Z" fill="#f4c7a1"/><path d="M-10 -30 Q-2 -24 6 -30 Q8 -22 0 -20 Q-8 -22 -10 -30 Z" fill="#c084fc"/>
    <path d="M-20 -60 Q-4 -86 16 -62 L20 -20 Q8 -40 2 -60 Q-6 -46 -22 -20 Z" fill="#e63946"/><circle cx="0" cy="-58" r="12" fill="#f4c7a1"/>
    <circle cx="-4" cy="-59" r="1.8" fill="#111"/><circle cx="4" cy="-59" r="1.8" fill="#111"/><path d="M-3 -53 Q0 -50 3 -53" stroke="#c2185b" stroke-width="1.5" fill="none"/>
    <path d="M-14 -66 Q0 -80 14 -66" stroke="#e63946" stroke-width="6" fill="none"/></g>`;
  const kingCrown = '<path d="M-14 -16 L-12 -32 L-5 -22 L0 -36 L5 -22 L12 -32 L14 -16 Z" fill="#ffd23f" stroke="#c99a00" stroke-width="1.5"/><circle cx="0" cy="-26" r="2.5" fill="#e63946"/>';

  Adventure.chapter('scimmie', {
    id: 'scimmie3',
    title: 'La Festa del Re delle Scimmie',
    icon: '👑',
    save: 'cg_adventure3',
    start: 'porto',
    done: f => f.s_bussola,
    items: {
      retino: { icon: '🥅', name: 'Retino', look: 'Un retino da pescatore con il manico lungo. Serve a prendere le cose dall’acqua!' },
      fiore: { icon: '🌺', name: 'Fiore di ibisco', look: 'Un grande fiore rosso profumatissimo. Alle api piacciono tanto i fiori...' },
      pesce: { icon: '🐟', name: 'Pesce', look: 'Un pesce fresco fresco che si dimena. Qualcuno avrà fame...' },
      tamburo: { icon: '🥁', name: 'Tamburo', look: 'Il tamburo più rumoroso dell’isola: BUM BUM! Perfetto per la musica della festa.' },
      miele: { icon: '🍯', name: 'Miele', look: 'Un barattolo di miele dorato e dolcissimo.' },
      torta: { icon: '🎂', name: 'Torta al miele', look: 'Una torta enorme al miele e banana. Che profumo!' },
      pettine: { icon: '🪮', name: 'Pettine d’oro', look: 'Un pettine d’oro con le perle. Sembra quello di una principessa... o di una sirena!' },
      cappello: { icon: '🎩', name: 'Cappellino da ballo', look: 'Un cappellino a cilindro con i lustrini. È di un ballerino famoso!' },
    },
    build(A) {
      const { has, give, drop, step, say, dialog, go, render } = A;

      const scenes = {
        porto: {
          name: '⚓ Il Porto di Bananona',
          draw: () => skyGrad('#7ad7ff', '#e1f5fe') + '<circle cx="60" cy="40" r="20" fill="#ffd23f"/>' +
            '<rect y="130" width="400" height="120" fill="#00b4d8"/><path d="M0 140 Q50 134 100 140 T200 140 T300 140 T400 140" stroke="#caf0f8" stroke-width="2" fill="none"/>' +
            '<path d="M220 150 L370 150 L350 182 L240 182 Z" fill="#8d5a32" stroke="#5a3418" stroke-width="2"/><path d="M296 150 L296 50" stroke="#5a3418" stroke-width="5"/><path d="M300 56 Q350 90 300 130 Z" fill="#fff"/><path d="M296 52 L276 58 L296 66 Z" fill="#111"/>' +
            '<rect x="0" y="182" width="400" height="68" fill="#a0703c"/>' + Array.from({ length: 12 }, (_, i) => `<path d="M${i * 34} 182 L${i * 34} 250" stroke="#7a5230" stroke-width="2"/>`).join('') +
            '<path d="M40 176 L120 176 L110 196 L50 196 Z" fill="#5a3418"/>' +
            (A.f.s_retino ? '' : '<path d="M118 126 L92 180" stroke="#8d5a32" stroke-width="3"/><ellipse cx="124" cy="120" rx="14" ry="10" fill="none" stroke="#bbb" stroke-width="2"/><path d="M112 116 L136 124 M114 124 L134 116 M124 110 L124 130" stroke="#bbb" stroke-width="1"/>') +
            '<path d="M330 214 L362 214 L356 246 L336 246 Z" fill="#c47a2c"/><ellipse cx="346" cy="212" rx="18" ry="6" fill="#5a3418"/><path d="M346 210 Q340 190 330 186 M346 210 Q352 192 364 190" stroke="#2d6a4f" stroke-width="3" fill="none"/>' +
            (A.f.s_fiore ? '' : '<g transform="translate(346 186)"><circle cx="-6" cy="0" r="7" fill="#e63946"/><circle cx="6" cy="0" r="7" fill="#e63946"/><circle cx="0" cy="-7" r="7" fill="#e63946"/><circle cx="0" cy="6" r="7" fill="#e63946"/><circle r="3" fill="#ffd23f"/></g>') +
            person(190, 238, { coat: '#1d3557', beard: '#cfcfcf', patch: true, peg: true, hat: TRICORN, belt: true }) +
            exitSign(8, 214, '⬅ Laguna') + exitSign(244, 214, 'Mercato ➡'),
          spots: () => [
            { id: 'barba', name: '🏴‍☠️ Capitan Barbagrigia', x: 158, y: 120, w: 64, h: 120, talk: talkBarba3, look: 'Barbagrigia tiene in mano la vecchia bussola rotta e sospira.' },
            ...(A.f.s_retino ? [] : [{ id: 'retino', name: '🥅 Retino', x: 92, y: 106, w: 50, h: 76, look: 'Un retino da pescatore appoggiato alla barchetta.', take: () => { give('retino'); step('retino', 20); say(null, 'Hai preso il retino! Serve a prendere le cose dall’acqua. 🥅'); render(); } }]),
            ...(A.f.s_fiore ? [] : [{ id: 'fiore', name: '🌺 Vaso di fiori', x: 324, y: 170, w: 46, h: 40, look: 'Un vaso con un grande fiore di ibisco rosso. Che profumo!', take: () => { give('fiore'); step('fiore', 20); say(null, 'Hai preso il fiore di ibisco! 🌺 Profuma di miele...'); render(); } }]),
            { id: 'nave', name: '⛵ La nave', x: 220, y: 46, w: 150, h: 136, look: 'La nave di Barbagrigia. Senza una bussola, però, non sa dove andare!' },
            { id: 'exitL', name: 'Verso la laguna', x: 0, y: 204, w: 104, h: 40, go: 'laguna' },
            { id: 'exitR', name: 'Verso il mercato', x: 240, y: 204, w: 112, h: 40, go: 'mercato' },
          ],
        },
        mercato: {
          name: '🛍️ Il Mercato',
          draw: () => skyGrad('#ffd6a5', '#fff1e6') + '<rect y="190" width="400" height="60" fill="#e9c69a"/>' +
            '<rect x="20" y="80" width="150" height="110" fill="#fff"/>' + Array.from({ length: 6 }, (_, i) => `<path d="M${20 + i * 25} 60 L${45 + i * 25} 60 L${45 + i * 25} 84 Q${32 + i * 25} 92 ${20 + i * 25} 84 Z" fill="${i % 2 ? '#fff' : '#2a9d8f'}"/>`).join('') +
            '<rect x="20" y="150" width="150" height="40" fill="#a0703c"/>' + [40, 80, 140].map(x => `<ellipse cx="${x}" cy="150" rx="13" ry="5" fill="#e63946"/><rect x="${x - 13}" y="150" width="26" height="14" fill="#e63946"/>`).join('') +
            '<rect x="230" y="80" width="150" height="110" fill="#fff"/>' + Array.from({ length: 6 }, (_, i) => `<path d="M${230 + i * 25} 60 L${255 + i * 25} 60 L${255 + i * 25} 84 Q${242 + i * 25} 92 ${230 + i * 25} 84 Z" fill="${i % 2 ? '#fff' : '#ff8fab'}"/>`).join('') +
            '<rect x="230" y="150" width="150" height="40" fill="#a0703c"/>' +
            (A.f.s_torta ? '' : '<rect x="330" y="130" width="34" height="20" fill="#fff3e0" stroke="#ddd"/><path d="M330 130 L364 130 L358 122 L336 122 Z" fill="#ffd6e0"/>') +
            label(46, 66, 'TAMBURI DI TITO', '#264653', '#ffd23f', 100) + label(256, 66, 'DOLCI DI LOLA', '#c2185b', '#fff', 100) +
            tito(96, 236) + lola(296, 236) + exitSign(8, 214, '⬅ Porto') + exitSign(304, 214, 'Cascata ➡'),
          spots: () => [
            { id: 'tito', name: '🥁 Tito il Tamburaio', x: 64, y: 120, w: 64, h: 118, talk: () => (A.f.s_tamburo ? say(TITO, 'BUM BUM! Suonalo forte alla festa del Re! 🥁') : say(TITO, 'Ciao! I miei tamburi sono i più rumorosi dell’isola! Te ne regalo uno... ma sono stanco morto e ho una fame! Portami un bel pesce fresco e il tamburo è tuo! 🐟')), look: 'Tito suona il tamburo con le mani: bum, ba-bum!', use: { pesce: () => { drop('pesce'); give('tamburo'); step('tamburo', 100); dialog([[TITO, 'Un pesce fresco! Gnam! Grazie, amico! 🐟'], [TITO, 'Ecco il mio tamburo migliore: con questo la festa sarà rumorosissima! BUM BUM! 🥁']]); } } },
            { id: 'lola', name: '👩‍🍳 Cuoca Lola', x: 264, y: 120, w: 64, h: 118, talk: () => (A.f.s_torta ? say(LOLA, 'Buon appetito al Re! Anzi, buona festa! 🎂') : say(LOLA, 'Una torta per la festa del Re? Che bello! So fare la torta al miele e banana più buona del mondo... ma ho finito il miele! Se me lo porti, te la preparo subito. 🍯')), look: 'Lola, la cuoca. Ha le mani piene di farina e un sorriso enorme.', use: { miele: () => { drop('miele'); give('torta'); step('torta', 100); dialog([[LOLA, 'Il miele! Ora mescolo, inforno e... DING! 🍯'], [LOLA, 'Ecco la torta al miele e banana più alta dell’isola! Portala al Re! 🎂']]); render(); } } },
            { id: 'exitL', name: 'Verso il porto', x: 0, y: 204, w: 92, h: 40, go: 'porto' },
            { id: 'exitR', name: 'Verso la cascata', x: 300, y: 204, w: 100, h: 40, go: 'cascata' },
          ],
        },
        cascata: {
          name: '💦 La Cascata',
          draw: () => skyGrad('#90e0ef', '#e0fbfc') + '<path d="M0 60 L120 40 L150 200 L0 220 Z" fill="#6c757d"/><path d="M400 50 L260 40 L230 200 L400 220 Z" fill="#6c757d"/>' +
            '<rect x="150" y="30" width="80" height="170" fill="#caf0f8"/>' + Array.from({ length: 6 }, (_, i) => `<path d="M${158 + i * 13} 30 L${158 + i * 13} 200" stroke="#fff" stroke-width="3" opacity=".7"/>`).join('') +
            '<ellipse cx="190" cy="214" rx="120" ry="30" fill="#00b4d8"/>' +
            (A.f.s_pesce ? '' : '<g transform="translate(140 214)"><ellipse rx="12" ry="6" fill="#ff9f1c"/><path d="M10 0 L20 -7 L20 7 Z" fill="#ff9f1c"/><circle cx="-6" cy="-1" r="1.5" fill="#111"/></g><g transform="translate(236 222) scale(-1 1)"><ellipse rx="10" ry="5" fill="#ffd23f"/><path d="M8 0 L16 -6 L16 6 Z" fill="#ffd23f"/></g>') +
            (A.f.s_pettine ? '' : '<g transform="translate(196 230)"><rect x="-12" y="-4" width="24" height="5" rx="2" fill="#ffd23f"/><path d="M-10 1 L-10 7 M-6 1 L-6 7 M-2 1 L-2 7 M2 1 L2 7 M6 1 L6 7 M10 1 L10 7" stroke="#ffd23f" stroke-width="1.6"/><circle cx="0" cy="-4" r="2.5" fill="#fff"/></g>') +
            '<rect x="330" y="60" width="12" height="150" fill="#5a3418"/><circle cx="336" cy="60" r="34" fill="#2d6a4f"/>' +
            (A.f.s_miele ? '' : '<ellipse cx="318" cy="104" rx="16" ry="20" fill="#e9b200" stroke="#a87a00" stroke-width="2"/><path d="M304 98 L332 98 M303 108 L333 108" stroke="#a87a00" stroke-width="2"/><circle cx="318" cy="114" r="3.5" fill="#3d2b1f"/>' + [[296, 86], [342, 92], [300, 124], [336, 128]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="4" ry="3" fill="#ffd23f" stroke="#111" stroke-width="1"/><ellipse cx="-1" cy="-3" rx="3" ry="2" fill="#fff" opacity=".8"/></g>`).join('')) +
            (A.f.s_miele ? '<g transform="translate(60 196)"><circle cx="-6" cy="0" r="6" fill="#e63946"/><circle cx="6" cy="0" r="6" fill="#e63946"/><circle cx="0" cy="-6" r="6" fill="#e63946"/><circle r="3" fill="#ffd23f"/></g>' : '') +
            label(10, 30, '⬆ TEMPIO', '#fff', '#5a3418', 70) + exitSign(8, 222, '⬅ Mercato'),
          spots: () => [
            ...(A.f.s_pesce ? [] : [{ id: 'pesci', name: '🐟 Pesci', x: 120, y: 200, w: 140, h: 28, look: 'Pesci colorati che nuotano veloci nella pozza. Con le mani non li prendi mai!', take: () => say(null, 'Splash! Il pesce ti scivola tra le dita! Ci vorrebbe un retino...'), use: { retino: () => { give('pesce'); step('pesce', 100); say(null, 'Zac! Con il retino hai preso un bel pesce! 🐟'); render(); } } }]),
            ...(A.f.s_pettine ? [] : [{ id: 'pettine', name: '✨ Qualcosa che luccica', x: 176, y: 222, w: 40, h: 22, look: 'In fondo alla pozza luccica qualcosa d’oro... sembra un pettine!', take: () => say(null, 'È troppo in fondo, non ci arrivo con le mani! Ci vorrebbe qualcosa con il manico lungo...'), use: { retino: () => { give('pettine'); step('pettine', 100); say(null, 'Con il retino hai ripescato un pettine d’oro con le perle! 🪮 Di chi sarà?'); render(); } } }]),
            ...(A.f.s_miele ? [] : [{ id: 'alveare', name: '🐝 Alveare', x: 290, y: 78, w: 60, h: 56, look: 'Un alveare pieno di miele dorato! Le api ronzano tutto intorno: bzzz...', take: () => { Sound.bad(); say(null, 'BZZZ! Le api ti ronzano intorno arrabbiate! 🐝 Meglio distrarle con qualcosa che amano ancora di più...'); }, use: { fiore: () => { drop('fiore'); give('miele'); step('miele', 100); say(null, 'Appoggi il fiore di ibisco lì vicino: tutte le api volano sul fiore! 🌺🐝 Tu ne approfitti e prendi un barattolo di miele. 🍯'); render(); } } }]),
            { id: 'cascataW', name: '💦 Cascata', x: 150, y: 30, w: 80, h: 160, look: 'Una cascata altissima che fa un rumore fortissimo: SHHHHH!' },
            { id: 'tempio', name: '⬆ Sentiero del tempio', x: 0, y: 20, w: 120, h: 70, go: 'tempio', look: 'Un sentiero di pietra che sale verso il Tempio del Re delle Scimmie.' },
            { id: 'exit', name: 'Verso il mercato', x: 0, y: 212, w: 104, h: 38, go: 'mercato' },
          ],
        },
        laguna: {
          name: '🧜‍♀️ La Laguna',
          draw: () => skyGrad('#ffafcc', '#ffe5ec') + '<rect y="110" width="400" height="140" fill="#48cae4"/><path d="M0 200 Q100 186 200 200 L200 250 L0 250 Z" fill="#f4d58d"/>' +
            '<ellipse cx="300" cy="140" rx="60" ry="18" fill="#adb5bd"/><path d="M250 140 Q300 92 350 140 Z" fill="#6c757d"/>' +
            mermaid(300, 132) +
            (A.f.s_cappello ? '' : '<g transform="translate(340 104)"><rect x="-8" y="-16" width="16" height="16" fill="#111"/><rect x="-13" y="0" width="26" height="4" fill="#111"/><rect x="-8" y="-6" width="16" height="3" fill="#c084fc"/></g>') +
            (A.f.s_ballerino ? '' : monkey(110, 196, A.f.s_cappello && false) + '<path d="M96 168 Q100 160 104 168" stroke="#4dd0ff" stroke-width="2" fill="none"/>') +
            exitSign(304, 214, 'Porto ➡'),
          spots: () => [
            { id: 'cappelloS', name: '🪨 Scoglio', x: 322, y: 88, w: 50, h: 34, look: A.f.s_cappello ? 'Lo scoglio della sirena.' : 'Sullo scoglio, accanto alla sirena, c’è un cappellino nero con i lustrini!', take: () => say(MARINA, A.f.s_cappello ? 'Te l’ho già dato!' : 'Ehi! Il cappellino l’ho trovato io. Te lo do in cambio del mio pettine d’oro!') },
            { id: 'marina', name: '🧜‍♀️ Sirena Marina', x: 262, y: 60, w: 76, h: 100, talk: () => (A.f.s_cappello ? say(MARINA, 'Grazie ancora per il mio pettine! Ora i miei capelli sono bellissimi! 💖') : say(MARINA, 'Ciao! Sono Marina, la sirena della laguna. 🧜‍♀️ Ho trovato un cappellino da ballo sul mio scoglio... ma io ho perso il mio pettine d’oro nella cascata! Se me lo riporti, ti do il cappellino.')), look: 'Una sirena con i capelli rossi e la coda verde smeraldo che brilla al sole!', use: { pettine: () => { drop('pettine'); give('cappello'); step('cappello', 100); dialog([[MARINA, 'Il mio pettine d’oro! Grazie grazie grazie! 💖'], [MARINA, 'Tieni, ecco il cappellino da ballo che ho trovato. Sembra quello di una scimmia molto elegante... 🎩']]); render(); } } },
            ...(A.f.s_ballerino ? [] : [{ id: 'bubu', name: '🐒 Bubù', x: 84, y: 162, w: 56, h: 66, talk: () => say(BUBU, 'Uh uh... 😢 (Bubù è triste: ha perso il suo cappellino da ballerino! Senza cappellino non vuole ballare. Indica lo scoglio della sirena.)'), look: 'È Bubù, la scimmia ballerina! È venuta a trovare la sua famiglia, ma sembra tristissima.', use: { cappello: () => { drop('cappello'); step('ballerino', 100); dialog([[BUBU, 'Uh uh ah ah!!! 🎩💃 (Bubù si mette il cappellino e fa una piroetta!)'], [BUBU, 'Uh uh! (Bubù corre verso il Tempio del Re: è pronto a ballare alla festa!)']]); render(); } } }]),
            { id: 'exit', name: 'Verso il porto', x: 300, y: 204, w: 100, h: 40, go: 'porto' },
          ],
        },
        tempio: {
          name: '🛕 Il Tempio delle Scimmie',
          draw: () => skyGrad('#80ed99', '#c7f9cc') + '<rect y="200" width="400" height="50" fill="#6c584c"/>' +
            '<path d="M80 200 L80 70 L200 20 L320 70 L320 200 Z" fill="#b08968"/><path d="M70 74 L200 14 L330 74 Z" fill="#7f5539"/>' +
            [100, 300].map(x => `<rect x="${x - 10}" y="80" width="20" height="120" fill="#9c6644"/>`).join('') +
            '<g transform="translate(40 200)"><rect x="-14" y="-20" width="28" height="20" fill="#9c6644"/></g>' + monkey(40, 150, true, 1.1, '<path d="M-16 -12 Q0 -20 16 -12" stroke="#ffd23f" stroke-width="3" fill="none"/>').replace(/#8d5a32/g, '#a8a29e').replace(/#e9c69a/g, '#d6d3d1') +
            '<g transform="translate(360 200)"><rect x="-14" y="-20" width="28" height="20" fill="#9c6644"/></g>' + monkey(360, 150, true, 1.1).replace(/#8d5a32/g, '#a8a29e').replace(/#e9c69a/g, '#d6d3d1') +
            (A.f.s_porta3 ? '<path d="M160 200 L160 120 Q200 90 240 120 L240 200 Z" fill="#1b1b1b"/><path d="M168 200 L168 126 Q200 100 232 126 L232 200 Z" fill="#ffd23f" opacity=".3"/>'
              : '<path d="M160 200 L160 120 Q200 90 240 120 L240 200 Z" fill="#7f5539" stroke="#5a3418" stroke-width="3"/>' + [178, 200, 222].map(x => `<rect x="${x - 8}" y="146" width="16" height="16" rx="3" fill="#ede0d4" stroke="#5a3418"/>`).join('')) +
            '<rect x="110" y="96" width="70" height="40" rx="4" fill="#ede0d4" stroke="#7f5539" stroke-width="2"/>' + '<text x="145" y="114" font-size="11" text-anchor="middle">☀️ 🌙 ⭐</text><text x="145" y="128" font-size="8" text-anchor="middle" fill="#5a3418">~ ~ ~ ~ ~</text>' +
            exitSign(8, 222, '⬅ Cascata') + (A.f.s_porta3 ? exitSign(166, 172, 'Entra ➡') : ''),
          spots: () => [
            { id: 'iscrizione', name: '🪨 Iscrizione antica', x: 108, y: 94, w: 74, h: 44, look: 'Sulla pietra c’è scritto: «Prima sorge il ☀️ SOLE, poi a sera arriva la 🌙 LUNA, e nella notte brilla la ⭐ STELLA. Solo chi conosce il cielo può entrare.»' },
            { id: 'porta', name: A.f.s_porta3 ? '🚪 Porta aperta' : '🚪 Porta del Tempio', x: 156, y: 96, w: 88, h: 106, look: A.f.s_porta3 ? 'La porta è aperta. Dentro si sente musica di scimmie...' : 'Una porta di pietra con 3 riquadri girevoli. Ognuno mostra un simbolo.', go: A.f.s_porta3 ? 'sala' : null, take: A.f.s_porta3 ? null : () => A.lock({
              title: '🛕 Porta del Tempio', text: 'Gira i 3 riquadri e scegli i simboli nell’ordine giusto:', symbols: ['🍌', '☀️', '🌙', '⭐'], code: ['☀️', '🌙', '⭐'],
              ok: () => { step('porta3', 150); render(); say(null, 'GRRRR... la porta di pietra si apre lentamente! Dentro si sente musica di scimmie! 🎶', [{ label: '➡ Entra', fn: () => go('sala') }]); },
              fail: 'La porta non si muove. Forse c’è un indizio scritto da qualche parte...', leave: 'La porta resta chiusa.',
            }) },
            { id: 'statue', name: '🗿 Statue di scimmia', x: 14, y: 120, w: 60, h: 80, look: 'Due statue di scimmia sorridenti fanno la guardia al tempio.' },
            { id: 'exit', name: 'Verso la cascata', x: 0, y: 212, w: 104, h: 38, go: 'cascata' },
          ],
        },
        sala: {
          name: '👑 La Sala del Re',
          draw: () => '<rect width="400" height="250" fill="#7f5539"/>' + glow('advking', '#ffd23f', 0.5, 0.4) + '<rect y="196" width="400" height="54" fill="#5a3418"/>' +
            '<path d="M140 196 L150 80 L250 80 L260 196 Z" fill="#c99a00"/><rect x="160" y="140" width="80" height="56" fill="#e63946"/>' +
            monkey(200, 140, true, 2.4, kingCrown + '<path d="M-18 14 Q0 30 18 14 L22 36 L-22 36 Z" fill="#9d0208"/>') +
            (A.f.p_tamburo ? '<g transform="translate(90 196)"><ellipse cx="0" cy="-30" rx="18" ry="8" fill="#e63946" stroke="#9d0208"/><rect x="-18" y="-30" width="36" height="26" fill="#e63946"/><ellipse cx="0" cy="-4" rx="18" ry="6" fill="#9d0208"/></g>' : '') +
            (A.f.p_torta ? '<g transform="translate(310 196)"><rect x="-26" y="-36" width="52" height="36" fill="#fff3e0" stroke="#ddd"/><rect x="-20" y="-56" width="40" height="22" fill="#ffd6e0" stroke="#ddd"/><path d="M0 -56 L0 -66" stroke="#ffd23f" stroke-width="3"/><circle cx="0" cy="-69" r="3" fill="#ff7b00"/></g>' : '') +
            (A.f.s_ballerino ? monkey(60, 160, true, 1, '<g transform="translate(0 -18)"><rect x="-8" y="-14" width="16" height="14" fill="#111"/><rect x="-13" y="0" width="26" height="4" fill="#111"/></g>') : '') +
            Array.from({ length: 7 }, (_, i) => `<path d="M${i * 66} 0 Q${i * 66 + 33} 30 ${i * 66 + 66} 0" stroke="${['#e63946', '#ffd23f', '#2ec27e', '#4dd0ff'][i % 4]}" stroke-width="4" fill="none"/>`).join('') +
            exitSign(8, 222, '⬅ Tempio'),
          spots: () => [
            { id: 're', name: '👑 Re Bananone', x: 150, y: 60, w: 100, h: 140, talk: talkRe, look: 'Re Bananone, il Re delle Scimmie: grande, peloso e con una corona d’oro. Al collo ha la Bussola d’Oro!', use: { tamburo: () => { drop('tamburo'); A.f.p_tamburo = true; step('p_tamburo', 50); say(RE, 'Un tamburo! BUM BUM! Ottimo, la musica c’è! 🥁'); render(); party(); }, torta: () => { drop('torta'); A.f.p_torta = true; step('p_torta', 50); say(RE, 'Una torta al miele e banana! La mia preferita! 🎂'); render(); party(); } } },
            { id: 'exit', name: 'Verso il tempio', x: 0, y: 212, w: 104, h: 38, go: 'tempio' },
          ],
        },
      };

      function talkBarba3() {
        if (!A.f.s_q3) {
          return dialog([
            [BARBA, `Arrr, ${App.playerName()}! Che tempesta ieri notte! Le onde erano alte come montagne...`],
            [BARBA, 'E guarda qui: la mia bussola si è rotta! 🧭 Senza bussola non sapremo mai tornare a casa!'],
            [BARBA, 'Per fortuna siamo approdati all’Isola Bananona. Si dice che Re Bananone, il Re delle Scimmie, abbia una Bussola d’Oro magica...'],
            [BARBA, 'Ma è un re capriccioso: regala le sue cose solo a chi gli organizza una festa grandiosa! Il suo tempio è oltre la cascata. Coraggio, mozzo!'],
          ], () => step('q3', 50));
        }
        if (A.f.s_bussola) return say(BARBA, 'Arrr! Con la Bussola d’Oro si torna a casa!');
        say(BARBA, 'Una festa per un re ha bisogno di musica 🥁, di una torta 🎂 e di qualcuno che balli 💃! Chiedi in giro al mercato e alla laguna.');
      }

      function talkRe() {
        if (!A.f.s_re) {
          return dialog([
            [RE, 'OOH OOH AH AH! Chi osa entrare nella mia sala? Un piccolo pirata!'],
            [A.ME(), 'Maestà, ci serve la vostra Bussola d’Oro per tornare a casa!'],
            [RE, 'La mia bussola? Ah ah! Te la regalo... se mi organizzi la FESTA più bella dell’isola!'],
            [RE, 'Voglio la 🥁 MUSICA di un tamburo, una 🎂 TORTA gigante e un 💃 BALLERINO che balli per me! Portami tutto e la bussola è tua!'],
          ], () => { step('re', 50); party(); });
        }
        const missing = [];
        if (!A.f.p_tamburo) missing.push('🥁 la musica');
        if (!A.f.p_torta) missing.push('🎂 la torta');
        if (!A.f.s_ballerino) missing.push('💃 il ballerino');
        if (missing.length) return say(RE, `Per la mia festa mancano ancora: ${missing.join(', ')}. Sbrigati, mi annoio! 😤`);
        party();
      }

      function party() {
        if (!(A.f.p_tamburo && A.f.p_torta && A.f.s_ballerino && A.f.s_re) || A.f.s_bussola) return;
        step('bussola', 300);
        render();
        A.finish({
          lines: [
            [RE, 'Musica, torta e ballerino... è tutto pronto! CHE LA FESTA ABBIA INIZIO! 🎉'],
            [null, 'BUM BUM BUM! 🥁 Bubù balla con il suo cappellino, tutte le scimmie mangiano la torta e cantano: uh uh ah ah! 🐒💃🎂'],
            [RE, 'È la festa più bella della mia vita! Tieni, piccolo pirata: la Bussola d’Oro è tua! 🧭✨'],
            [BARBA, `Arrr! ${App.playerName()}, con questa bussola torneremo a casa in un attimo. Sei il pirata più festaiolo dei sette mari! 🏴‍☠️`],
          ],
          title: 'Che festa! 🎉👑',
          msg: 'Hai organizzato la festa del Re delle Scimmie e ottenuto la Bussola d’Oro!',
        });
      }

      function hint() {
        const f = A.f;
        if (!f.s_q3) return 'Parla con Capitan Barbagrigia sul porto.';
        if (!f.s_retino) return 'Sul porto, appoggiato alla barchetta, c’è un retino: prendilo!';
        if (!f.s_tamburo) {
          if (has('pesce')) return 'Porta il pesce a Tito il Tamburaio al mercato.';
          return 'Alla cascata seleziona il retino e tocca i pesci nella pozza. Poi dai il pesce a Tito.';
        }
        if (!f.s_torta) {
          if (has('miele')) return 'Porta il miele alla Cuoca Lola al mercato.';
          if (!f.s_fiore) return 'Sul porto c’è un vaso con un fiore rosso: prendilo.';
          return 'Alla cascata usa il fiore con l’alveare: le api andranno sul fiore e potrai prendere il miele.';
        }
        if (!f.s_ballerino) {
          if (has('cappello')) return 'Dai il cappellino a Bubù nella laguna.';
          if (has('pettine')) return 'Dai il pettine d’oro alla Sirena Marina nella laguna.';
          return 'Alla cascata qualcosa luccica in fondo alla pozza: usa il retino per ripescarlo.';
        }
        if (!f.s_porta3) return 'Al tempio leggi l’iscrizione sulla pietra, poi tocca la porta e scegli “Prendi”: metti i simboli nello stesso ordine.';
        if (!f.s_re) return 'Entra nella sala e parla con Re Bananone.';
        return 'Dai il tamburo e la torta al Re: seleziona ogni oggetto nello zaino e tocca il Re.';
      }

      const arrive = {
        porto: 'Il porto dell’Isola Bananona: tutto profuma di banana!',
        mercato: 'Un mercato coloratissimo: tamburi da una parte, dolci dall’altra!',
        cascata: 'Una cascata altissima finisce in una pozza piena di pesci. Su un albero c’è un alveare...',
        laguna: 'Una laguna azzurra come il cielo. Su uno scoglio c’è... una sirena!',
        tempio: 'Il Tempio delle Scimmie! Due statue fanno la guardia a una grande porta di pietra.',
        sala: 'La sala del trono: sul trono d’oro c’è Re Bananone in persona!',
      };
      return { scenes, hint, arrive, welcome: `Capitolo 3: la festa del Re delle Scimmie! 👑 Sei al porto, ${U.esc(App.playerName())}. Barbagrigia ha un problema: toccalo e parla con lui! 👆` };
    },
  });

})();
