
(function () {
  'use strict';

  const S = 'fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
  const A = 'fill="none" stroke="var(--acc)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  const AD = 'fill="var(--acc)"';
  const M = 'fill="none" stroke="var(--muted)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"';
  const TXT = 'font-family="STIX Two Text", Georgia, serif';
  const t = (x, y, str, cls = 'fill="var(--ink)"', size = 8) =>
    `<text x="${x}" y="${y}" ${TXT} font-size="${size}" ${cls} text-anchor="middle" direction="ltr">${str}</text>`;
  const circ = (x, y, r, stroke = A, fill = 'fill="none"') =>
    `<circle cx="${x}" cy="${y}" r="${r}" ${stroke} ${fill}/>`;
  const node = (x, y, label, acc = true, r = 8) => {
    const s = acc ? A : M;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--card)" ${s}/>${t(x, y + 2.8, label, acc ? 'fill="var(--acc)"' : 'fill="var(--muted)"', 7.5)}`;
  };
  const edge = (x1, y1, x2, y2, acc = false) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${acc ? A : M}/>`;
  const wrap = inner => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:100%;height:100%;display:block">${inner}</svg>`;

  const algo = () => `
    <rect x="10" y="8" width="80" height="84" rx="6" ${M}/>
    <line x1="10" y1="20" x2="90" y2="20" ${M}/>
    <circle cx="20" cy="14" r="1.6" fill="var(--acc)"/><circle cx="27" cy="14" r="1.6" fill="var(--muted)"/><circle cx="34" cy="14" r="1.6" fill="var(--muted)"/>
    <line x1="18" y1="30" x2="58" y2="30" ${A}/>
    <line x1="18" y1="40" x2="80" y2="40" ${M}/>
    <line x1="26" y1="50" x2="70" y2="50" ${M}/>
    <line x1="26" y1="60" x2="46" y2="60" ${A}/>
    <line x1="18" y1="70" x2="64" y2="70" ${M}/>
    <line x1="18" y1="80" x2="40" y2="80" ${M}/>`;

  const recursion = () => `
    ${edge(50, 18, 32, 40)}${edge(50, 18, 68, 40)}
    ${edge(32, 40, 20, 64)}${edge(32, 40, 42, 64)}${edge(68, 40, 58, 64)}${edge(68, 40, 80, 64)}
    ${node(50, 16, 'f(n)')}
    ${node(32, 42, 'f(n/2)', true)}${node(68, 42, 'f(n/2)', true)}
    ${node(20, 66, 'f(1)', false, 6.5)}${node(42, 66, 'f(1)', false, 6.5)}${node(58, 66, 'f(1)', false, 6.5)}${node(80, 66, 'f(1)', false, 6.5)}
    <path d="M14 84 C 30 74, 46 90, 60 80 S 88 78, 90 86" ${M}/>
    ${t(50, 94, 'T(n) = 2T(n/2) + n', 'fill="var(--muted)"', 6.5)}`;

  const asymptotics = () => `
    <line x1="14" y1="86" x2="92" y2="86" ${M}/><line x1="14" y1="86" x2="14" y2="10" ${M}/>
    <path d="M14 86 C 40 84, 60 70, 92 30" ${A}/>${t(88, 27, 'n', 'fill="var(--acc)"')}
    <path d="M14 84 C 50 82, 62 66, 92 46" ${M}/>${t(88, 43, 'log n', 'fill="var(--muted)"')}
    <line x1="14" y1="60" x2="92" y2="60" ${M}/>${t(88, 57, 'c', 'fill="var(--muted)"')}
    <path d="M20 92 C 24 80, 34 80, 38 88" ${M}/>
    ${t(29, 96, 'n → ∞', 'fill="var(--ink)"', 6)}`;

  const adt = () => `
    <rect x="12" y="12" width="76" height="26" rx="5" ${M}/>
    ${t(50, 23, 'ADT : Polynomial', 'fill="var(--ink)"', 7)}
    <line x1="24" y1="30" x2="58" y2="30" ${A}/><line x1="62" y1="30" x2="76" y2="30" ${A}/>
    ${edge(50, 38, 30, 56)}${edge(50, 38, 58, 56)}${edge(50, 38, 78, 56)}
    ${node(30, 62, 'a₃', false, 6.5)}${node(58, 62, 'a₂', false, 6.5)}${node(78, 62, 'a₁', false, 6.5)}
    <path d="M14 78 L 40 88 L 66 82 L 90 90" ${M}/>
    ${t(20, 92, 'P(x) = a₃x³+a₂x²+a₁x', 'fill="var(--muted)"', 5.5)}`;

  const stackqueue = () => `
    <rect x="12" y="52" width="30" height="12" rx="2" ${M}/>
    <rect x="12" y="38" width="30" height="12" rx="2" ${M}/>
    <rect x="12" y="24" width="30" height="12" rx="2" ${A}/>
    <path d="M27 14 l0 8 M23 18 l4 4 4 -4" ${A}/>
    ${t(27, 76, 'top', 'fill="var(--muted)"', 5.5)}
    <rect x="58" y="38" width="12" height="12" rx="2" ${A}/>
    <rect x="72" y="38" width="12" height="12" rx="2" ${M}/>
    <rect x="86" y="38" width="12" height="12" rx="2" ${M} stroke-dasharray="2 2"/>
    <path d="M90 56 c 4 8, -20 10, -34 4 M52 62 l2 -5 M52 62 l5 -1" ${A}/>
    ${t(72, 24, 'front → rear', 'fill="var(--muted)"', 5.5)}
    ${t(50, 92, 'LIFO   ·   FIFO', 'fill="var(--ink)"', 6)}`;

  const linkedlist = () => `
    ${[14, 38, 62, 86].map((x, i) => `
      <rect x="${x}" y="24" width="18" height="14" rx="2" ${i < 3 ? A : M}/>
      <line x1="${x}" y1="31" x2="${x + 18}" y2="31" ${M}/>
      ${i < 3 ? `<path d="M${x + 18} 31 h6 m-2.5 -2.5 l2.5 2.5 l-2.5 2.5" ${A}/>` : `<text x="${x + 9}" y="34" ${TXT} font-size="6" fill="var(--muted)" text-anchor="middle">∅</text>`}
    `).join('')}
    ${[20, 44, 68, 92].map(x => `<text x="${x}" y="34" ${TXT} font-size="6" fill="var(--acc)" text-anchor="middle">·</text>`).join('')}
    <path d="M100 70 C 70 60, 40 84, 8 70" ${M} stroke-dasharray="3 3"/>
    ${t(50, 90, 'next →', 'fill="var(--muted)"', 6)}`;

  const skiplist = () => {
    const ys = [56, 38, 20];
    const levels = [
      [18, 38, 58, 78, 92],
      [18, 58, 92],
      [18, 92],
    ];
    let g = '';
    levels.forEach((xs, lvl) => {
      xs.forEach(x => {
        g += `<rect x="${x - 4}" y="${ys[lvl] - 5}" width="10" height="10" rx="2" ${lvl === 2 ? A : M}/>`;
      });
      for (let i = 0; i < xs.length - 1; i++) {
        const x1 = xs[i] + 5, x2 = xs[i + 1] - 5;
        const s = lvl === 2 ? A : M;
        g += `<line x1="${x1}" y1="${ys[lvl]}" x2="${x2}" y2="${ys[lvl]}" ${s}/>`;
        g += `<path d="M${x2 - 3.5} ${ys[lvl] - 2.6} l3.5 2.6 l-3.5 2.6" ${s}/>`;
      }
      g += `<text x="6" y="${ys[lvl] + 2}" ${TXT} font-size="5.5" fill="var(--muted)" text-anchor="middle" direction="ltr">${2 - lvl}</text>`;
    });
    [58, 92].forEach(x => {
      g += `<line x1="${x}" y1="15" x2="${x}" y2="61" ${M} stroke-dasharray="2 2.5" opacity="0.7"/>`;
    });
    g += t(50, 78, 'skip list', 'fill="var(--muted)"', 5);
    g += `<path d="M18 44 l0 6 m-2.4 -2.2 l2.4 2.2 l2.4 -2.2" ${A}/>`;
    return g;
  };

  const tree = () => `
    ${edge(50, 16, 28, 42)}${edge(50, 16, 72, 42)}
    ${edge(28, 42, 16, 68)}${edge(28, 42, 40, 68)}${edge(72, 42, 60, 68)}${edge(72, 42, 84, 68)}
    ${node(50, 14, 'R')}
    ${node(28, 44, 'B', false)}${node(72, 44, 'D', false)}
    ${node(16, 70, 'A', false, 6.5)}${node(40, 70, 'C', false, 6.5)}${node(60, 70, 'E', false, 6.5)}${node(84, 70, 'F', false, 6.5)}
    <path d="M16 84 C 34 92, 66 92, 84 84" ${A} stroke-dasharray="3 3"/>
    ${t(50, 96, 'inorder : A B C D E F', 'fill="var(--muted)"', 5.5)}`;

  const heap = () => `
    ${edge(50, 16, 32, 44)}${edge(50, 16, 68, 44)}
    ${edge(32, 44, 22, 72)}${edge(32, 44, 42, 72)}${edge(68, 44, 58, 72)}${edge(68, 44, 78, 72)}
    ${node(50, 14, '90')}
    ${node(32, 46, '75', false)}${node(68, 46, '60', false)}
    ${node(22, 74, '50', false, 6.5)}${node(42, 74, '40', false, 6.5)}${node(58, 74, '30', false, 6.5)}${node(78, 74, '20', false, 6.5)}
    ${t(50, 94, 'A[i] ≥ A[2i], A[2i+1]', 'fill="var(--muted)" opacity="0.85"', 5.5)}`;


  const master = () => `
    <line x1="14" y1="84" x2="90" y2="84" ${M}/><line x1="14" y1="84" x2="14" y2="12" ${M}/>
    <rect x="22" y="52" width="16" height="30" fill="var(--acc)" fill-opacity="0.14" stroke="var(--acc)" stroke-width="1.2"/>
    <rect x="46" y="38" width="16" height="44" fill="var(--acc)" fill-opacity="0.24" stroke="var(--acc)" stroke-width="1.2"/>
    <rect x="70" y="26" width="16" height="56" fill="var(--acc)" fill-opacity="0.36" stroke="var(--acc)" stroke-width="1.2"/>
    <path d="M18 76 C 40 62, 60 46, 88 22" ${A} stroke-dasharray="3 3"/>
    ${t(50, 96, 'T(n) = af(n/b) + g(n)', 'fill="var(--muted)"', 5.5)}`;

  const matrix = () => `
    <rect x="20" y="16" width="60" height="56" rx="3" ${M}/>
    <line x1="20" y1="31" x2="80" y2="31" ${M}/><line x1="20" y1="46" x2="80" y2="46" ${M}/><line x1="20" y1="61" x2="80" y2="61" ${M}/>
    <line x1="35" y1="16" x2="35" y2="72" ${M}/><line x1="50" y1="16" x2="50" y2="72" ${M}/><line x1="65" y1="16" x2="65" y2="72" ${M}/>
    <circle cx="27.5" cy="23.5" r="5.4" fill="var(--acc)" fill-opacity="0.85"/>
    <circle cx="57.5" cy="38.5" r="5.4" fill="var(--acc)" fill-opacity="0.7"/>
    <circle cx="42.5" cy="68.5" r="5.4" fill="var(--acc)" fill-opacity="0.55"/>
    ${t(50, 90, 'sparse', 'fill="var(--muted)"', 6)}`;

  
  const kmp = () => `
    <g ${M}>
      <rect x="12" y="18" width="9" height="9" rx="1.5"/><rect x="23" y="18" width="9" height="9" rx="1.5"/><rect x="34" y="18" width="9" height="9" rx="1.5"/><rect x="45" y="18" width="9" height="9" rx="1.5"/><rect x="56" y="18" width="9" height="9" rx="1.5"/><rect x="67" y="18" width="9" height="9" rx="1.5"/><rect x="78" y="18" width="9" height="9" rx="1.5"/>
    </g>
    <g fill="none" stroke="var(--acc)" stroke-width="1.4">
      <rect x="40" y="40" width="26" height="10" rx="2"/>
      <rect x="40" y="62" width="26" height="10" rx="2" stroke-dasharray="3 2.5"/>
    </g>
    <path d="M53 86 c 10 -6, 16 -4, 22 2 m-4 -4 l5 2 l-2 5" ${A}/>
    ${t(50, 97, 'KMP · π(i)', 'fill="var(--muted)"', 5.5)}`;


  const avl = () => `
    ${edge(50, 16, 34, 42)}${edge(50, 16, 70, 42)}
    ${edge(34, 42, 24, 68)}${edge(34, 42, 44, 68)}${edge(70, 42, 80, 68)}
    ${node(50, 14, '8')}
    ${node(34, 44, '5', false)}${node(70, 44, '12', false)}
    ${node(24, 70, '2', false, 6.5)}${node(44, 70, '6', false, 6.5)}${node(80, 70, '14', false, 6.5)}
    ${t(60, 90, 'h(24)-h(44)=0', 'fill="var(--acc)"', 5.5)}
    <path d="M10 78 l 6 0 M 10 75 l 0 6" ${M}/>`;

  const rbtree = () => {
    const rb = (x, y, red) =>
      `<circle cx="${x}" cy="${y}" r="7" fill="${red ? 'var(--rb-red)' : 'var(--rb-black)'}" stroke="var(--card)" stroke-width="1.5"/>
       <circle cx="${x - 2.2}" cy="${y - 2.6}" r="1.5" fill="#fff" opacity="0.35"/>`;
    return `
      <line x1="50" y1="18" x2="32" y2="44" ${M}/><line x1="50" y1="18" x2="72" y2="44" ${M}/>
      <line x1="32" y1="44" x2="20" y2="70" ${M}/><line x1="32" y1="44" x2="44" y2="70" ${M}/>
      <line x1="72" y1="44" x2="84" y2="70" ${M}/>
      ${rb(50, 18, false)}${rb(32, 44, true)}${rb(72, 44, false)}${rb(20, 70, false)}${rb(44, 70, true)}${rb(84, 70, true)}
      ${t(50, 94, 'red-black', 'fill="var(--muted)"', 6)}`;
  };

  const huffman = () => `
    <line x1="50" y1="18" x2="34" y2="42" ${M}/><line x1="50" y1="18" x2="68" y2="42" ${M}/>
    <line x1="34" y1="42" x2="24" y2="66" ${M}/><line x1="34" y1="42" x2="44" y2="66" ${M}/>
    <line x1="68" y1="42" x2="80" y2="66" ${M}/>
    ${node(50, 16, '100')}
    ${node(34, 44, '60', false)}${node(68, 44, '40', false)}
    ${node(24, 68, 'a·30', false, 6.5)}${node(44, 68, 'b·30', false, 6.5)}${node(80, 68, 'c·40', false, 6.5)}
    ${t(38, 34, '0', 'fill="var(--acc)"', 6.5)}${t(60, 34, '1', 'fill="var(--acc)"', 6.5)}
    ${t(30, 58, '0', 'fill="var(--acc)" opacity="0.8"', 6.5)}${t(40, 58, '1', 'fill="var(--acc)" opacity="0.8"', 6.5)}
    ${t(50, 92, 'Huffman', 'fill="var(--muted)"', 6)}`;

  const shortest = () => `
    ${edge(16, 30, 42, 20)}${edge(42, 20, 66, 34)}${edge(16, 30, 34, 58)}${edge(34, 58, 66, 34)}${edge(34, 58, 60, 74)}${edge(66, 34, 84, 62)}${edge(60, 74, 84, 62)}
    ${node(16, 30, 'S')}${node(42, 20, 'A', false, 6.5)}${node(34, 58, 'B', false, 6.5)}${node(66, 34, 'C', false, 6.5)}${node(60, 74, 'D', false, 6.5)}${node(84, 62, 'T')}
    <path d="M22 33 L 38 23 M 48 23 L 60 31 M 72 38 L 79 57" ${A} stroke-width="2.6"/>
    ${t(46, 46, 'w=7', 'fill="var(--acc)"', 6)}
    ${t(50, 94, 'Dijkstra', 'fill="var(--muted)"', 6)}`;

  const dsu = () => `
    ${edge(22, 24, 40, 48)}${edge(22, 24, 30, 66)}${edge(40, 48, 58, 66)}${edge(58, 66, 76, 44)}
    ${edge(68, 20, 84, 30)}
    ${node(22, 24, '1')}${node(40, 48, '2', false, 6.5)}${node(30, 66, '3', false, 6.5)}${node(58, 66, '4', false, 6.5)}${node(76, 44, '5', false, 6.5)}
    ${node(68, 20, '6', false, 6.5)}${node(84, 30, '7', false, 6.5)}
    <rect x="12" y="82" width="60" height="10" rx="2" ${M}/><rect x="66" y="82" width="24" height="10" rx="2" ${M}/>
    ${t(42, 89.5, 'set 1', 'fill="var(--muted)"', 5)}${t(78, 89.5, 'set 2', 'fill="var(--muted)" opacity="0.7"', 5)}`;

  const openaddr = () => {
    const xs = [16, 30, 44, 58, 72, 86];
    const fill = [false, true, true, false, true, false];
    let g = '';
    xs.forEach((x, i) => {
      g += `<rect x="${x - 5}" y="34" width="14" height="12" rx="2" ${fill[i] ? A : M}/>`;
      g += t(x + 2, 42.5, String(i), fill[i] ? 'fill="var(--acc)"' : 'fill="var(--muted)"', 5.5);
      if (fill[i]) g += t(x + 2, 26, 'x', 'fill="var(--muted)"', 6);
    });
    g += `<path d="M14 58 c 6 10, 18 10, 24 2 m-3 -3.5 l3.5 3 l-3.5 3.5" ${A}/>`;
    g += `<path d="M42 56 c 8 14, 22 14, 30 4" ${A} stroke-dasharray="3 3"/>`;
    g += t(50, 82, 'probe: i, i+1, i+2, ...', 'fill="var(--muted)"', 5.5);
    return g;
  };

  
  const bst = () => `
    ${edge(50, 18, 34, 44)}${edge(50, 18, 72, 44)}
    ${edge(34, 44, 24, 70)}${edge(34, 44, 44, 70)}${edge(72, 44, 62, 70)}${edge(72, 44, 84, 70)}
    ${node(50, 16, '50')}
    ${node(34, 46, '30', false)}${node(72, 46, '70', false)}
    ${node(24, 72, '20', false, 6.5)}${node(44, 72, '40', false, 6.5)}${node(62, 72, '60', false, 6.5)}${node(84, 72, '80', false, 6.5)}
    ${t(50, 92, 'L < R < N', 'fill="var(--muted)"', 6)}
    <path d="M10 26 l 8 0" ${M}/><path d="M14 22 l0 8" ${M}/>`;

  const treesAdv = () => {
    let g = '';
    const rb = (x, y, r) => `<circle cx="${x}" cy="${y}" r="6" fill="${r ? 'var(--rb-red)' : 'var(--rb-black)'}" stroke="var(--card)" stroke-width="1.4"/>`;
    g += `<line x1="50" y1="16" x2="34" y2="40" ${M}/><line x1="50" y1="16" x2="70" y2="40" ${M}/><line x1="34" y1="40" x2="24" y2="64" ${M}/><line x1="34" y1="40" x2="44" y2="64" ${M}/><line x1="70" y1="40" x2="80" y2="64" ${M}/>`;
    g += rb(50, 16, false); g += rb(34, 40, true); g += rb(70, 40, false); g += rb(24, 64, false); g += rb(44, 64, true); g += rb(80, 64, true);
    g += t(20, 88, 'red-black', 'fill="var(--muted)"', 5);
    g += `<rect x="56" y="78" width="38" height="16" rx="3" ${M}/>`;
    g += t(75, 88.5, 'H : a=2, b=3', 'fill="var(--ink)"', 5);
    return g;
  };

  const graph = () => `
    <circle cx="30" cy="30" r="17" ${M} stroke-dasharray="3 3" fill="var(--acc)" fill-opacity="0.05"/>
    <circle cx="70" cy="62" r="15" ${M} stroke-dasharray="3 3" fill="var(--acc)" fill-opacity="0.05"/>
    ${edge(30, 30, 58, 24)}${edge(30, 30, 24, 62)}${edge(58, 24, 24, 62)}${edge(58, 24, 70, 62)}${edge(24, 62, 70, 62)}${edge(70, 62, 84, 34)}${edge(58, 24, 84, 34)}
    ${node(30, 30, 'A')}${node(58, 24, 'B', false, 6.5)}${node(24, 62, 'C', false, 6.5)}${node(70, 62, 'D', false, 6.5)}${node(84, 34, 'E', false, 6.5)}
    ${t(50, 92, 'BFS · DFS', 'fill="var(--muted)"', 6)}`;

  const spanning = () => `
    ${edge(24, 24, 72, 20)}${edge(24, 24, 20, 62)}${edge(72, 20, 80, 52)}${edge(20, 62, 44, 78)}${edge(44, 78, 80, 52)}
    ${edge(72, 20, 20, 62)}${edge(24, 24, 80, 52)}
    ${node(24, 24, 'A')}${node(72, 20, 'B', false, 6.5)}${node(20, 62, 'C', false, 6.5)}${node(44, 78, 'D', false, 6.5)}${node(80, 52, 'E', false, 6.5)}
    <path d="M24 24 C 40 10, 60 10, 72 20" ${A} stroke-dasharray="3 3"/>
    ${t(50, 94, 'MST · shortest path', 'fill="var(--muted)"', 5.5)}`;

  const hashing = () => {
    let g = `<path d="M20 12 C 16 20, 24 24, 20 30" ${A}/>${t(28, 24, 'h(x)', 'fill="var(--acc)"', 6)}`;
    const slots = [12, 28, 44, 60, 76];
    const chains = { 0: [], 1: [1, 2], 2: [], 3: [], 4: [3] };
    slots.forEach((x, i) => {
      g += `<rect x="${x - 6}" y="40" width="16" height="12" rx="2" ${i === 1 ? A : M}/>`;
      g += t(x + 2, 48.5, String(i), 'fill="var(--muted)"', 5.5);
      chains[i].forEach((j, k) => {
        const y = 62 + k * 14;
        g += `<rect x="${x - 4}" y="${y}" width="12" height="10" rx="2" ${M}/>`;
        g += `<line x1="${x + 2}" y1="${y - 3 - (k ? 0 : 0)}" x2="${x + 2}" y2="${y}" ${M}/>`;
        g += `<circle cx="${x + 2}" cy="${y - 5.5}" r="0" ${M}/>`;
      });
      if (chains[i].length) g += `<line x1="${x + 2}" y1="52" x2="${x + 2}" y2="${62}" ${M}/>`;
    });
    g += t(50, 96, 'chaining · open addressing', 'fill="var(--muted)" opacity="0.8"', 5.5);
    return g;
  };

  const crypto = () => `
    <rect x="10" y="30" width="24" height="16" rx="3" ${M}/>
    ${t(22, 40.5, 'x', 'fill="var(--ink)"', 7)}
    <path d="M34 38 h10 m-3 -3 l3 3 l-3 3" ${A}/>
    <rect x="44" y="30" width="32" height="16" rx="3" ${A}/>
    ${t(60, 40.5, 'SHA-256', 'fill="var(--acc)"', 6.5)}
    <path d="M76 38 h10 m-3 -3 l3 3 l-3 3" ${A}/>
    <rect x="86" y="30" width="8" height="16" rx="2" ${M}/>
    <path d="M14 60 l 6 0 M 30 60 l 6 0 M 46 60 l 6 0 M 62 60 l 6 0 M 78 60 l 6 0" ${M}/>
    <path d="M10 82 C 30 74, 70 90, 92 78" ${A} stroke-dasharray="3 3"/>
    ${t(50, 95, 'bloom · cuckoo filter', 'fill="var(--muted)" opacity="0.8"', 5.5)}`;

  const ART = {
    algo, recursion, asymptotics, master, matrix, kmp, adt, stackqueue,
    linkedlist, skiplist, tree, heap, bst, avl, rbtree, huffman,
    'trees-adv': treesAdv, graph, spanning, shortest, dsu, hashing, openaddr, crypto
  };

  function get(key) {
    const fn = ART[key] || ART.algo;
    return wrap(fn());
  }

  function tutorPortrait(seed, colOverride) {
    const c = ['var(--acc1)', 'var(--acc2)', 'var(--acc3)', 'var(--acc4)'];
    const col = colOverride || c[seed % c.length];
    return wrap(`
      <circle cx="50" cy="42" r="20" fill="none" stroke="${col}" stroke-width="1.5"/>
      <path d="M30 92 C 30 72, 70 72, 70 92" fill="none" stroke="${col}" stroke-width="1.5"/>
      <circle cx="42" cy="39" r="1.8" fill="${col}"/><circle cx="58" cy="39" r="1.8" fill="${col}"/>
      <path d="M43 50 c 3 3, 11 3, 14 0" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M28 30 C 26 16, 40 10, 50 10 C 60 10, 74 16, 72 30" fill="none" stroke="var(--muted)" stroke-width="1.3"/>
      <path d="M20 60 C 14 70, 14 84, 18 94 M 80 60 C 86 70, 86 84, 82 94" ${M} stroke-dasharray="2 3"/>
    `);
  }

  function specialArt() {
    return `
      <svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:100%;height:100%">
        <defs>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--acc1)" stop-opacity="0"/>
            <stop offset="0.5" stop-color="var(--acc1)" stop-opacity="0.55"/>
            <stop offset="1" stop-color="var(--acc1)" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="scanV" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="var(--acc3)" stop-opacity="0"/>
            <stop offset="0.5" stop-color="var(--acc3)" stop-opacity="0.5"/>
            <stop offset="1" stop-color="var(--acc3)" stop-opacity="0"/>
          </linearGradient>
          <pattern id="hexGrid" width="16" height="14" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <path d="M8 0 L16 4.5 L16 9.5 L8 14 L0 9.5 L0 4.5 Z" fill="none" stroke="var(--acc2)" stroke-width="0.4" opacity="0.5"/>
          </pattern>
          <clipPath id="termClip"><rect x="14" y="27" width="112" height="60" rx="3"/></clipPath>
          <filter id="soft"><feGaussianBlur stdDeviation="0.4"/></filter>
        </defs>

        <rect x="0" y="0" width="220" height="170" fill="url(#hexGrid)" opacity="0.28"/>

        <g stroke-linecap="round" fill="none">
          <!-- matrix binary rain (edges) -->
          <g font-family="STIX Two Text, Georgia, serif" font-size="6" direction="ltr">
            <g fill="var(--acc1)" opacity="0.22">
              <text x="6" y="12">1</text><text x="6" y="22">0</text><text x="6" y="32">1</text><text x="6" y="42">0</text>
              <text x="212" y="20">0</text><text x="212" y="30">1</text><text x="212" y="40">0</text><text x="212" y="50">1</text>
            </g>
            <g fill="var(--acc3)" opacity="0.2">
              <text x="6" y="120">0</text><text x="6" y="130">1</text><text x="6" y="140">0</text>
              <text x="212" y="120">1</text><text x="212" y="130">0</text><text x="212" y="140">1</text>
            </g>
          </g>

          <!-- terminal window: live log feed -->
          <g>
            <rect x="12" y="14" width="116" height="74" rx="5" fill="var(--card)" stroke="var(--acc1)" stroke-width="1" opacity="0.92"/>
            <path d="M12 19 a5 5 0 0 1 5-5 h106 a5 5 0 0 1 5 5 v6 h-116 Z" fill="var(--card2)" opacity="0.9"/>
            <circle cx="20" cy="20" r="1.8" fill="var(--rb-red)" opacity="0.8"/>
            <circle cx="27" cy="20" r="1.8" fill="var(--acc3)" opacity="0.8"/>
            <circle cx="34" cy="20" r="1.8" fill="var(--acc1)" opacity="0.8"/>
            <text x="98" y="23" font-family="STIX Two Text, Georgia, serif" font-size="5.4" fill="var(--muted)" text-anchor="end" direction="ltr">tail -f auth.log</text>

            <g clip-path="url(#termClip)" font-family="STIX Two Text, Georgia, serif" font-size="6" direction="ltr">
              <g>
                <animateTransform attributeName="transform" type="translate" values="0 0; 0 -36" dur="7s" repeatCount="indefinite"/>
                <text x="18" y="36" fill="var(--muted)">12:04:01 <tspan fill="var(--acc1)">GET</tspan> /login 200</text>
                <text x="18" y="48" fill="var(--muted)">12:04:03 hash <tspan fill="var(--acc3)">sha256 ok</tspan></text>
                <text x="18" y="60" fill="var(--muted)">12:04:05 <tspan fill="var(--acc4)">retry</tspan> key=0x3f9c</text>
                <text x="18" y="72" fill="var(--muted)">12:04:07 probe 10.0.4.2</text>
                <text x="18" y="84" fill="var(--acc3)">12:04:09 <tspan fill="var(--muted)">cipher</tspan> sealed ✓</text>
                <text x="18" y="96" fill="var(--muted)">12:04:11 bloom miss</text>
                <text x="18" y="108" fill="var(--muted)">12:04:13 <tspan fill="var(--acc1)">verify</tspan> sig ok</text>
                <text x="18" y="120" fill="var(--muted)">12:04:15 log rotate</text>
                <text x="18" y="132" fill="var(--acc4)">12:04:17 <tspan fill="var(--muted)">throttle</tspan> 3 hits</text>
              </g>
            </g>
            <!-- blinking cursor -->
            <rect x="18" y="80" width="4" height="6" fill="var(--acc1)">
              <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.5;0.55;0.95;1" dur="1.1s" repeatCount="indefinite"/>
            </rect>
          </g>

          <!-- central padlock with opening/closing shackle + radar -->
          <g transform="translate(168 58)">
            <circle r="30" stroke="var(--acc1)" stroke-width="0.8" stroke-dasharray="3 7" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="14s" repeatCount="indefinite"/>
            </circle>
            <circle r="23" stroke="var(--acc3)" stroke-width="0.6" stroke-dasharray="1 5" opacity="0.35">
              <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="20s" repeatCount="indefinite"/>
            </circle>
            <!-- shackle (animates open) -->
            <path d="M-9 -3 v-7 a9 9 0 0 1 18 0 v7" stroke="var(--acc1)" stroke-width="1.8">
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 0; 0 -4; 0 0; 0 0" keyTimes="0;0.4;0.55;0.7;1" dur="4s" repeatCount="indefinite"/>
            </path>
            <rect x="-15" y="-3" width="30" height="23" rx="5" stroke="var(--acc1)" stroke-width="1.6" fill="var(--card)" fill-opacity="0.5"/>
            <circle cx="0" cy="6" r="3.2" fill="var(--acc1)"/>
            <rect x="-1.3" y="6" width="2.6" height="6.5" rx="1" fill="var(--acc1)"/>
            <!-- key turning in the lock -->
            <g>
              <animateTransform attributeName="transform" type="rotate" values="-18;14;14;-18;-18" keyTimes="0;0.2;0.5;0.7;1" dur="4s" repeatCount="indefinite"/>
              <circle cx="0" cy="6" r="5.5" fill="none" stroke="var(--acc3)" stroke-width="1"/>
              <path d="M0 6 l4.5 3" stroke="var(--acc3)" stroke-width="1.2"/>
            </g>
            <circle cx="0" cy="6" r="3.2" fill="none" stroke="var(--acc1)" stroke-width="1">
              <animate attributeName="r" values="4;12" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- shield -->
          <g transform="translate(198 118)">
            <path d="M0 -11 L9 -7 V1 C9 8 0 13 0 13 C0 13 -9 8 -9 1 V-7 Z" fill="var(--card)" fill-opacity="0.4" stroke="var(--acc2)" stroke-width="1.1"/>
            <path d="M-3.5 0 l2.5 2.8 l5 -6" fill="none" stroke="var(--acc3)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </g>

          <!-- data packets flowing from terminal to lock -->
          <g>
            <circle r="2" fill="var(--acc1)">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M126 60 C 148 60, 150 58, 162 58"/>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <circle r="1.6" fill="var(--acc3)">
              <animateMotion dur="3.1s" repeatCount="indefinite" begin="-1.2s" path="M126 70 C 150 72, 152 62, 164 60"/>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="3.1s" repeatCount="indefinite" begin="-1.2s"/>
            </circle>
          </g>

          <!-- hash table: slot array + collision chain + fill sweep -->
          <g transform="translate(120 128)">
            ${[0, 1, 2, 3].map(i => `<rect x="${i * 17}" y="0" width="13" height="11" rx="2" stroke="${i === 1 ? 'var(--acc3)' : 'var(--muted)'}" stroke-width="1" fill="${i === 1 ? 'var(--acc3)' : 'none'}" fill-opacity="${i === 1 ? 0.18 : 0}"/>`).join('')}
            <rect x="19" y="18" width="13" height="11" rx="2" stroke="var(--acc3)" stroke-width="1" fill="none" stroke-dasharray="2.5 2" opacity="0.7"/>
            <path d="M25 11 v7" stroke="var(--acc3)" stroke-width="1" opacity="0.7"/>
            <text x="6.5" y="9" font-family="STIX Two Text, Georgia, serif" font-size="5" fill="var(--muted)" text-anchor="middle" direction="ltr">0</text>
            <text x="23.5" y="9" font-family="STIX Two Text, Georgia, serif" font-size="5" fill="var(--acc3)" text-anchor="middle" direction="ltr">1</text>
            <text x="40.5" y="9" font-family="STIX Two Text, Georgia, serif" font-size="5" fill="var(--muted)" text-anchor="middle" direction="ltr">2</text>
            <text x="57.5" y="9" font-family="STIX Two Text, Georgia, serif" font-size="5" fill="var(--muted)" text-anchor="middle" direction="ltr">3</text>
          </g>

          <!-- cycling SHA-256 hash bar -->
          <g font-family="STIX Two Text, Georgia, serif" font-size="6.6" direction="ltr">
            <text x="12" y="161" fill="var(--muted)">SHA-256  </text>
            <text x="52" y="161" fill="var(--acc1)">
              <animate attributeName="opacity" values="1;0;0;1" keyTimes="0;0.33;0.66;1" dur="3s" repeatCount="indefinite"/>3f9c a1d0 7b4e 2c8f 9e01</text>
            <text x="52" y="161" fill="var(--acc1)">
              <animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.33;0.66;1" dur="3s" repeatCount="indefinite"/>e4b2 0f6a c91d 83e7 5a40</text>
            <text x="52" y="161" fill="var(--acc1)">
              <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.33;0.66;1" dur="3s" repeatCount="indefinite"/>b71f d3c8 20e9 4a55 f6c2</text>
          </g>
        </g>

        <!-- scan sweeps -->
        <rect x="8" y="0" width="204" height="10" fill="url(#scanGrad)" opacity="0.5">
          <animate attributeName="y" values="-10;160" dur="5s" repeatCount="indefinite"/>
        </rect>
        <rect x="0" y="0" width="10" height="170" fill="url(#scanV)" opacity="0.4">
          <animate attributeName="x" values="-10;220" dur="6.5s" repeatCount="indefinite"/>
        </rect>

        <!-- pulsing nodes -->
        <circle cx="95" cy="105" r="2.4" fill="var(--acc3)">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="130" cy="88" r="2.4" fill="var(--acc2)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.7s" repeatCount="indefinite"/>
        </circle>
      </svg>`;
  }

  window.ILLUSTRATIONS = { get, tutorPortrait, specialArt };
})();
