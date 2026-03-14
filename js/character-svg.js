/**
 * character-svg.js — SVG Character Module System for Hee-eung-ee (히응이)
 *
 * Generates modular SVG characters based on Korean consonant (자음) shapes.
 * Each character has: body (consonant shape) + face + expression + accessories.
 *
 * Usage:
 *   CharacterSVG.compose({ consonant: 'ㅎ', expression: 'happy', accessory: 'crown' })
 *   CharacterSVG.render(element, { consonant: 'ㅇ', expression: 'love' })
 *   CharacterSVG.toDataUrl({ consonant: 'ㄱ', expression: 'wink' })
 *   CharacterSVG.preset('sejong')
 */
const CharacterSVG = (() => {
  const SIZE = 400;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  // ===== Color Palettes per Consonant =====
  const COLORS = {
    'ㄱ': { body: '#7EC8E3', bodyDark: '#5BA8C8', face: '#fff', cheek: '#FFB3B3' },
    'ㄴ': { body: '#F4A683', bodyDark: '#D88A6A', face: '#fff', cheek: '#F4A683' },
    'ㄷ': { body: '#B8D4A3', bodyDark: '#96B87E', face: '#fff', cheek: '#FFB3B3' },
    'ㄹ': { body: '#F7C873', bodyDark: '#DEB05C', face: '#fff', cheek: '#FFB3B3' },
    'ㅁ': { body: '#D4A5D8', bodyDark: '#B88ABD', face: '#fff', cheek: '#FFB3B3' },
    'ㅂ': { body: '#F28B82', bodyDark: '#D4706A', face: '#fff', cheek: '#FFB3B3' },
    'ㅅ': { body: '#A8D5BA', bodyDark: '#88B89A', face: '#fff', cheek: '#FFB3B3' },
    'ㅇ': { body: '#F5E6C8', bodyDark: '#E0CDA8', face: '#fff', cheek: '#FFB3B3' },
    'ㅈ': { body: '#92B4EC', bodyDark: '#7498CC', face: '#fff', cheek: '#FFB3B3' },
    'ㅊ': { body: '#C9A0DC', bodyDark: '#AB82BE', face: '#fff', cheek: '#FFB3B3' },
    'ㅋ': { body: '#F9D56E', bodyDark: '#E0BC55', face: '#fff', cheek: '#FFB3B3' },
    'ㅌ': { body: '#88C9A1', bodyDark: '#6AAB83', face: '#fff', cheek: '#FFB3B3' },
    'ㅍ': { body: '#F4B183', bodyDark: '#D89568', face: '#fff', cheek: '#FFB3B3' },
    'ㅎ': { body: '#F5E6C8', bodyDark: '#E0CDA8', face: '#fff', cheek: '#FFB3B3' },
  };

  // ===== Body Shapes (SVG paths for each consonant) =====
  const BODIES = {
    // ㅎ — dot on top + horizontal bar + circle (히응이 본체)
    'ㅎ': (c) => `
      <ellipse cx="${CX}" cy="${CY + 30}" rx="120" ry="100" fill="${c.body}"/>
      <ellipse cx="${CX}" cy="${CY + 30}" rx="120" ry="100" fill="url(#bodyGrad)" opacity="0.3"/>
      <rect x="${CX - 80}" y="${CY - 70}" width="160" height="32" rx="16" fill="${c.body}"/>
      <rect x="${CX - 80}" y="${CY - 70}" width="160" height="32" rx="16" fill="url(#bodyGrad)" opacity="0.3"/>
      <circle cx="${CX}" cy="${CY - 105}" r="22" fill="${c.body}"/>
      <circle cx="${CX}" cy="${CY - 105}" r="22" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅇ — simple circle (이응)
    'ㅇ': (c) => `
      <ellipse cx="${CX}" cy="${CY + 10}" rx="130" ry="110" fill="${c.body}"/>
      <ellipse cx="${CX}" cy="${CY + 10}" rx="130" ry="110" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㄱ — L-shape rotated
    'ㄱ': (c) => `
      <path d="M${CX - 70} ${CY - 90} h140 q30 0 30 30 v140 q0 30 -30 30 h-30 q-30 0 -30 -30 v-100 h-80 q-30 0 -30 -30 v-10 q0 -30 30 -30z" fill="${c.body}"/>
      <path d="M${CX - 70} ${CY - 90} h140 q30 0 30 30 v140 q0 30 -30 30 h-30 q-30 0 -30 -30 v-100 h-80 q-30 0 -30 -30 v-10 q0 -30 30 -30z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㄴ — reversed L
    'ㄴ': (c) => `
      <path d="M${CX - 70} ${CY - 90} q0 0 0 0 h30 q30 0 30 30 v100 h80 q30 0 30 30 v10 q0 30 -30 30 h-140 q-30 0 -30 -30 v-140 q0 -30 30 -30z" fill="${c.body}"/>
      <path d="M${CX - 70} ${CY - 90} q0 0 0 0 h30 q30 0 30 30 v100 h80 q30 0 30 30 v10 q0 30 -30 30 h-140 q-30 0 -30 -30 v-140 q0 -30 30 -30z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㄷ — C-shape open right
    'ㄷ': (c) => `
      <path d="M${CX - 80} ${CY - 90} h160 q30 0 30 30 v10 q0 30 -30 30 h-90 v40 h90 q30 0 30 30 v10 q0 30 -30 30 h-160 q-30 0 -30 -30 v-120 q0 -30 30 -30z" fill="${c.body}"/>
      <path d="M${CX - 80} ${CY - 90} h160 q30 0 30 30 v10 q0 30 -30 30 h-90 v40 h90 q30 0 30 30 v10 q0 30 -30 30 h-160 q-30 0 -30 -30 v-120 q0 -30 30 -30z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㄹ — zigzag shape
    'ㄹ': (c) => `
      <path d="M${CX - 85} ${CY - 100} h170 q25 0 25 25 v10 q0 25 -25 25 h-100 v15 h100 q25 0 25 25 v10 q0 25 -25 25 h-100 v15 h100 q25 0 25 25 v10 q0 25 -25 25 h-170 q-25 0 -25 -25 v-10 q0 -25 25 -25 h100 v-15 h-100 q-25 0 -25 -25 v-10 q0 -25 25 -25 h100 v-15 h-100 q-25 0 -25 -25 v-10 q0 -25 25 -25z"
        fill="${c.body}"/>
      <path d="M${CX - 85} ${CY - 100} h170 q25 0 25 25 v10 q0 25 -25 25 h-100 v15 h100 q25 0 25 25 v10 q0 25 -25 25 h-100 v15 h100 q25 0 25 25 v10 q0 25 -25 25 h-170 q-25 0 -25 -25 v-10 q0 -25 25 -25 h100 v-15 h-100 q-25 0 -25 -25 v-10 q0 -25 25 -25 h100 v-15 h-100 q-25 0 -25 -25 v-10 q0 -25 25 -25z"
        fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅁ — square/rectangle
    'ㅁ': (c) => `
      <rect x="${CX - 100}" y="${CY - 90}" width="200" height="200" rx="35" fill="${c.body}"/>
      <rect x="${CX - 100}" y="${CY - 90}" width="200" height="200" rx="35" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅂ — double vertical + bottom bar
    'ㅂ': (c) => `
      <path d="M${CX - 90} ${CY - 100} h40 q20 0 20 20 v100 h60 v-100 q0 -20 20 -20 h40 q20 0 20 20 v140 q0 30 -30 30 h-140 q-30 0 -30 -30 v-140 q0 -20 20 -20z" fill="${c.body}"/>
      <path d="M${CX - 90} ${CY - 100} h40 q20 0 20 20 v100 h60 v-100 q0 -20 20 -20 h40 q20 0 20 20 v140 q0 30 -30 30 h-140 q-30 0 -30 -30 v-140 q0 -20 20 -20z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅅ — triangle/V shape
    'ㅅ': (c) => `
      <path d="M${CX} ${CY - 110} l100 200 q5 10 -5 15 h-40 q-10 0 -15 -10 l-40 -85 l-40 85 q-5 10 -15 10 h-40 q-10 -5 -5 -15 z" fill="${c.body}"/>
      <path d="M${CX} ${CY - 110} l100 200 q5 10 -5 15 h-40 q-10 0 -15 -10 l-40 -85 l-40 85 q-5 10 -15 10 h-40 q-10 -5 -5 -15 z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅈ — ㅅ with top bar
    'ㅈ': (c) => `
      <rect x="${CX - 90}" y="${CY - 115}" width="180" height="30" rx="15" fill="${c.body}"/>
      <path d="M${CX} ${CY - 75} l90 180 q5 10 -5 15 h-35 q-10 0 -15 -10 l-35 -75 l-35 75 q-5 10 -15 10 h-35 q-10 -5 -5 -15 z" fill="${c.body}"/>
      <rect x="${CX - 90}" y="${CY - 115}" width="180" height="30" rx="15" fill="url(#bodyGrad)" opacity="0.3"/>
      <path d="M${CX} ${CY - 75} l90 180 q5 10 -5 15 h-35 q-10 0 -15 -10 l-35 -75 l-35 75 q-5 10 -15 10 h-35 q-10 -5 -5 -15 z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅊ — ㅈ with top dot
    'ㅊ': (c) => `
      <circle cx="${CX}" cy="${CY - 140}" r="18" fill="${c.body}"/>
      <rect x="${CX - 90}" y="${CY - 105}" width="180" height="28" rx="14" fill="${c.body}"/>
      <path d="M${CX} ${CY - 65} l85 170 q5 10 -5 15 h-30 q-10 0 -15 -10 l-35 -70 l-35 70 q-5 10 -15 10 h-30 q-10 -5 -5 -15 z" fill="${c.body}"/>
      <circle cx="${CX}" cy="${CY - 140}" r="18" fill="url(#bodyGrad)" opacity="0.3"/>
      <rect x="${CX - 90}" y="${CY - 105}" width="180" height="28" rx="14" fill="url(#bodyGrad)" opacity="0.3"/>
      <path d="M${CX} ${CY - 65} l85 170 q5 10 -5 15 h-30 q-10 0 -15 -10 l-35 -70 l-35 70 q-5 10 -15 10 h-30 q-10 -5 -5 -15 z" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
    // ㅋ — ㄱ with middle bar
    'ㅋ': (c) => `
      <path d="M${CX - 70} ${CY - 90} h140 q30 0 30 30 v140 q0 30 -30 30 h-30 q-30 0 -30 -30 v-100 h-80 q-30 0 -30 -30 v-10 q0 -30 30 -30z" fill="${c.body}"/>
      <rect x="${CX - 70}" y="${CY - 20}" width="120" height="28" rx="14" fill="${c.bodyDark}"/>
      <path d="M${CX - 70} ${CY - 90} h140 q30 0 30 30 v140 q0 30 -30 30 h-30 q-30 0 -30 -30 v-100 h-80 q-30 0 -30 -30 v-10 q0 -30 30 -30z" fill="url(#bodyGrad)" opacity="0.2"/>
    `,
    // ㅌ — ㄷ with middle bar
    'ㅌ': (c) => `
      <path d="M${CX - 80} ${CY - 90} h160 q30 0 30 30 v10 q0 30 -30 30 h-90 v40 h90 q30 0 30 30 v10 q0 30 -30 30 h-160 q-30 0 -30 -30 v-120 q0 -30 30 -30z" fill="${c.body}"/>
      <rect x="${CX - 80}" y="${CY - 20}" width="160" height="26" rx="13" fill="${c.bodyDark}"/>
      <path d="M${CX - 80} ${CY - 90} h160 q30 0 30 30 v10 q0 30 -30 30 h-90 v40 h90 q30 0 30 30 v10 q0 30 -30 30 h-160 q-30 0 -30 -30 v-120 q0 -30 30 -30z" fill="url(#bodyGrad)" opacity="0.2"/>
    `,
    // ㅍ — double vertical bars with top and bottom bars
    'ㅍ': (c) => `
      <rect x="${CX - 100}" y="${CY - 90}" width="200" height="30" rx="15" fill="${c.body}"/>
      <rect x="${CX - 55}" y="${CY - 60}" width="30" height="130" rx="15" fill="${c.body}"/>
      <rect x="${CX + 25}" y="${CY - 60}" width="30" height="130" rx="15" fill="${c.body}"/>
      <rect x="${CX - 100}" y="${CY + 70}" width="200" height="30" rx="15" fill="${c.body}"/>
      <rect x="${CX - 100}" y="${CY - 90}" width="200" height="30" rx="15" fill="url(#bodyGrad)" opacity="0.3"/>
      <rect x="${CX - 100}" y="${CY + 70}" width="200" height="30" rx="15" fill="url(#bodyGrad)" opacity="0.3"/>
    `,
  };

  // ===== Face Area (white oval) =====
  function faceArea(consonant) {
    const faces = {
      'ㅎ': `<ellipse cx="${CX}" cy="${CY + 30}" rx="72" ry="58" fill="#fff" opacity="0.92"/>`,
      'ㅇ': `<ellipse cx="${CX}" cy="${CY + 10}" rx="80" ry="65" fill="#fff" opacity="0.92"/>`,
      'ㄱ': `<ellipse cx="${CX + 25}" cy="${CY - 30}" rx="55" ry="42" fill="#fff" opacity="0.92"/>`,
      'ㄴ': `<ellipse cx="${CX - 20}" cy="${CY + 35}" rx="60" ry="45" fill="#fff" opacity="0.92"/>`,
      'ㄷ': `<ellipse cx="${CX}" cy="${CY}" rx="65" ry="50" fill="#fff" opacity="0.92"/>`,
      'ㄹ': `<ellipse cx="${CX}" cy="${CY}" rx="60" ry="45" fill="#fff" opacity="0.92"/>`,
      'ㅁ': `<ellipse cx="${CX}" cy="${CY + 10}" rx="70" ry="60" fill="#fff" opacity="0.92"/>`,
      'ㅂ': `<ellipse cx="${CX}" cy="${CY + 10}" rx="60" ry="50" fill="#fff" opacity="0.92"/>`,
      'ㅅ': `<ellipse cx="${CX}" cy="${CY + 10}" rx="55" ry="45" fill="#fff" opacity="0.92"/>`,
      'ㅈ': `<ellipse cx="${CX}" cy="${CY + 20}" rx="55" ry="45" fill="#fff" opacity="0.92"/>`,
      'ㅊ': `<ellipse cx="${CX}" cy="${CY + 20}" rx="50" ry="42" fill="#fff" opacity="0.92"/>`,
      'ㅋ': `<ellipse cx="${CX + 20}" cy="${CY - 25}" rx="52" ry="40" fill="#fff" opacity="0.92"/>`,
      'ㅌ': `<ellipse cx="${CX}" cy="${CY}" rx="60" ry="48" fill="#fff" opacity="0.92"/>`,
      'ㅍ': `<ellipse cx="${CX}" cy="${CY}" rx="55" ry="48" fill="#fff" opacity="0.92"/>`,
    };
    return faces[consonant] || faces['ㅇ'];
  }

  // ===== Face center coords (for positioning eyes/mouth) =====
  function faceCenter(consonant) {
    const centers = {
      'ㅎ': { x: CX, y: CY + 30 },
      'ㅇ': { x: CX, y: CY + 10 },
      'ㄱ': { x: CX + 25, y: CY - 30 },
      'ㄴ': { x: CX - 20, y: CY + 35 },
      'ㄷ': { x: CX, y: CY },
      'ㄹ': { x: CX, y: CY },
      'ㅁ': { x: CX, y: CY + 10 },
      'ㅂ': { x: CX, y: CY + 10 },
      'ㅅ': { x: CX, y: CY + 10 },
      'ㅈ': { x: CX, y: CY + 20 },
      'ㅊ': { x: CX, y: CY + 20 },
      'ㅋ': { x: CX + 20, y: CY - 25 },
      'ㅌ': { x: CX, y: CY },
      'ㅍ': { x: CX, y: CY },
    };
    return centers[consonant] || centers['ㅇ'];
  }

  // ===== Expressions =====
  const EXPRESSIONS = {
    default: (fc, c) => `
      <circle cx="${fc.x - 18}" cy="${fc.y - 6}" r="5" fill="#3d2c1e"/>
      <circle cx="${fc.x + 18}" cy="${fc.y - 6}" r="5" fill="#3d2c1e"/>
      <path d="M${fc.x - 8} ${fc.y + 12} q8 8 16 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x - 32}" cy="${fc.y + 8}" r="10" fill="${c.cheek}" opacity="0.35"/>
      <circle cx="${fc.x + 32}" cy="${fc.y + 8}" r="10" fill="${c.cheek}" opacity="0.35"/>
    `,
    happy: (fc, c) => `
      <path d="M${fc.x - 22} ${fc.y - 8} q4 -6 8 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${fc.x + 14} ${fc.y - 8} q4 -6 8 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${fc.x - 12} ${fc.y + 10} q12 14 24 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x - 32}" cy="${fc.y + 8}" r="12" fill="${c.cheek}" opacity="0.4"/>
      <circle cx="${fc.x + 32}" cy="${fc.y + 8}" r="12" fill="${c.cheek}" opacity="0.4"/>
    `,
    love: (fc, c) => `
      <path d="M${fc.x - 24} ${fc.y - 10} c-3 -8 -12 -8 -12 0 c0 6 12 14 12 14 s12 -8 12 -14 c0 -8 -9 -8 -12 0z" fill="#E8485F"/>
      <path d="M${fc.x + 24} ${fc.y - 10} c-3 -8 -12 -8 -12 0 c0 6 12 14 12 14 s12 -8 12 -14 c0 -8 -9 -8 -12 0z" fill="#E8485F"/>
      <path d="M${fc.x - 8} ${fc.y + 14} q8 6 16 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x - 32}" cy="${fc.y + 8}" r="12" fill="${c.cheek}" opacity="0.5"/>
      <circle cx="${fc.x + 32}" cy="${fc.y + 8}" r="12" fill="${c.cheek}" opacity="0.5"/>
    `,
    surprised: (fc, c) => `
      <circle cx="${fc.x - 18}" cy="${fc.y - 6}" r="7" fill="none" stroke="#3d2c1e" stroke-width="2.5"/>
      <circle cx="${fc.x + 18}" cy="${fc.y - 6}" r="7" fill="none" stroke="#3d2c1e" stroke-width="2.5"/>
      <ellipse cx="${fc.x}" cy="${fc.y + 16}" rx="8" ry="10" fill="none" stroke="#3d2c1e" stroke-width="2.5"/>
      <circle cx="${fc.x - 32}" cy="${fc.y + 6}" r="10" fill="${c.cheek}" opacity="0.3"/>
      <circle cx="${fc.x + 32}" cy="${fc.y + 6}" r="10" fill="${c.cheek}" opacity="0.3"/>
    `,
    wink: (fc, c) => `
      <circle cx="${fc.x - 18}" cy="${fc.y - 6}" r="5" fill="#3d2c1e"/>
      <path d="M${fc.x + 12} ${fc.y - 6} q6 -5 12 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${fc.x - 8} ${fc.y + 12} q8 8 16 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x - 32}" cy="${fc.y + 8}" r="10" fill="${c.cheek}" opacity="0.35"/>
      <circle cx="${fc.x + 32}" cy="${fc.y + 8}" r="10" fill="${c.cheek}" opacity="0.35"/>
    `,
    sleepy: (fc, c) => `
      <path d="M${fc.x - 24} ${fc.y - 6} h12" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${fc.x + 12} ${fc.y - 6} h12" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${fc.x - 6} ${fc.y + 14} q6 4 12 0" fill="none" stroke="#3d2c1e" stroke-width="2" stroke-linecap="round"/>
      <circle cx="${fc.x - 32}" cy="${fc.y + 8}" r="10" fill="${c.cheek}" opacity="0.3"/>
      <circle cx="${fc.x + 32}" cy="${fc.y + 8}" r="10" fill="${c.cheek}" opacity="0.3"/>
      <text x="${fc.x + 42}" y="${fc.y - 18}" font-size="16" fill="#3d2c1e" opacity="0.5" font-family="sans-serif">z</text>
      <text x="${fc.x + 52}" y="${fc.y - 30}" font-size="12" fill="#3d2c1e" opacity="0.35" font-family="sans-serif">z</text>
    `,
    angry: (fc, c) => `
      <line x1="${fc.x - 24}" y1="${fc.y - 16}" x2="${fc.x - 12}" y2="${fc.y - 10}" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x - 18}" cy="${fc.y - 4}" r="5" fill="#3d2c1e"/>
      <line x1="${fc.x + 24}" y1="${fc.y - 16}" x2="${fc.x + 12}" y2="${fc.y - 10}" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x + 18}" cy="${fc.y - 4}" r="5" fill="#3d2c1e"/>
      <path d="M${fc.x - 10} ${fc.y + 14} h20" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${fc.x - 30}" cy="${fc.y + 6}" r="10" fill="#E85050" opacity="0.35"/>
      <circle cx="${fc.x + 30}" cy="${fc.y + 6}" r="10" fill="#E85050" opacity="0.35"/>
    `,
    cry: (fc, c) => `
      <circle cx="${fc.x - 18}" cy="${fc.y - 6}" r="5" fill="#3d2c1e"/>
      <circle cx="${fc.x + 18}" cy="${fc.y - 6}" r="5" fill="#3d2c1e"/>
      <path d="M${fc.x - 8} ${fc.y + 16} q8 -6 16 0" fill="none" stroke="#3d2c1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${fc.x - 26}" y1="${fc.y + 2}" d="M${fc.x - 26} ${fc.y + 2} q-2 16 2 28" fill="none" stroke="#7EC8E3" stroke-width="2" opacity="0.6"/>
      <path d="M${fc.x + 26} ${fc.y + 2} q2 16 -2 28" fill="none" stroke="#7EC8E3" stroke-width="2" opacity="0.6"/>
    `,
  };

  // ===== Accessories =====
  const ACCESSORIES = {
    none: () => '',
    crown: (fc) => `
      <g transform="translate(${fc.x - 30}, ${fc.y - 55})">
        <path d="M0 25 L8 5 L18 18 L30 0 L42 18 L52 5 L60 25 Z" fill="#F9D56E" stroke="#C9974A" stroke-width="1.5"/>
        <rect x="0" y="25" width="60" height="8" rx="2" fill="#C9974A"/>
        <circle cx="8" cy="8" r="3" fill="#E8485F"/>
        <circle cx="30" cy="3" r="3" fill="#7EC8E3"/>
        <circle cx="52" cy="8" r="3" fill="#A8D5BA"/>
      </g>
    `,
    headband: (fc, c) => `
      <g>
        <ellipse cx="${fc.x}" cy="${fc.y - 35}" rx="55" ry="12" fill="#FF8FAB" opacity="0.85"/>
        <circle cx="${fc.x + 50}" cy="${fc.y - 40}" r="14" fill="#FF8FAB" opacity="0.7"/>
        <circle cx="${fc.x + 42}" cy="${fc.y - 50}" r="12" fill="#FF8FAB" opacity="0.7"/>
      </g>
    `,
    hanbok_hat: (fc) => `
      <g transform="translate(${fc.x - 45}, ${fc.y - 65})">
        <rect x="10" y="30" width="70" height="12" rx="6" fill="#1a1a2e"/>
        <path d="M25 30 Q45 -5 65 30" fill="#1a1a2e"/>
        <rect x="10" y="38" width="70" height="4" rx="2" fill="#C9974A"/>
      </g>
    `,
    ribbon: (fc) => `
      <g transform="translate(${fc.x + 25}, ${fc.y - 50})">
        <path d="M0 10 Q-15 -5 -8 -12 Q0 -5 0 10 Q0 -5 8 -12 Q15 -5 0 10" fill="#FF6B8A"/>
        <circle cx="0" cy="10" r="5" fill="#FF4D6D"/>
      </g>
    `,
    glasses: (fc) => `
      <g>
        <circle cx="${fc.x - 18}" cy="${fc.y - 6}" r="14" fill="none" stroke="#3d2c1e" stroke-width="2"/>
        <circle cx="${fc.x + 18}" cy="${fc.y - 6}" r="14" fill="none" stroke="#3d2c1e" stroke-width="2"/>
        <line x1="${fc.x - 4}" y1="${fc.y - 6}" x2="${fc.x + 4}" y2="${fc.y - 6}" stroke="#3d2c1e" stroke-width="2"/>
        <line x1="${fc.x - 32}" y1="${fc.y - 8}" x2="${fc.x - 38}" y2="${fc.y - 10}" stroke="#3d2c1e" stroke-width="2"/>
        <line x1="${fc.x + 32}" y1="${fc.y - 8}" x2="${fc.x + 38}" y2="${fc.y - 10}" stroke="#3d2c1e" stroke-width="2"/>
      </g>
    `,
    scarf: (fc, c) => `
      <g>
        <path d="M${fc.x - 50} ${fc.y + 35} q50 15 100 0 q5 0 5 8 q-50 18 -110 0 q-2 -8 5 -8z" fill="#E8485F" opacity="0.8"/>
        <rect x="${fc.x + 35}" y="${fc.y + 38}" width="12" height="30" rx="6" fill="#E8485F" opacity="0.7" transform="rotate(10, ${fc.x + 41}, ${fc.y + 38})"/>
      </g>
    `,
  };

  // ===== Background Effects =====
  const BACKGROUNDS = {
    none: () => '',
    sparkles: () => {
      let stars = '';
      const positions = [
        [60, 60], [340, 80], [50, 300], [350, 320], [180, 50], [280, 350],
        [80, 180], [320, 200],
      ];
      positions.forEach(([x, y], i) => {
        const size = 4 + (i % 3) * 2;
        const opacity = 0.3 + (i % 4) * 0.15;
        stars += `<path d="M${x} ${y - size} L${x + size * 0.3} ${y - size * 0.3} L${x + size} ${y} L${x + size * 0.3} ${y + size * 0.3} L${x} ${y + size} L${x - size * 0.3} ${y + size * 0.3} L${x - size} ${y} L${x - size * 0.3} ${y - size * 0.3} Z" fill="#C9974A" opacity="${opacity}"/>`;
      });
      return stars;
    },
    hearts: () => {
      let h = '';
      const positions = [[70, 70, 12], [330, 90, 10], [60, 320, 8], [340, 300, 11], [200, 55, 9]];
      positions.forEach(([x, y, s]) => {
        h += `<path d="M${x} ${y} c-${s * 0.25} -${s * 0.67} -${s} -${s * 0.67} -${s} 0 c0 ${s * 0.5} ${s} ${s * 1.17} ${s} ${s * 1.17} s${s} -${s * 0.67} ${s} -${s * 1.17} c0 -${s * 0.67} -${s * 0.75} -${s * 0.67} -${s} 0z" fill="#FFB3B3" opacity="0.3"/>`;
      });
      return h;
    },
    confetti: () => {
      let c = '';
      const colors = ['#F9D56E', '#7EC8E3', '#FF8FAB', '#A8D5BA', '#C9A0DC'];
      for (let i = 0; i < 12; i++) {
        const x = 40 + Math.sin(i * 1.7) * 150 + 50;
        const y = 40 + Math.cos(i * 2.3) * 150 + 50;
        const rot = i * 30;
        const color = colors[i % colors.length];
        c += `<rect x="${x}" y="${y}" width="${6 + i % 3 * 2}" height="3" rx="1.5" fill="${color}" opacity="0.4" transform="rotate(${rot}, ${x}, ${y})"/>`;
      }
      return c;
    },
  };

  // ===== Presets =====
  const PRESETS = {
    sejong: { consonant: 'ㅇ', expression: 'default', accessory: 'hanbok_hat', background: 'sparkles' },
    happy_hieung: { consonant: 'ㅎ', expression: 'happy', accessory: 'none', background: 'sparkles' },
    love_hieung: { consonant: 'ㅎ', expression: 'love', accessory: 'ribbon', background: 'hearts' },
    giyeok: { consonant: 'ㄱ', expression: 'happy', accessory: 'headband', background: 'none' },
    nieun: { consonant: 'ㄴ', expression: 'angry', accessory: 'none', background: 'none' },
    digeut: { consonant: 'ㄷ', expression: 'default', accessory: 'none', background: 'none' },
    rieul: { consonant: 'ㄹ', expression: 'wink', accessory: 'glasses', background: 'none' },
    mieum: { consonant: 'ㅁ', expression: 'sleepy', accessory: 'none', background: 'none' },
    bieup: { consonant: 'ㅂ', expression: 'surprised', accessory: 'none', background: 'none' },
    party: { consonant: 'ㅎ', expression: 'happy', accessory: 'crown', background: 'confetti' },
    greeting: { consonant: 'ㅎ', expression: 'happy', accessory: 'none', background: 'sparkles' },
    thankyou: { consonant: 'ㅇ', expression: 'happy', accessory: 'ribbon', background: 'hearts' },
  };

  // ===== SVG Defs (gradients, filters) =====
  function svgDefs() {
    return `
      <defs>
        <radialGradient id="bodyGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.1"/>
        </radialGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="130%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
          <feOffset dx="0" dy="4" result="shadow"/>
          <feFlood flood-color="#000" flood-opacity="0.15"/>
          <feComposite in2="shadow" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;
  }

  // ===== Main Compose Function =====
  function compose(options = {}) {
    const {
      consonant = 'ㅎ',
      expression = 'default',
      accessory = 'none',
      background = 'none',
      size = SIZE,
    } = options;

    const c = COLORS[consonant] || COLORS['ㅎ'];
    const bodyFn = BODIES[consonant] || BODIES['ㅎ'];
    const fc = faceCenter(consonant);
    const exprFn = EXPRESSIONS[expression] || EXPRESSIONS.default;
    const accFn = ACCESSORIES[accessory] || ACCESSORIES.none;
    const bgFn = BACKGROUNDS[background] || BACKGROUNDS.none;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${size}" height="${size}">
      ${svgDefs()}
      ${bgFn()}
      <g filter="url(#softShadow)">
        ${bodyFn(c)}
      </g>
      ${faceArea(consonant)}
      ${exprFn(fc, c)}
      ${accFn(fc, c)}
    </svg>`;

    return svg;
  }

  // ===== Render to DOM element =====
  function render(element, options = {}) {
    if (typeof element === 'string') element = document.getElementById(element);
    if (!element) return null;
    const svg = compose(options);
    element.innerHTML = svg;
    return element;
  }

  // ===== Preset shortcut =====
  function preset(name) {
    const p = PRESETS[name];
    if (!p) return compose();
    return compose(p);
  }

  // ===== Convert to data URL for download/export =====
  function toDataUrl(options = {}, format = 'svg') {
    const svg = compose({ ...options, size: options.size || 1080 });

    if (format === 'svg') {
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // PNG export via canvas
    return new Promise((resolve) => {
      const img = new Image();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const s = options.size || 1080;
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, s, s);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = url;
    });
  }

  // ===== List available options =====
  function listOptions() {
    return {
      consonants: Object.keys(BODIES),
      expressions: Object.keys(EXPRESSIONS),
      accessories: Object.keys(ACCESSORIES),
      backgrounds: Object.keys(BACKGROUNDS),
      presets: Object.keys(PRESETS),
    };
  }

  return {
    compose,
    render,
    preset,
    toDataUrl,
    listOptions,
    PRESETS,
  };
})();
