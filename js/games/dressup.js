'use strict';
/*
 * Vesti la Bambola: scegli una bambola e vestila con capi di stili diversi
 * (Hawaii, Classico, Anni 80, Anni 90, Anni 2000, Principessa, Sport).
 * Tutto è disegnato in SVG a strati; con "📸 Foto" si crea un'immagine PNG da condividere.
 */
const Dress = (() => {
  /* ---------- stili ---------- */
  const THEMES = {
    hawaii:   { label: '🌺 Hawaii', color: '#ff7b00' },
    classic:  { label: '🎩 Classico', color: '#264653' },
    '80':     { label: '📼 Anni 80', color: '#ff2e88' },
    '90':     { label: '💿 Anni 90', color: '#2a9d8f' },
    '2000':   { label: '📱 Anni 2000', color: '#c084fc' },
    princess: { label: '👑 Principessa', color: '#e9b200' },
    sport:    { label: '⚽ Sport', color: '#2ec27e' },
  };

  /* ---------- registro di motivi e sfumature (defs SVG) ---------- */
  function registry() {
    const defs = new Map();
    function make(id, spec) {
      const [k, a, b, c] = spec;
      const P = (w, h, inner) => `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${inner}</pattern>`;
      switch (k) {
        case 'flowers': {
          const fl = (x, y, r) => [0, 72, 144, 216, 288].map(d => {
            const t = d * Math.PI / 180;
            return `<circle cx="${(x + r * Math.cos(t)).toFixed(1)}" cy="${(y + r * Math.sin(t)).toFixed(1)}" r="${r * 0.85}" fill="${b}"/>`;
          }).join('') + `<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="${c}"/>`;
          return P(24, 24, `<rect width="24" height="24" fill="${a}"/>${fl(7, 7, 3.2)}${fl(18, 18, 2.4)}<ellipse cx="17" cy="6" rx="3" ry="1.4" fill="#2d6a4f" transform="rotate(-30 17 6)"/>`);
        }
        case 'dots': return P(10, 10, `<rect width="10" height="10" fill="${a}"/><circle cx="3" cy="3" r="1.8" fill="${b}"/><circle cx="8" cy="8" r="1.8" fill="${b}"/>`);
        case 'stripes': return P(10, 10, `<rect width="10" height="10" fill="${a}"/><rect width="10" height="4" fill="${b}"/>`);
        case 'vstripes': return P(6, 10, `<rect width="6" height="10" fill="${a}"/><rect width="2.5" height="10" fill="${b}"/>`);
        case 'plaid': return P(16, 16, `<rect width="16" height="16" fill="${a}"/><rect width="16" height="5" y="5" fill="${b}" opacity=".55"/><rect width="5" height="16" x="5" fill="${b}" opacity=".55"/><rect width="16" height="1" y="13" fill="#fff" opacity=".5"/><rect width="1" height="16" x="13" fill="#fff" opacity=".5"/>`);
        case 'zigzag': return P(12, 10, `<rect width="12" height="10" fill="${a}"/><path d="M0 7 L3 3 L6 7 L9 3 L12 7" stroke="${b}" stroke-width="2.2" fill="none"/>`);
        case 'stars': return P(14, 14, `<rect width="14" height="14" fill="${a}"/><path d="M4 1 L5 4 L8 4 L5.5 6 L6.5 9 L4 7 L1.5 9 L2.5 6 L0 4 L3 4 Z" fill="${b}"/><circle cx="11" cy="11" r="1.2" fill="${b}"/>`);
        case 'denim': return P(6, 6, `<rect width="6" height="6" fill="${a}"/><path d="M0 6 L6 0" stroke="${b}" stroke-width="1"/>`);
        case 'grad': return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
        default: return '';
      }
    }
    return {
      paint(spec) {
        if (typeof spec === 'string') return spec;
        const key = spec.join('|');
        if (!defs.has(key)) { const id = 'p' + defs.size; defs.set(key, { id, svg: make(id, spec) }); }
        return `url(#${defs.get(key).id})`;
      },
      defs() { return [...defs.values()].map(d => d.svg).join(''); },
    };
  }

  /* ---------- bambole ---------- */
  const DOLLS = {
    sofia: { name: 'Sofia', skin: '#ffe0c7', hair: '#f2c94c', style: 'long', eye: '#3a7bd5' },
    aisha: { name: 'Aisha', skin: '#8d5524', hair: '#1b1b1b', style: 'afro', eye: '#3b2414' },
    mei:   { name: 'Mei', skin: '#f6d5b8', hair: '#16161d', style: 'bob', eye: '#3b2414' },
    luna:  { name: 'Luna', skin: '#e8b48c', hair: '#b5462a', style: 'pony', eye: '#2e8b57' },
    leo:   { name: 'Leo', skin: '#d9a066', hair: '#5a3418', style: 'short', eye: '#5a3418', boy: true },
    zara:  { name: 'Zara', skin: '#5c3a21', hair: '#2b1a3a', style: 'braids', eye: '#3b2414', tips: '#b388ff' },
    nina:  { name: 'Nina', skin: '#ffd9b3', hair: '#ff7ac6', style: 'pony', eye: '#8338ec' },
  };

  function hairBack(d) {
    const h = d.hair;
    switch (d.style) {
      case 'long': return `<path d="M64 70 Q60 28 100 28 Q140 28 136 70 L146 175 Q100 188 54 175 Z" fill="${h}"/>`;
      case 'bob': return `<path d="M62 74 Q58 26 100 26 Q142 26 138 74 L140 112 Q120 118 112 108 L88 108 Q80 118 60 112 Z" fill="${h}"/>`;
      case 'pony': return `<path d="M64 70 Q62 28 100 28 Q138 28 136 70 Z" fill="${h}"/><path d="M128 40 Q176 52 160 140 Q156 104 136 72 Z" fill="${h}"/><circle cx="131" cy="42" r="5" fill="#ffd23f"/>`;
      case 'afro': return `<circle cx="100" cy="62" r="54" fill="${h}"/>`;
      case 'short': return `<path d="M64 70 Q60 30 100 30 Q140 30 136 70 Z" fill="${h}"/>`;
      case 'braids': {
        let s = `<path d="M64 70 Q62 28 100 28 Q138 28 136 70 Z" fill="${h}"/>`;
        for (const x of [66, 134]) {
          for (let y = 82; y <= 172; y += 13) s += `<circle cx="${x}" cy="${y}" r="7.5" fill="${y >= 165 ? d.tips : h}" stroke="rgba(0,0,0,.25)"/>`;
        }
        return s;
      }
      default: return '';
    }
  }

  function hairFront(d) {
    const h = d.hair;
    switch (d.style) {
      case 'long': return `<path d="M66 68 Q66 32 100 32 Q134 32 134 68 Q126 48 108 46 Q100 56 86 48 Q72 52 66 68 Z" fill="${h}"/>`;
      case 'bob': return `<path d="M65 64 Q66 30 100 30 Q134 30 135 64 L127 58 L119 63 L111 57 L103 63 L95 57 L87 63 L79 57 L71 63 Z" fill="${h}"/>`;
      case 'pony': return `<path d="M66 66 Q68 30 100 30 Q132 30 134 66 Q118 40 96 44 Q78 46 66 66 Z" fill="${h}"/>`;
      case 'afro': return [68, 79, 90, 101, 112, 123, 132].map((x, i) => `<circle cx="${x}" cy="${44 + (i % 2) * 3}" r="9" fill="${h}"/>`).join('');
      case 'short': return `<path d="M64 62 Q66 30 100 30 Q134 30 136 62 L128 50 L120 56 L112 46 L104 54 L96 44 L88 54 L80 46 L72 56 Z" fill="${h}"/>`;
      case 'braids': return `<path d="M66 66 Q66 30 100 30 Q134 30 134 66 Q122 40 100 38 Q78 40 66 66 Z" fill="${h}"/><path d="M100 31 L100 39" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/>`;
      default: return '';
    }
  }

  function face(d) {
    const lashes = d.boy ? '' : `<path d="M82 70 L80 67 M86 69 L85 66 M118 70 L120 67 M114 69 L115 66" stroke="#222" stroke-width="1.6" stroke-linecap="round"/>`;
    return `
      <path d="M81 64 Q88 60 95 63 M105 63 Q112 60 119 64" stroke="rgba(0,0,0,.55)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="88" cy="76" rx="4.6" ry="6" fill="${d.eye}"/><ellipse cx="112" cy="76" rx="4.6" ry="6" fill="${d.eye}"/>
      <circle cx="89.6" cy="73.6" r="1.7" fill="#fff"/><circle cx="113.6" cy="73.6" r="1.7" fill="#fff"/>
      ${lashes}
      <circle cx="80" cy="87" r="4.5" fill="#ff8fa3" opacity=".45"/><circle cx="120" cy="87" r="4.5" fill="#ff8fa3" opacity=".45"/>
      <path d="M99 80 Q101 84 98 86" stroke="rgba(0,0,0,.25)" stroke-width="1.5" fill="none"/>
      <path d="M92 91 Q100 98 108 91 Q100 94 92 91 Z" fill="#e05780" stroke="#c2185b" stroke-width="1.5" stroke-linejoin="round"/>`;
  }

  function body(d) {
    const s = d.skin;
    return `
      <g stroke="${s}" stroke-width="15" stroke-linecap="round"><path d="M75 127 L60 212"/><path d="M125 127 L140 212"/></g>
      <g stroke="${s}" stroke-width="17" stroke-linecap="round"><path d="M89 226 L89 352"/><path d="M111 226 L111 352"/></g>
      <ellipse cx="89" cy="358" rx="10" ry="6" fill="${s}"/><ellipse cx="111" cy="358" rx="10" ry="6" fill="${s}"/>
      <rect x="93" y="98" width="14" height="26" fill="${s}"/>
      <path d="M72 120 Q100 112 128 120 L126 200 Q100 206 74 200 Z" fill="${s}"/>
      <path d="M74 198 L126 198 L128 230 L72 230 Z" fill="${s}"/>
      <path d="M78 119 L84 119 Q100 130 116 119 L122 119 L127 200 Q100 205 73 200 Z" fill="#fff" stroke="rgba(0,0,0,.15)"/>
      <path d="M73 198 L127 198 L129 232 L102 232 L100 222 L98 232 L71 232 Z" fill="#fff" stroke="rgba(0,0,0,.15)"/>`;
  }
  const head = d => `<ellipse cx="100" cy="72" rx="34" ry="37" fill="${d.skin}"/>`;
  const hands = d => `<circle cx="59" cy="217" r="8.5" fill="${d.skin}"/><circle cx="141" cy="217" r="8.5" fill="${d.skin}"/>`;

  /* ---------- forme dei vestiti ---------- */
  const SH = {
    teeBody: 'M70 121 Q100 113 130 121 L132 206 Q100 210 68 206 Z',
    teeSleeves: 'M71 121 L58 152 L71 157 L79 134 Z M129 121 L142 152 L129 157 L121 134 Z',
    longSleeves: 'M71 121 L53 210 L67 215 L80 136 Z M129 121 L147 210 L133 215 L120 136 Z',
    tank: 'M78 119 L84 119 Q100 132 116 119 L122 119 L130 206 Q100 210 70 206 Z',
    crop: 'M70 121 Q100 113 130 121 L130 178 Q100 183 70 178 Z M71 121 L62 140 L72 144 L78 132 Z M129 121 L138 140 L128 144 L122 132 Z',
    jacket: 'M63 118 Q100 110 137 118 L135 207 L65 207 Z M63 118 L51 210 L66 215 L78 138 Z M137 118 L149 210 L134 215 L122 138 Z',
    shorts: 'M72 198 L128 198 L131 246 L103 246 L100 226 L97 246 L69 246 Z',
    skirt: 'M73 198 L127 198 L144 258 Q100 266 56 258 Z',
    longskirt: 'M73 198 L127 198 L150 330 Q100 340 50 330 Z',
    pants: 'M72 198 L128 198 L125 352 L103 352 L100 236 L97 352 L75 352 Z',
    flare: 'M72 198 L128 198 L124 296 L131 354 L102 354 L100 236 L98 354 L69 354 L76 296 Z',
    leggings: 'M74 198 L126 198 L121 350 L103 350 L100 232 L97 350 L79 350 Z',
    dress: 'M70 121 Q100 113 130 121 L128 198 L146 280 Q100 290 54 280 L72 198 Z',
    gown: 'M78 119 L84 119 Q100 132 116 119 L122 119 L126 198 L158 352 Q100 366 42 352 L74 198 Z',
  };
  const OUT = 'stroke="rgba(0,0,0,.28)" stroke-width="1.2" stroke-linejoin="round"';
  const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${OUT} ${extra}/>`;
  const collar = c => `<path d="M90 117 L100 128 L96 134 L85 121 Z M110 117 L100 128 L104 134 L115 121 Z" fill="${c}" ${OUT}/>`;
  const grassHem = () => {
    let d = 'M73 198 L127 198 L142 256';
    for (let x = 142; x > 58; x -= 6) d += ` L${x - 3} ${262 + ((x / 6) % 2) * 4} L${x - 6} 256`;
    return d + ' Z';
  };
  const flowerAt = (x, y, r, petal, center = '#ffd23f') =>
    [0, 72, 144, 216, 288].map(a => {
      const t = a * Math.PI / 180;
      return `<circle cx="${(x + r * Math.cos(t)).toFixed(1)}" cy="${(y + r * Math.sin(t)).toFixed(1)}" r="${(r * 0.85).toFixed(1)}" fill="${petal}"/>`;
    }).join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="${center}"/>`;
  const starPath = (cx, cy, r) => {
    let p = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `;
    }
    return p;
  };
  const heartPath = (cx, cy) => `M${cx} ${cy + 8} C${cx - 13} ${cy - 1} ${cx - 8} ${cy - 12} ${cx} ${cy - 5} C${cx + 8} ${cy - 12} ${cx + 13} ${cy - 1} ${cx} ${cy + 8} Z`;
  const both = s => `<g>${s}</g><g transform="translate(22 0)">${s}</g>`;

  /* ---------- catalogo ---------- */
  // ogni capo: [id, categoria, nome, icona, stile, disegno(paint)]
  const LIST = [
    // SOPRA
    ['hawaiishirt', 'top', 'Camicia hawaiana', '🌺', 'hawaii', p => path(SH.teeSleeves, p(['flowers', '#e63946', '#ffd23f', '#fff'])) + path(SH.teeBody, p(['flowers', '#e63946', '#ffd23f', '#fff'])) + collar('#e63946')],
    ['flowertank', 'top', 'Top a fiori', '🌸', 'hawaii', p => path(SH.tank, p(['flowers', '#00b4d8', '#ff8fab', '#ffd23f']))],
    ['blouse', 'top', 'Camicetta bianca', '👚', 'classic', p => path(SH.teeSleeves, '#fdfdfd') + path(SH.teeBody, '#fdfdfd') + collar('#fff') + '<g fill="#bbb"><circle cx="100" cy="145" r="1.8"/><circle cx="100" cy="165" r="1.8"/><circle cx="100" cy="185" r="1.8"/></g>'],
    ['sailor', 'top', 'Maglia alla marinara', '⚓', 'classic', p => path(SH.teeSleeves, '#1d3557') + path(SH.teeBody, p(['stripes', '#fff', '#1d3557']))],
    ['sweater', 'top', 'Maglione', '🧶', 'classic', p => path(SH.longSleeves, '#264653') + path(SH.teeBody, '#2a9d8f') + '<path d="M70 196 L130 196" stroke="#264653" stroke-width="6"/>'],
    ['jacket80', 'top', 'Giacca con spalline', '💖', '80', p => path(SH.jacket, '#ff2e88') + '<path d="M90 116 L100 160 L110 116 Z" fill="#fff"/><path d="M90 116 L98 150 L86 140 Z M110 116 L102 150 L114 140 Z" fill="#c2185b"/>'],
    ['zigzag', 'top', 'Felpa fluo', '⚡', '80', p => path(SH.longSleeves, '#00e5ff') + path(SH.teeBody, p(['zigzag', '#00e5ff', '#ff2e88']))],
    ['plaid', 'top', 'Camicia a quadri', '🎸', '90', p => path(SH.longSleeves, p(['plaid', '#c1121f', '#1d1d1d'])) + path(SH.teeBody, p(['plaid', '#c1121f', '#1d1d1d'])) + collar('#9d0208')],
    ['hoodie', 'top', 'Felpa col cappuccio', '🧢', '90', p => path(SH.longSleeves, '#7b2cbf') + path(SH.teeBody, '#7b2cbf') + '<path d="M80 118 Q100 104 120 118 Q100 130 80 118 Z" fill="#5a189a"/><path d="M84 180 L116 180 L120 202 L80 202 Z" fill="#5a189a"/><path d="M95 124 L94 146 M105 124 L106 146" stroke="#fff" stroke-width="1.8"/>'],
    ['croptop', 'top', 'Top corto glitter', '✨', '2000', p => path(SH.crop, p(['dots', '#ff8fd8', '#fff']))],
    ['silvertank', 'top', 'Top argento', '🪩', '2000', p => path(SH.tank, p(['stars', '#b8c0cc', '#fff']))],
    ['sporthoodie', 'top', 'Felpa sportiva', '⚽', 'sport', p => path(SH.longSleeves, '#2ec27e') + path(SH.teeBody, '#2ec27e') + '<path d="M80 118 Q100 104 120 118 Q100 130 80 118 Z" fill="#1a9c60"/><path d="M60 150 L56 205 M140 150 L144 205" stroke="#fff" stroke-width="3"/><text x="100" y="172" font-size="22" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial">10</text>'],

    // SOTTO
    ['flowershorts', 'bottom', 'Pantaloncini a fiori', '🌼', 'hawaii', p => path(SH.shorts, p(['flowers', '#ffd23f', '#e63946', '#fff']))],
    ['grassskirt', 'bottom', 'Gonna di paglia', '🌾', 'hawaii', p => path(grassHem(), p(['vstripes', '#a7c957', '#6a994e'])) + '<path d="M72 200 L128 200" stroke="#e63946" stroke-width="5"/>'],
    ['trousers', 'bottom', 'Pantaloni eleganti', '👔', 'classic', p => path(SH.pants, '#d6c6a8') + '<path d="M86 210 L86 352 M114 210 L114 352" stroke="rgba(0,0,0,.12)" stroke-width="1.5"/>'],
    ['pleated', 'bottom', 'Gonna scozzese', '🏫', 'classic', p => path(SH.skirt, p(['plaid', '#1d3557', '#e63946'])) + '<path d="M86 200 L80 262 M100 200 L100 264 M114 200 L120 262" stroke="rgba(0,0,0,.2)" stroke-width="1.2"/>'],
    ['dotskirt', 'bottom', 'Gonna lunga a pois', '🔴', 'classic', p => path(SH.longskirt, p(['dots', '#e63946', '#fff']))],
    ['leggings', 'bottom', 'Leggings fluo', '🌈', '80', p => path(SH.leggings, p(['stripes', '#00e5ff', '#ff2e88']))],
    ['jeans', 'bottom', 'Jeans a vita alta', '👖', '90', p => path(SH.pants, p(['denim', '#3a6ea5', '#2c5282'])) + '<path d="M72 206 L128 206" stroke="#2c5282" stroke-width="2"/><circle cx="100" cy="203" r="2" fill="#e9c46a"/>'],
    ['flare', 'bottom', 'Jeans a zampa', '🔔', '2000', p => path(SH.flare, p(['denim', '#7fb3e0', '#5b8fc7'])) + '<path d="M72 203 L128 203" stroke="#ff8fd8" stroke-width="4"/>'],
    ['jeansskirt', 'bottom', 'Minigonna di jeans', '💙', '2000', p => path(SH.skirt, p(['denim', '#3a6ea5', '#2c5282'])) + '<path d="M58 254 Q100 262 142 254" stroke="#e9c46a" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/>'],
    ['sportshorts', 'bottom', 'Pantaloncini sport', '🏃', 'sport', p => path(SH.shorts, '#1d3557') + '<path d="M72 200 L69 246 M128 200 L131 246" stroke="#fff" stroke-width="3"/>'],

    // VESTITI INTERI
    ['hawaiidress', 'dress', 'Vestito hawaiano', '🌺', 'hawaii', p => path(SH.teeSleeves, p(['flowers', '#2a9d8f', '#ffd23f', '#e63946'])) + path(SH.dress, p(['flowers', '#2a9d8f', '#ffd23f', '#e63946']))],
    ['blackdress', 'dress', 'Tubino nero', '🖤', 'classic', p => path(SH.gown.replace('L158 352 Q100 366 42 352', 'L140 270 Q100 278 60 270'), '#111') + '<path d="M74 198 L126 198" stroke="#ffd23f" stroke-width="2"/>'],
    ['puff80', 'dress', 'Vestito a sbuffo', '🎀', '80', p => path(SH.dress, p(['dots', '#ff2e88', '#fff'])) + `<circle cx="68" cy="128" r="13" fill="${p(['dots', '#ff2e88', '#fff'])}" ${OUT}/><circle cx="132" cy="128" r="13" fill="${p(['dots', '#ff2e88', '#fff'])}" ${OUT}/><path d="M72 198 L128 198" stroke="#00e5ff" stroke-width="6"/>`],
    ['tracksuit', 'dress', 'Tuta anni 80', '🕺', '80', p => path(SH.longSleeves, '#6a4cff') + path(SH.teeBody, '#6a4cff') + path(SH.pants, '#6a4cff') + '<path d="M60 135 L53 208 M140 135 L147 208 M75 205 L76 350 M125 205 L124 350" stroke="#ffd23f" stroke-width="3"/><path d="M100 116 L100 205" stroke="#ffd23f" stroke-width="2"/>'],
    ['overall', 'dress', 'Salopette di jeans', '🛹', '90', p => path(SH.teeSleeves, p(['stripes', '#fff', '#ff6f91'])) + path(SH.teeBody, p(['stripes', '#fff', '#ff6f91'])) + path(SH.pants, p(['denim', '#3a6ea5', '#2c5282'])) + path('M82 150 L118 150 L120 202 L80 202 Z', p(['denim', '#3a6ea5', '#2c5282'])) + '<path d="M84 152 L78 121 M116 152 L122 121" stroke="#2c5282" stroke-width="5"/><circle cx="85" cy="156" r="2.5" fill="#e9c46a"/><circle cx="115" cy="156" r="2.5" fill="#e9c46a"/>'],
    ['gown', 'dress', 'Abito da principessa', '👑', 'princess', p => path(SH.gown, p(['grad', '#ffb3e6', '#c084fc'])) + '<path d="M74 198 Q100 208 126 198" stroke="#ffd23f" stroke-width="4" fill="none"/>' + [[70, 290], [100, 320], [130, 290], [85, 250], [115, 250], [60, 335], [140, 335]].map(([x, y]) => `<polygon points="${starPath(x, y, 4)}" fill="#fff" opacity=".9"/>`).join('')],

    // SCARPE
    ['flip', 'shoes', 'Infradito', '🩴', 'hawaii', () => both('<ellipse cx="89" cy="363" rx="11" ry="3.5" fill="#ff7b00"/><path d="M82 358 L89 352 L96 358" stroke="#2a9d8f" stroke-width="2.6" fill="none"/>')],
    ['maryjane', 'shoes', 'Scarpe con cinturino', '👞', 'classic', () => both('<path d="M78 356 Q89 348 100 356 L100 364 Q89 368 78 364 Z" fill="#111"/><path d="M80 352 L98 352" stroke="#111" stroke-width="2.5"/>')],
    ['hightop', 'shoes', 'Sneakers alte', '👟', '80', () => both('<path d="M79 326 L99 326 L101 362 L77 362 Z" fill="#fff" stroke="#bbb"/><path d="M78 341 L100 341" stroke="#e63946" stroke-width="4"/><rect x="76" y="359" width="26" height="6" rx="2" fill="#e63946"/>')],
    ['boots', 'shoes', 'Anfibi', '🥾', '90', () => both('<path d="M78 300 L100 300 L101 360 L77 360 Z" fill="#1b1b1b"/><rect x="75" y="358" width="28" height="8" rx="2" fill="#333"/><path d="M84 310 L94 314 M84 320 L94 324 M84 330 L94 334 M84 340 L94 344" stroke="#bbb" stroke-width="1.5"/>')],
    ['platform', 'shoes', 'Zeppe platform', '👠', '2000', () => both('<path d="M78 350 Q89 343 100 350 L100 359 L78 359 Z" fill="#ff8fd8"/><rect x="76" y="358" width="26" height="10" rx="3" fill="#c084fc"/>')],
    ['sneakers', 'shoes', 'Scarpe da ginnastica', '👟', 'sport', () => both('<path d="M77 352 Q89 343 101 352 L102 362 L76 362 Z" fill="#2ec27e"/><rect x="75" y="360" width="28" height="5" rx="2" fill="#fff"/><path d="M84 350 L95 350" stroke="#fff" stroke-width="2"/>')],
    ['flats', 'shoes', 'Scarpette da principessa', '🥿', 'princess', () => both('<path d="M79 356 Q89 350 99 356 L99 363 Q89 366 79 363 Z" fill="#c084fc"/><polygon points="' + starPath(89, 354, 4) + '" fill="#ffd23f"/>')],

    // TESTA
    ['flowercrown', 'hat', 'Corona di fiori', '🌸', 'hawaii', () => [-160, -135, -110, -90, -70, -45, -20].map((a, i) => {
      const t = a * Math.PI / 180;
      return flowerAt(+(100 + 37 * Math.cos(t)).toFixed(1), +(64 + 33 * Math.sin(t)).toFixed(1), 4.2, ['#ff6f91', '#ffd23f', '#e63946', '#c084fc'][i % 4], '#fff');
    }).join('')],
    ['straw', 'hat', 'Cappello di paglia', '👒', 'hawaii', () => '<ellipse cx="100" cy="40" rx="62" ry="13" fill="#e9c46a" stroke="#b08a2e"/><path d="M70 40 Q70 8 100 8 Q130 8 130 40 Z" fill="#e9c46a" stroke="#b08a2e"/><path d="M70 33 Q100 39 130 33 L130 40 Q100 46 70 40 Z" fill="#e63946"/>'],
    ['beret', 'hat', 'Basco', '🎨', 'classic', () => '<ellipse cx="94" cy="36" rx="40" ry="15" fill="#c1121f" transform="rotate(-10 94 36)"/><rect x="92" y="18" width="4" height="8" fill="#c1121f"/>'],
    ['bow', 'hat', 'Fiocco', '🎀', 'classic', () => '<g transform="translate(126 36) rotate(15)"><path d="M0 0 L-17 -12 L-17 12 Z M0 0 L17 -12 L17 12 Z" fill="#ff4d6d" stroke="#c9184a"/><circle r="5" fill="#c9184a"/></g>'],
    ['headband', 'hat', 'Fascia fluo', '💪', '80', p => `<path d="M64 52 Q100 36 136 52 L136 60 Q100 44 64 60 Z" fill="${p(['zigzag', '#ff2e88', '#ffd23f'])}" ${OUT}/>`],
    ['cap', 'hat', 'Cappellino', '🧢', '90', () => '<path d="M64 52 Q64 18 100 18 Q136 18 136 52 Z" fill="#2a9d8f"/><path d="M100 48 Q130 46 156 54 L154 59 Q128 52 100 54 Z" fill="#264653"/><circle cx="100" cy="19" r="3" fill="#264653"/>'],
    ['bandana', 'hat', 'Bandana', '🏴', '2000', p => `<path d="M62 54 Q100 14 138 54 Q100 42 62 54 Z" fill="${p(['dots', '#c084fc', '#fff'])}" ${OUT}/><path d="M134 50 L150 60 L138 66 Z" fill="${p(['dots', '#c084fc', '#fff'])}" ${OUT}/>`],
    ['tiara', 'hat', 'Coroncina', '👑', 'princess', () => '<path d="M74 42 L80 22 L88 34 L100 12 L112 34 L120 22 L126 42 Z" fill="#ffd23f" stroke="#c99a00"/><circle cx="100" cy="27" r="3.5" fill="#e63946"/><circle cx="84" cy="36" r="2.5" fill="#00b4d8"/><circle cx="116" cy="36" r="2.5" fill="#00b4d8"/>'],

    // OCCHIALI
    ['round', 'glasses', 'Occhiali tondi', '👓', 'classic', () => '<circle cx="88" cy="76" r="10" fill="rgba(255,255,255,.25)" stroke="#5a3418" stroke-width="2.5"/><circle cx="112" cy="76" r="10" fill="rgba(255,255,255,.25)" stroke="#5a3418" stroke-width="2.5"/><path d="M98 75 Q100 72 102 75" stroke="#5a3418" stroke-width="2.5" fill="none"/>'],
    ['aviator', 'glasses', 'Occhiali a specchio', '🕶️', '80', p => `<path d="M77 70 Q88 66 98 70 Q98 87 88 87 Q77 87 77 70 Z" fill="${p(['grad', '#9ad0ff', '#ff8fd8'])}" stroke="#999" stroke-width="1.5"/><path d="M102 70 Q112 66 123 70 Q123 87 112 87 Q102 87 102 70 Z" fill="${p(['grad', '#9ad0ff', '#ff8fd8'])}" stroke="#999" stroke-width="1.5"/><path d="M98 71 L102 71" stroke="#999" stroke-width="2"/>`],
    ['slim', 'glasses', 'Occhialini', '😎', '90', () => '<ellipse cx="88" cy="76" rx="9" ry="4.5" fill="#222"/><ellipse cx="112" cy="76" rx="9" ry="4.5" fill="#222"/><path d="M97 76 L103 76" stroke="#222" stroke-width="2"/>'],
    ['heart', 'glasses', 'Occhiali a cuore', '💕', '2000', () => `<path d="${heartPath(88, 77)}" fill="rgba(255,77,141,.85)" stroke="#c2185b" stroke-width="1.5"/><path d="${heartPath(112, 77)}" fill="rgba(255,77,141,.85)" stroke="#c2185b" stroke-width="1.5"/><path d="M97 74 L103 74" stroke="#c2185b" stroke-width="2"/>`],
    ['star', 'glasses', 'Occhiali a stella', '⭐', 'princess', () => `<polygon points="${starPath(88, 76, 12)}" fill="rgba(255,210,63,.9)" stroke="#c99a00"/><polygon points="${starPath(112, 76, 12)}" fill="rgba(255,210,63,.9)" stroke="#c99a00"/>`],

    // ACCESSORI
    ['lei', 'acc', 'Collana di fiori', '🌺', 'hawaii', () => Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      return flowerAt(+(76 + 48 * t).toFixed(1), +(122 + 26 * Math.sin(Math.PI * t)).toFixed(1), 3.6, ['#ff6f91', '#ffd23f', '#e63946', '#c084fc'][i % 4], '#fff');
    }).join(''), 'neck'],
    ['ukulele', 'acc', 'Ukulele', '🎸', 'hawaii', () => '<g transform="rotate(-25 60 222)"><rect x="57" y="180" width="5" height="34" fill="#7a4a1c"/><circle cx="59.5" cy="222" r="9" fill="#c47a2c"/><circle cx="59.5" cy="236" r="12" fill="#c47a2c"/><circle cx="59.5" cy="230" r="3.2" fill="#5a3418"/><path d="M58 180 L58 238 M61 180 L61 238" stroke="#eee" stroke-width=".6"/></g>', 'hand'],
    ['pearls', 'acc', 'Collana di perle', '📿', 'classic', () => Array.from({ length: 11 }, (_, i) => {
      const t = i / 10;
      return `<circle cx="${(82 + 36 * t).toFixed(1)}" cy="${(121 + 15 * Math.sin(Math.PI * t)).toFixed(1)}" r="2.6" fill="#fffaf0" stroke="#ccc" stroke-width=".8"/>`;
    }).join(''), 'neck'],
    ['headphones', 'acc', 'Cuffie', '🎧', '80', () => '<path d="M64 76 Q62 24 100 24 Q138 24 136 76" stroke="#333" stroke-width="5" fill="none"/><rect x="57" y="66" width="13" height="22" rx="5" fill="#ff2e88" stroke="#333"/><rect x="130" y="66" width="13" height="22" rx="5" fill="#ff2e88" stroke="#333"/>', 'head'],
    ['choker', 'acc', 'Girocollo', '🖤', '90', () => '<rect x="92" y="108" width="16" height="5" rx="2" fill="#111"/><circle cx="100" cy="117" r="2.6" fill="#b388ff"/>', 'neck'],
    ['phone', 'acc', 'Cellulare a conchiglia', '📱', '2000', () => '<rect x="51" y="198" width="12" height="22" rx="2.5" fill="#d0d0d0" stroke="#777"/><rect x="53.5" y="201" width="7" height="7" fill="#7fdbff"/><circle cx="57" cy="214" r="1.5" fill="#777"/>', 'hand'],
    ['bag', 'acc', 'Borsetta glitter', '👛', '2000', p => `<path d="M136 222 Q141 208 148 222" stroke="#c084fc" stroke-width="2.5" fill="none"/><rect x="130" y="221" width="26" height="20" rx="5" fill="${p(['dots', '#c084fc', '#fff'])}" ${OUT}/><circle cx="143" cy="225" r="2" fill="#ffd23f"/>`, 'hand'],
    ['medal', 'acc', 'Medaglia d’oro', '🏅', 'sport', () => '<path d="M90 119 L100 150 L110 119" stroke="#1d3557" stroke-width="5" fill="none"/><circle cx="100" cy="156" r="8" fill="#ffd23f" stroke="#c99a00" stroke-width="1.5"/><text x="100" y="160" font-size="9" font-weight="800" text-anchor="middle" fill="#c99a00" font-family="Arial">1</text>', 'neck'],
  ];

  /* ---------- sfondi ---------- */
  const BGS = [
    ['beach', 'Spiaggia hawaiana', '🏝️', 'hawaii', p => `<rect width="200" height="380" fill="${p(['grad', '#4fc3f7', '#e1f5fe'])}"/><circle cx="160" cy="58" r="22" fill="#ffd23f"/><rect y="250" width="200" height="40" fill="#1e88e5"/><path d="M0 252 Q25 246 50 252 T100 252 T150 252 T200 252" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/><rect y="286" width="200" height="94" fill="#f4d58d"/><path d="M28 300 Q24 220 40 160" stroke="#8d5a32" stroke-width="7" fill="none"/>${[-170, -130, -95, -55, -15, 25].map(a => `<ellipse cx="60" cy="160" rx="22" ry="6" fill="#2d6a4f" transform="rotate(${a} 40 160)"/>`).join('')}`],
    ['paris', 'Parigi', '🗼', 'classic', p => `<rect width="200" height="380" fill="${p(['grad', '#ffd6e7', '#fff1f6'])}"/><path d="M168 60 L174 60 L196 300 L184 300 Q171 250 158 300 L146 300 Z" fill="#8d6e63" opacity=".45"/><path d="M156 200 L186 200 M162 140 L180 140" stroke="#8d6e63" stroke-width="3" opacity=".45"/><rect y="300" width="200" height="80" fill="#e8d5c4"/><circle cx="30" cy="60" r="14" fill="#fff" opacity=".8"/><circle cx="44" cy="58" r="10" fill="#fff" opacity=".8"/>`],
    ['neon', 'Neon anni 80', '🌆', '80', p => `<rect width="200" height="380" fill="#1a0b3a"/><circle cx="100" cy="175" r="52" fill="${p(['grad', '#ffd23f', '#ff2e88'])}"/>${[182, 192, 202].map(y => `<rect x="40" y="${y}" width="120" height="${(y - 175) / 6}" fill="#1a0b3a"/>`).join('')}<rect y="225" width="200" height="155" fill="#1a0b3a"/>${[230, 240, 254, 274, 300, 334, 376].map(y => `<path d="M0 ${y} L200 ${y}" stroke="#ff2e88" stroke-width="1.5"/>`).join('')}${[-200, -120, -60, -20, 20, 60, 120, 200].map(x => `<path d="M100 225 L${100 + x * 1.6} 380" stroke="#00e5ff" stroke-width="1.5"/>`).join('')}`],
    ['memphis', 'Pop anni 90', '🎨', '90', () => `<rect width="200" height="380" fill="#a0e7e5"/><polygon points="20,40 45,20 50,55" fill="#ff6f91"/><circle cx="170" cy="40" r="16" fill="#ffd23f"/><path d="M130 110 q10 -12 20 0 t20 0 t20 0" stroke="#6a4cff" stroke-width="4" fill="none"/><path d="M10 160 q10 -12 20 0 t20 0" stroke="#ff6f91" stroke-width="4" fill="none"/><rect x="160" y="200" width="24" height="24" fill="#6a4cff" transform="rotate(20 172 212)"/><polygon points="20,260 40,240 46,272" fill="#ffd23f"/><circle cx="30" cy="110" r="7" fill="none" stroke="#2a9d8f" stroke-width="3"/><circle cx="180" cy="300" r="10" fill="#ff6f91"/><rect y="320" width="200" height="60" fill="#f4f1de"/>${Array.from({ length: 20 }, (_, i) => `<circle cx="${(i * 37) % 200}" cy="${330 + (i * 13) % 45}" r="2" fill="#264653"/>`).join('')}`],
    ['y2k', 'Glitter anni 2000', '💖', '2000', p => `<rect width="200" height="380" fill="${p(['grad', '#ff9ad5', '#c084fc'])}"/>${[[30, 40], [170, 70], [40, 200], [165, 230], [100, 30], [25, 320], [180, 340]].map(([x, y], i) => i % 2 ? `<path d="${heartPath(x, y)}" fill="#fff" opacity=".6"/>` : `<path d="M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z" fill="#fff" opacity=".85"/>`).join('')}`],
    ['runway', 'Passerella', '✨', 'princess', () => `<rect width="200" height="380" fill="#1b1033"/><polygon points="40,0 70,0 120,380 0,380" fill="#fff" opacity=".08"/><polygon points="130,0 160,0 200,380 80,380" fill="#fff" opacity=".08"/><polygon points="70,250 130,250 170,380 30,380" fill="#3d2470"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${8 + i * 17}" cy="${232 + (i % 2) * 4}" r="7" fill="#0d0820"/>`).join('')}`],
    ['room', 'Cameretta', '🏠', 'sport', () => '<rect width="200" height="380" fill="#ffe8d6"/><rect y="300" width="200" height="80" fill="#d4a373"/><rect x="18" y="50" width="56" height="64" rx="4" fill="#a2d2ff" stroke="#fff" stroke-width="5"/><path d="M46 50 L46 114 M18 82 L74 82" stroke="#fff" stroke-width="4"/><rect x="138" y="60" width="44" height="56" fill="#ff8fab" transform="rotate(4 160 88)"/><polygon points="' + starPath(160, 88, 14) + '" fill="#ffd23f" transform="rotate(4 160 88)"/>'],
  ];

  const ITEMS = {};
  LIST.forEach(([id, cat, name, icon, theme, draw, layer]) => { ITEMS[id] = { id, cat, name, icon, theme, draw, layer }; });
  BGS.forEach(([id, name, icon, theme, draw]) => { ITEMS[id] = { id, cat: 'bg', name, icon, theme, draw }; });

  const LOOKS = {
    hawaii: { doll: null, top: 'hawaiishirt', bottom: 'flowershorts', shoes: 'flip', hat: 'flowercrown', acc: 'lei', bg: 'beach' },
    classic: { dress: 'blackdress', shoes: 'maryjane', hat: 'beret', acc: 'pearls', glasses: 'round', bg: 'paris' },
    '80': { top: 'jacket80', bottom: 'leggings', shoes: 'hightop', hat: 'headband', glasses: 'aviator', acc: 'headphones', bg: 'neon' },
    '90': { top: 'plaid', bottom: 'jeans', shoes: 'boots', hat: 'cap', glasses: 'slim', acc: 'choker', bg: 'memphis' },
    '2000': { top: 'croptop', bottom: 'flare', shoes: 'platform', hat: 'bandana', glasses: 'heart', acc: 'bag', bg: 'y2k' },
    princess: { dress: 'gown', shoes: 'flats', hat: 'tiara', glasses: 'star', acc: 'pearls', bg: 'runway' },
    sport: { top: 'sporthoodie', bottom: 'sportshorts', shoes: 'sneakers', hat: 'cap', acc: 'medal', bg: 'room' },
  };

  const SLOTS = ['top', 'bottom', 'dress', 'shoes', 'hat', 'glasses', 'acc', 'bg'];

  /* ---------- composizione dell'SVG ---------- */
  function svg(st, size) {
    const reg = registry(), p = reg.paint;
    const d = DOLLS[st.doll];
    const it = k => (st[k] ? ITEMS[st[k]] : null);
    const acc = it('acc');
    let s = '';
    s += it('bg') ? it('bg').draw(p) : '<rect width="200" height="380" fill="#efe9ff"/>';
    s += '<ellipse cx="100" cy="368" rx="44" ry="7" fill="rgba(0,0,0,.18)"/>';
    s += hairBack(d) + body(d);
    if (it('shoes')) s += it('shoes').draw(p);
    if (it('dress')) s += it('dress').draw(p);
    else { if (it('bottom')) s += it('bottom').draw(p); if (it('top')) s += it('top').draw(p); }
    if (acc && acc.layer === 'neck') s += acc.draw(p);
    s += hands(d);
    if (acc && acc.layer === 'hand') s += acc.draw(p);
    s += head(d) + face(d) + hairFront(d);
    if (it('glasses')) s += it('glasses').draw(p);
    if (it('hat')) s += it('hat').draw(p);
    if (acc && acc.layer === 'head') s += acc.draw(p);
    const wh = size ? `width="${size[0]}" height="${size[1]}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 380" ${wh} preserveAspectRatio="xMidYMid meet"><defs>${reg.defs()}</defs>${s}</svg>`;
  }

  function headSVG(id) {
    const d = DOLLS[id];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="36 4 128 128">${hairBack(d)}<rect x="93" y="98" width="14" height="30" fill="${d.skin}"/>${head(d)}${face(d)}${hairFront(d)}</svg>`;
  }

  return { THEMES, DOLLS, ITEMS, LOOKS, SLOTS, svg, headSVG };
})();

App.register({
  id: 'vesti',
  title: 'Vesti la Bambola',
  desc: 'Scegli una bambola e vestila in stile Hawaii, classico, anni 80, 90 o 2000. Poi fai la foto e condividila!',
  color: '#ff4fa3',
  duration: null,
  art: () => `<span class="dress-art">${Dress.headSVG('luna')}</span><span class="emo">👗</span>`,
  stars: p => (p >= 150 ? 3 : p >= 90 ? 2 : p >= 30 ? 1 : 0),

  start(ctx) {
    const { THEMES, DOLLS, ITEMS, LOOKS, SLOTS } = Dress;
    const st = { doll: 'sofia', top: null, bottom: null, dress: null, shoes: null, hat: null, glasses: null, acc: null, bg: null };
    let tab = 'doll', bestTheme = null, bestCount = 0, shotUrl = null;

    const TABS = [
      ['doll', '👧 Bambole'], ['look', '✨ Look'], ['top', '👕 Sopra'], ['bottom', '👖 Sotto'], ['dress', '👗 Vestiti'],
      ['shoes', '👟 Scarpe'], ['hat', '🎩 Testa'], ['glasses', '🕶️ Occhiali'], ['acc', '💎 Accessori'], ['bg', '🏝️ Sfondi'],
    ];

    const box = U.el('div', 'dress', `
      <div class="dress-view"><div class="dress-doll"></div></div>
      <div class="dress-tabs"></div>
      <div class="dress-items"></div>
      <div class="dress-actions">
        <button class="btn alt" data-a="random">🎲 Sorpresa</button>
        <button class="btn alt" data-a="clear">🧹 Svesti</button>
        <button class="btn" data-a="photo">📸 Foto</button>
        <button class="btn" data-a="done">✅ Fine</button>
      </div>`);
    ctx.stage.appendChild(box);
    const view = box.querySelector('.dress-doll');
    const tabs = box.querySelector('.dress-tabs');
    const items = box.querySelector('.dress-items');

    TABS.forEach(([id, label]) => {
      const b = U.el('button', 'dress-tab', label);
      b.dataset.t = id;
      b.onclick = () => { tab = id; Sound.pop(); renderTabs(); renderItems(); };
      tabs.appendChild(b);
    });

    const worn = () => SLOTS.filter(k => st[k]).map(k => ITEMS[st[k]]);

    function score() {
      const list = worn();
      const count = {};
      list.forEach(i => { count[i.theme] = (count[i.theme] || 0) + 1; });
      let theme = null, n = 0;
      for (const [k, v] of Object.entries(count)) if (v > n) { theme = k; n = v; }
      const clothes = list.filter(i => i.cat !== 'bg').length;
      const bonus = n >= 3 ? 30 * (n - 2) : 0;
      return { points: clothes * 10 + (st.bg ? 5 : 0) + bonus, theme: n >= 3 ? theme : null, n, clothes };
    }

    function update(fromUser) {
      view.innerHTML = Dress.svg(st);
      const sc = score();
      ctx.add(sc.points - ctx.points);
      if (fromUser && sc.theme && (sc.theme !== bestTheme || sc.n > bestCount)) {
        ctx.popup(`Stile ${THEMES[sc.theme].label}! ✨`, ctx.stage.clientWidth / 2, ctx.stage.clientHeight * 0.3, 'gold');
        if (sc.n >= 5) Sound.win(); else Sound.good();
      }
      bestTheme = sc.theme; bestCount = sc.theme ? sc.n : 0;
      ctx.info(`👗 ${sc.clothes} capi${sc.theme ? ' · ' + THEMES[sc.theme].label : ''}`);
      renderItems();
    }

    function renderTabs() {
      tabs.querySelectorAll('.dress-tab').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    }

    function itemBtn(html, on, color, onClick) {
      const b = U.el('button', 'dress-item' + (on ? ' on' : ''), html);
      if (color) b.style.setProperty('--tc', color);
      b.onclick = onClick;
      items.appendChild(b);
    }

    function renderItems() {
      const keep = items.scrollLeft;
      items.innerHTML = '';
      if (tab === 'doll') {
        Object.entries(DOLLS).forEach(([id, d]) => itemBtn(
          `<span class="di-face">${Dress.headSVG(id)}</span><span class="di-name">${d.name}</span>`,
          st.doll === id, null, () => { st.doll = id; Sound.pop(); update(true); }));
      } else if (tab === 'look') {
        Object.entries(LOOKS).forEach(([id, look]) => itemBtn(
          `<span class="di-ico">${THEMES[id].label.split(' ')[0]}</span><span class="di-name">${THEMES[id].label.split(' ').slice(1).join(' ')}</span>`,
          false, THEMES[id].color, () => {
            SLOTS.forEach(k => { st[k] = look[k] || null; });
            Sound.pop();
            update(true);
          }));
      } else {
        Object.values(ITEMS).filter(i => i.cat === tab).forEach(i => itemBtn(
          `<span class="di-ico">${i.icon}</span><span class="di-name">${i.name}</span><i class="di-tag">${THEMES[i.theme].label}</i>`,
          st[tab] === i.id, THEMES[i.theme].color, () => {
            if (st[tab] === i.id) st[tab] = null;
            else {
              st[tab] = i.id;
              if (tab === 'dress') { st.top = null; st.bottom = null; }
              if (tab === 'top' || tab === 'bottom') st.dress = null;
            }
            Sound.pop();
            update(true);
          }));
      }
      items.scrollLeft = keep;
    }

    function surprise() {
      if (Math.random() < 0.5) {
        const look = LOOKS[U.pick(Object.keys(LOOKS))];
        SLOTS.forEach(k => { st[k] = look[k] || null; });
      } else {
        const pickCat = c => U.pick(Object.values(ITEMS).filter(i => i.cat === c)).id;
        SLOTS.forEach(k => { st[k] = null; });
        if (Math.random() < 0.3) st.dress = pickCat('dress');
        else { st.top = pickCat('top'); st.bottom = pickCat('bottom'); }
        ['shoes', 'hat', 'glasses', 'acc', 'bg'].forEach(k => { if (Math.random() < 0.7) st[k] = pickCat(k); });
      }
      if (Math.random() < 0.4) st.doll = U.pick(Object.keys(DOLLS));
      Sound.good();
      update(true);
    }

    /* ---------- foto da condividere ---------- */
    async function makePhoto() {
      const W = 720, H = 1368, BAND = 150;
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(Dress.svg(st, [W, H]));
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const c = document.createElement('canvas');
      c.width = W; c.height = H + BAND;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0, W, H);
      g.fillStyle = '#2a1458';
      g.fillRect(0, H, W, BAND);
      const sc = score();
      g.textAlign = 'center';
      g.fillStyle = '#ffd23f';
      g.font = "800 50px 'Baloo 2', 'Trebuchet MS', sans-serif";
      g.fillText(`✨ ${DOLLS[st.doll].name}${sc.theme ? ' · ' + THEMES[sc.theme].label : ''}`, W / 2, H + 66);
      g.fillStyle = '#fff';
      g.font = "700 32px 'Baloo 2', 'Trebuchet MS', sans-serif";
      g.fillText(`Look creato da ${App.playerName()} · Sala Giochi dei Nipoti`, W / 2, H + 116);
      return new Promise(res => c.toBlob(res, 'image/png'));
    }

    async function photo() {
      Sound.tone(1400, 0.08, 'square', 0.06);
      const flash = U.el('div', 'dress-flash');
      ctx.stage.appendChild(flash);
      setTimeout(() => flash.remove(), 400);
      let blob;
      try { blob = await makePhoto(); } catch (e) { blob = null; }
      if (!blob) { ctx.popup('Ops, foto non riuscita', ctx.stage.clientWidth / 2, ctx.stage.clientHeight / 2, 'bad'); return; }
      if (shotUrl) URL.revokeObjectURL(shotUrl);
      shotUrl = URL.createObjectURL(blob);
      const file = new File([blob], 'il-mio-look.png', { type: 'image/png' });
      const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
      const m = U.el('div', 'intro', `
        <div class="intro-card dress-shot-card">
          <img class="dress-shot" src="${shotUrl}" alt="Il mio look">
          <div class="intro-btns">
            ${canShare ? '<button class="btn big" data-s="share">📤 Condividi</button>' : ''}
            <a class="btn ${canShare ? 'alt' : 'big'}" href="${shotUrl}" download="il-mio-look.png">💾 Salva la foto</a>
            <button class="btn alt" data-s="close">↩️ Torna a vestire</button>
          </div>
          <p class="dress-hint">Puoi anche tenere premuto sulla foto per salvarla.</p>
        </div>`);
      ctx.stage.appendChild(m);
      const sh = m.querySelector('[data-s="share"]');
      if (sh) sh.onclick = () => { navigator.share({ files: [file], title: 'Il mio look', text: 'Guarda il mio look! ✨' }).catch(() => {}); };
      m.querySelector('[data-s="close"]').onclick = () => { m.remove(); Sound.pop(); };
    }

    box.querySelector('.dress-actions').addEventListener('click', ev => {
      const a = ev.target.closest('[data-a]');
      if (!a) return;
      const act = a.dataset.a;
      if (act === 'random') surprise();
      if (act === 'clear') { SLOTS.forEach(k => { st[k] = null; }); Sound.pop(); update(false); }
      if (act === 'photo') photo();
      if (act === 'done') {
        const sc = score();
        ctx.end({
          title: 'Che stile! ✨',
          msg: `${DOLLS[st.doll].name} indossa <b>${sc.clothes}</b> capi${sc.theme ? `<br>Look <b>${THEMES[sc.theme].label}</b>` : ''}`,
        });
      }
    });

    renderTabs();
    update(false);

    ctx.intro({
      title: 'Vesti la Bambola',
      art: `<span class="dress-art big">${Dress.headSVG('sofia')}</span><span class="dress-art big">${Dress.headSVG('aisha')}</span><span class="dress-art big">${Dress.headSVG('leo')}</span>`,
      text: 'Scegli una bambola e vestila come vuoi! Ogni capo vale <b>10 punti</b>; se ne metti almeno 3 dello stesso stile (Hawaii, Classico, Anni 80, 90, 2000...) prendi il <b>bonus stile</b>. Poi premi <b>📸 Foto</b> per salvare o condividere il tuo look!',
    }, () => ctx.begin());

    return { stop() { if (shotUrl) URL.revokeObjectURL(shotUrl); } };
  },
});
