'use strict';
/*
 * Personaggi disegnati in SVG (nessuna immagine esterna).
 *  - Sonic: il riccio blu più veloce del mondo
 *  - Le Huntrix: Rumi, Mira e Zoey, cantanti che cacciano i demoni
 *  - I Saja Boys: Jinu, Abby, Mystery, Romance e Baby, la band dei demoni
 *  - Derpy: la tigre blu amica delle Huntrix
 */
const Chars = (() => {
  const SKIN = '#ffdcc2';
  const PALE = '#f6e6dc';
  const wrap = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${inner}</svg>`;

  function star(cx, cy, r, fill) {
    let p = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.45 : r;
      p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `;
    }
    return `<polygon points="${p}" fill="${fill}" stroke="#b8860b" stroke-width="1"/>`;
  }

  function hedgehog() {
    const B = '#1f6fe5', D = '#123f9c';
    return wrap(`
      <g fill="${B}" stroke="${D}" stroke-width="2.5" stroke-linejoin="round">
        <path d="M48 34 L4 16 L40 54 Z"/>
        <path d="M36 58 L0 66 L38 80 Z"/>
        <path d="M42 84 L8 110 L58 96 Z"/>
        <path d="M54 30 L42 2 L78 26 Z"/>
        <path d="M78 32 L98 8 L100 46 Z"/>
        <circle cx="64" cy="64" r="38"/>
      </g>
      <path d="M86 32 L95 18 L96 40 Z" fill="#f4a3b4"/>
      <ellipse cx="78" cy="86" rx="27" ry="17" fill="#f8d39e"/>
      <ellipse cx="68" cy="56" rx="11" ry="15" fill="#fff" stroke="#122" stroke-width="2.5"/>
      <ellipse cx="89" cy="56" rx="11" ry="15" fill="#fff" stroke="#122" stroke-width="2.5"/>
      <ellipse cx="68" cy="56" rx="9.8" ry="13.8" fill="#fff"/>
      <ellipse cx="89" cy="56" rx="9.8" ry="13.8" fill="#fff"/>
      <ellipse cx="72" cy="59" rx="5" ry="8" fill="#19a33f"/>
      <ellipse cx="93" cy="59" rx="5" ry="8" fill="#19a33f"/>
      <ellipse cx="73" cy="60" rx="2.5" ry="4.5" fill="#111"/>
      <ellipse cx="94" cy="60" rx="2.5" ry="4.5" fill="#111"/>
      <circle cx="71" cy="55" r="1.8" fill="#fff"/>
      <circle cx="92" cy="55" r="1.8" fill="#fff"/>
      <path d="M58 44 L78 48 M82 47 L98 44" stroke="${D}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="100" cy="76" rx="7" ry="5.5" fill="#111"/>
      <circle cx="98" cy="74" r="1.8" fill="#666"/>
      <path d="M70 90 Q86 102 100 87" stroke="#5a2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M96 89 L101 85" stroke="#5a2a1a" stroke-width="3" stroke-linecap="round"/>
    `);
  }

  function singer({ hair, outfit, eye, style, acc }) {
    let back = '', bangs = '', extra = '';
    if (style === 'braid') {
      back = `<path d="M28 62 Q24 16 60 18 Q96 16 92 62 L90 76 Q60 72 30 76 Z" fill="${hair}"/>`;
      bangs = `<path d="M32 58 Q30 20 60 21 Q90 20 88 58 Q82 36 66 34 Q68 46 56 48 Q48 36 32 58 Z" fill="${hair}"/>`;
      extra = [72, 86, 100].map((y, i) => `<ellipse cx="${89 + i * 2}" cy="${y}" rx="8" ry="8.5" fill="${hair}" stroke="#4b2a7a" stroke-width="1.5"/>`).join('')
        + `<rect x="88" y="106" width="12" height="5" rx="2" fill="#ffd23f"/><path d="M90 111 L94 119 L98 111 Z" fill="${hair}"/>`;
    } else if (style === 'long') {
      back = `<path d="M28 58 Q24 16 60 18 Q96 16 92 58 L100 114 Q60 122 20 114 Z" fill="${hair}"/>`;
      bangs = `<path d="M33 60 Q30 20 60 21 Q90 20 87 60 Q80 32 58 33 Q46 40 33 60 Z" fill="${hair}"/>`;
    } else {
      back = `<path d="M26 66 Q22 14 60 16 Q98 14 94 66 L94 86 Q84 92 78 82 L42 82 Q36 92 26 86 Z" fill="${hair}"/>`;
      bangs = `<path d="M31 54 Q31 20 60 20 Q89 20 89 54 L81 46 L73 52 L65 45 L57 52 L49 45 L41 52 Z" fill="${hair}"/>`;
      extra = `<circle cx="34" cy="26" r="9" fill="${hair}"/><circle cx="86" cy="26" r="9" fill="${hair}"/>`;
    }
    let accessory = '';
    if (acc === 'star') accessory = star(85, 40, 8, '#ffd23f');
    if (acc === 'earring') accessory = star(34, 78, 5, '#ffd23f');
    if (acc === 'mic') accessory = `<path d="M33 66 Q36 82 48 80" stroke="#333" stroke-width="2.5" fill="none"/><circle cx="49" cy="80" r="3" fill="#333"/>`;
    return wrap(`
      ${back}
      <path d="M24 120 Q28 97 60 95 Q92 97 96 120 Z" fill="${outfit}"/>
      <path d="M48 96 L60 108 L72 96" stroke="#ffd23f" stroke-width="2.5" fill="none"/>
      <rect x="53" y="84" width="14" height="13" fill="${SKIN}"/>
      <ellipse cx="60" cy="60" rx="27" ry="30" fill="${SKIN}"/>
      ${bangs}
      <ellipse cx="49" cy="63" rx="4.6" ry="6.2" fill="${eye}"/>
      <ellipse cx="71" cy="63" rx="4.6" ry="6.2" fill="${eye}"/>
      <circle cx="50.6" cy="61" r="1.7" fill="#fff"/>
      <circle cx="72.6" cy="61" r="1.7" fill="#fff"/>
      <path d="M43 58 Q49 54 55 58 M65 58 Q71 54 77 58" stroke="#222" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="42" cy="73" r="4" fill="#ff8fa3" opacity=".55"/>
      <circle cx="78" cy="73" r="4" fill="#ff8fa3" opacity=".55"/>
      <path d="M53 77 Q60 84 67 77" stroke="#d6336c" stroke-width="2.6" fill="#ff6b8b" stroke-linecap="round"/>
      ${extra}
      ${accessory}
    `);
  }

  function boy({ accent, acc }) {
    const H = '#1b1b2f';
    const horns = acc === 'hat' ? '' : `<path d="M40 30 L34 6 L52 24 Z M80 30 L86 6 L68 24 Z" fill="${accent}" stroke="#222" stroke-width="1.5"/>`;
    let accessory = '';
    let rightEye = `<path d="M64 63 Q71 57 78 63 Q71 67 64 63 Z" fill="${accent}"/><circle cx="71" cy="62.5" r="2" fill="#111"/>`;
    if (acc === 'hat') {
      accessory = `<path d="M38 34 Q40 8 60 8 Q80 8 82 34 Z" fill="#111"/><rect x="38" y="27" width="44" height="6" fill="${accent}"/><path d="M20 36 Q60 26 100 36 L100 40 Q60 32 20 40 Z" fill="#111"/>`;
    } else if (acc === 'band') {
      accessory = `<rect x="29" y="36" width="62" height="8" rx="4" fill="${accent}"/><path d="M30 40 L18 34 L20 46 Z" fill="${accent}"/>`;
    } else if (acc === 'mask') {
      accessory = `<path d="M60 52 Q80 46 90 54 L88 70 Q74 76 60 69 Z" fill="#f2f2f2" stroke="#999" stroke-width="1.5"/><path d="M66 61 Q73 57 80 61" stroke="#555" stroke-width="2" fill="none"/>`;
      rightEye = '';
    } else if (acc === 'rose') {
      accessory = `<circle cx="40" cy="106" r="6" fill="#e63946"/><path d="M37 104 Q40 101 43 105" stroke="#9d0208" stroke-width="1.5" fill="none"/><path d="M40 112 L36 119" stroke="#2d6a4f" stroke-width="2.5"/>`;
    } else if (acc === 'cap') {
      accessory = `<path d="M30 40 Q30 16 60 16 Q90 16 90 40 Z" fill="${accent}"/><path d="M84 36 L108 40 L88 44 Z" fill="${accent}"/><circle cx="60" cy="17" r="3" fill="#fff"/>`;
    }
    return wrap(`
      ${horns}
      <path d="M22 120 Q26 96 60 94 Q94 96 98 120 Z" fill="#15151f"/>
      <path d="M50 95 L60 112 L70 95 Z" fill="${accent}"/>
      <rect x="53" y="84" width="14" height="12" fill="${PALE}"/>
      <ellipse cx="60" cy="60" rx="27" ry="30" fill="${PALE}"/>
      <path d="M30 62 Q24 18 62 19 Q98 22 90 62 Q86 42 74 38 Q62 50 40 44 Q34 50 30 62 Z" fill="${H}"/>
      <path d="M62 36 Q50 52 46 62 Q58 50 68 40 Z" fill="${H}"/>
      <path d="M42 63 Q49 57 56 63 Q49 67 42 63 Z" fill="${accent}"/>
      <circle cx="49" cy="62.5" r="2" fill="#111"/>
      ${rightEye}
      <path d="M41 55 L55 58 M79 55 L65 58" stroke="#222" stroke-width="3" stroke-linecap="round"/>
      <path d="M52 77 Q62 81 69 74" stroke="#7a2b3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      ${accessory}
    `);
  }

  function tiger() {
    const B = '#3d7bff', S = '#1d3f8f';
    return wrap(`
      <circle cx="30" cy="32" r="14" fill="${B}" stroke="${S}" stroke-width="2"/>
      <circle cx="90" cy="32" r="14" fill="${B}" stroke="${S}" stroke-width="2"/>
      <circle cx="30" cy="32" r="7" fill="#ffc2d1"/>
      <circle cx="90" cy="32" r="7" fill="#ffc2d1"/>
      <ellipse cx="60" cy="66" rx="44" ry="40" fill="${B}" stroke="${S}" stroke-width="2"/>
      <path d="M60 28 L54 42 L66 42 Z M20 62 L34 64 L22 72 Z M100 62 L86 64 L98 72 Z" fill="${S}"/>
      <ellipse cx="60" cy="84" rx="24" ry="17" fill="#fff"/>
      <circle cx="44" cy="58" r="12" fill="#fff" stroke="#222" stroke-width="2"/>
      <circle cx="77" cy="56" r="9" fill="#fff" stroke="#222" stroke-width="2"/>
      <circle cx="47" cy="61" r="5" fill="#111"/>
      <circle cx="75" cy="55" r="4" fill="#111"/>
      <ellipse cx="60" cy="76" rx="7" ry="5" fill="#ff6b9a"/>
      <path d="M50 86 Q60 94 70 86" stroke="#222" stroke-width="2.5" fill="none"/>
      <path d="M62 89 Q66 100 72 90" fill="#ff6b9a" stroke="#d6336c" stroke-width="1.5"/>
    `);
  }

  const LIST = {
    sonic: { name: 'Sonic', group: 'Il riccio blu', svg: hedgehog() },
    rumi:   { name: 'Rumi', group: 'Huntrix', svg: singer({ hair: '#7b3fe4', outfit: '#5a189a', eye: '#d4a017', style: 'braid', acc: 'earring' }) },
    mira:   { name: 'Mira', group: 'Huntrix', svg: singer({ hair: '#8b1e3f', outfit: '#d00000', eye: '#3a2a1a', style: 'long', acc: 'star' }) },
    zoey:    { name: 'Zoey', group: 'Huntrix', svg: singer({ hair: '#16161d', outfit: '#0096c7', eye: '#3a2a1a', style: 'bob', acc: 'mic' }) },
    jinu:   { name: 'Jinu', group: 'Saja Boys', svg: boy({ accent: '#ffc300', acc: 'hat' }) },
    abby:    { name: 'Abby', group: 'Saja Boys', svg: boy({ accent: '#ff4d4d', acc: 'band' }) },
    mystery:  { name: 'Mystery', group: 'Saja Boys', svg: boy({ accent: '#b388ff', acc: 'mask' }) },
    romance:  { name: 'Romance', group: 'Saja Boys', svg: boy({ accent: '#ff6fb5', acc: 'rose' }) },
    baby:   { name: 'Baby', group: 'Saja Boys', svg: boy({ accent: '#4dd0ff', acc: 'cap' }) },
    derpy:  { name: 'Derpy', group: 'La tigre blu', svg: tiger() },
  };

  const urls = {};
  const images = {};
  function url(id) {
    if (!urls[id]) urls[id] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(LIST[id].svg);
    return urls[id];
  }
  function img(id, cls = '') {
    return `<img class="ch ${cls}" src="${url(id)}" alt="${LIST[id].name}" draggable="false">`;
  }
  function image(id) {
    if (!images[id]) { images[id] = new Image(); images[id].src = url(id); }
    return images[id];
  }

  return {
    ids: Object.keys(LIST),
    boys: ['jinu', 'abby', 'mystery', 'romance', 'baby'],
    girls: ['rumi', 'mira', 'zoey'],
    name: id => LIST[id].name,
    group: id => LIST[id].group,
    url, img, image,
  };
})();
