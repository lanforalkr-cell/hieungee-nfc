/**
 * hangul.js - English name to Korean (Hangul) transliteration engine
 * Uses a lookup table for common names + improved algorithmic fallback
 */

const HangulConverter = (() => {
  // ===== Unicode Hangul composition =====
  const SYLLABLE_BASE = 0xAC00;
  const JUNG_COUNT = 21;
  const JONG_COUNT = 28;

  const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  function composeSyllable(cho, jung, jong) {
    const choIdx = CHO.indexOf(cho);
    const jungIdx = JUNG.indexOf(jung);
    const jongIdx = jong ? JONG.indexOf(jong) : 0;
    if (choIdx < 0 || jungIdx < 0 || jongIdx < 0) return null;
    return String.fromCharCode(SYLLABLE_BASE + (choIdx * JUNG_COUNT + jungIdx) * JONG_COUNT + jongIdx);
  }

  // ===== Common name lookup table =====
  // Standard Korean transliterations for popular English names
  const NAME_TABLE = {
    // Female names
    'sarah': '사라', 'sara': '사라',
    'emma': '엠마', 'emily': '에밀리',
    'olivia': '올리비아', 'sophia': '소피아', 'sophie': '소피',
    'isabella': '이사벨라', 'mia': '미아',
    'charlotte': '샬럿', 'amelia': '아멜리아',
    'harper': '하퍼', 'evelyn': '에블린',
    'abigail': '아비게일', 'ella': '엘라',
    'elizabeth': '엘리자베스', 'camila': '카밀라',
    'luna': '루나', 'sofia': '소피아',
    'avery': '에이버리', 'scarlett': '스칼렛',
    'victoria': '빅토리아', 'madison': '매디슨',
    'grace': '그레이스', 'chloe': '클로이',
    'penelope': '페넬로피', 'lily': '릴리',
    'hannah': '한나', 'anna': '안나',
    'natalie': '나탈리', 'nicole': '니콜',
    'jessica': '제시카', 'jennifer': '제니퍼',
    'ashley': '애슐리', 'rachel': '레이첼',
    'samantha': '사만다', 'katherine': '캐서린',
    'catherine': '캐서린', 'kate': '케이트',
    'maria': '마리아', 'marie': '마리',
    'alice': '앨리스', 'julia': '줄리아',
    'julie': '줄리', 'diana': '다이애나',
    'claire': '클레어', 'clara': '클라라',
    'elena': '엘레나', 'eva': '에바',
    'naomi': '나오미', 'ruby': '루비',
    'rose': '로즈', 'stella': '스텔라',
    'lucy': '루시', 'audrey': '오드리',
    'leah': '리아', 'nora': '노라',
    'hazel': '헤이즐', 'violet': '바이올렛',
    'aurora': '오로라', 'ivy': '아이비',
    'ariana': '아리아나', 'zoe': '조이',
    'ellie': '엘리', 'maya': '마야',
    'layla': '레일라', 'bella': '벨라',
    'willow': '윌로', 'paisley': '페이즐리',
    'eleanor': '엘리너', 'savannah': '사바나',
    'addison': '애디슨', 'brooklyn': '브루클린',
    'gabriella': '가브리엘라', 'madelyn': '매들린',
    'caroline': '캐롤라인', 'michelle': '미셸',
    'stephanie': '스테파니', 'amber': '앰버',
    'rebecca': '레베카', 'karen': '카렌',
    'heather': '헤더', 'megan': '메간',
    'tiffany': '티파니', 'brittany': '브리트니',
    'kelly': '켈리', 'laura': '로라',
    'andrea': '안드레아', 'linda': '린다',
    'amy': '에이미', 'crystal': '크리스탈',
    'donna': '도나', 'helen': '헬렌',
    'susan': '수잔', 'sandra': '산드라',
    'lisa': '리사', 'nancy': '낸시',
    'betty': '베티', 'dorothy': '도로시',
    'margaret': '마거릿', 'ruth': '루스',
    'deborah': '데보라', 'sharon': '샤론',
    'cynthia': '신시아', 'angela': '안젤라',
    'melissa': '멜리사', 'brenda': '브렌다',
    'pamela': '파멜라', 'martha': '마사',
    'teresa': '테레사', 'gloria': '글로리아',
    'sara': '사라', 'janice': '재니스',
    'ann': '앤', 'anne': '앤',
    'jean': '진', 'jane': '제인',
    'diana': '다이애나',

    // Male names
    'james': '제임스', 'john': '존',
    'robert': '로버트', 'michael': '마이클',
    'william': '윌리엄', 'david': '데이비드',
    'richard': '리처드', 'joseph': '조셉',
    'thomas': '토마스', 'charles': '찰스',
    'christopher': '크리스토퍼', 'daniel': '대니얼',
    'matthew': '매튜', 'anthony': '앤서니',
    'mark': '마크', 'donald': '도널드',
    'steven': '스티븐', 'stephen': '스티븐',
    'paul': '폴', 'andrew': '앤드루',
    'joshua': '조슈아', 'kenneth': '케네스',
    'kevin': '케빈', 'brian': '브라이언',
    'george': '조지', 'timothy': '티모시',
    'ronald': '로널드', 'edward': '에드워드',
    'jason': '제이슨', 'jeffrey': '제프리',
    'ryan': '라이언', 'jacob': '제이콥',
    'gary': '게리', 'nicholas': '니콜라스',
    'eric': '에릭', 'jonathan': '조나단',
    'samuel': '새뮤얼', 'benjamin': '벤자민',
    'nathan': '네이든', 'henry': '헨리',
    'peter': '피터', 'patrick': '패트릭',
    'jack': '잭', 'alexander': '알렉산더',
    'oliver': '올리버', 'adam': '아담',
    'chris': '크리스', 'ethan': '이든',
    'noah': '노아', 'liam': '리암',
    'mason': '메이슨', 'logan': '로건',
    'lucas': '루카스', 'luke': '루크',
    'owen': '오웬', 'dylan': '딜런',
    'caleb': '케일럽', 'hunter': '헌터',
    'connor': '코너', 'leo': '레오',
    'max': '맥스', 'ian': '이안',
    'sean': '숀', 'oscar': '오스카',
    'charlie': '찰리', 'aaron': '애런',
    'austin': '오스틴', 'jordan': '조던',
    'tyler': '타일러', 'brandon': '브랜든',
    'justin': '저스틴', 'kyle': '카일',
    'zachary': '재커리', 'jose': '호세',
    'carlos': '카를로스', 'diego': '디에고',
    'miguel': '미겔', 'angel': '앤젤',
    'alan': '앨런', 'alex': '알렉스',
    'ben': '벤', 'bob': '밥',
    'bruce': '브루스', 'carl': '칼',
    'scott': '스콧', 'dennis': '데니스',
    'frank': '프랭크', 'greg': '그렉',
    'harry': '해리', 'jake': '제이크',
    'jeff': '제프', 'jerry': '제리',
    'joe': '조', 'josh': '조시',
    'larry': '래리', 'matt': '맷',
    'mike': '마이크', 'nick': '닉',
    'phil': '필', 'ray': '레이',
    'roger': '로저', 'sam': '샘',
    'steve': '스티브', 'ted': '테드',
    'tim': '팀', 'tom': '톰',
    'tony': '토니', 'victor': '빅터',
    'wayne': '웨인', 'billy': '빌리',
    'jimmy': '지미', 'bobby': '바비',
    'tommy': '토미', 'johnny': '조니',
    'danny': '대니', 'kenny': '케니',

    // K-pop / K-culture popular names
    'taylor': '테일러', 'emma': '엠마',
    'sophia': '소피아', 'jackson': '잭슨',
    'aiden': '에이든', 'caden': '케이든',
  };

  // ===== Syllable-based algorithmic fallback =====
  // Initial consonant digraphs → 초성 (checked longest first)
  const INIT_DIGRAPHS = [
    ['sh', 'ㅅ'], ['ch', 'ㅊ'], ['th', 'ㄷ'], ['ph', 'ㅍ'],
    ['wh', 'ㅎ'], ['qu', 'ㅋ'],
  ];
  // Initial single consonants → 초성
  const INIT_CONSONANTS = {
    b:'ㅂ', c:'ㅋ', d:'ㄷ', f:'ㅍ', g:'ㄱ', h:'ㅎ', j:'ㅈ', k:'ㅋ',
    l:'ㄹ', m:'ㅁ', n:'ㄴ', p:'ㅍ', q:'ㅋ', r:'ㄹ', s:'ㅅ', t:'ㅌ',
    v:'ㅂ', w:null, x:'ㅋ', y:null, z:'ㅈ',
  };
  // Vowel digraphs → 중성 (checked longest first)
  const VOWEL_DIGRAPHS = [
    ['ee','ㅣ'], ['ea','ㅣ'], ['oo','ㅜ'], ['ou','ㅜ'],
    ['ai','ㅐ'], ['ay','ㅐ'], ['ei','ㅐ'], ['ey','ㅐ'],
    ['oi','ㅗ'], ['oy','ㅗ'], ['au','ㅗ'], ['aw','ㅗ'],
    ['ow','ㅗ'], ['ie','ㅣ'], ['ue','ㅜ'], ['ui','ㅟ'], ['oa','ㅗ'],
  ];
  // Single vowels → 중성
  const VOWELS_MAP = { a:'ㅏ', e:'ㅔ', i:'ㅣ', o:'ㅗ', u:'ㅜ' };
  // Final consonant digraphs → 종성
  const FINAL_DIGRAPHS = [
    ['ng','ㅇ'], ['ck','ㄱ'], ['ll','ㄹ'], ['ss','ㅅ'], ['th','ㅅ'],
  ];
  // Final single consonants → 종성
  const FINAL_CONSONANTS = {
    b:'ㅂ', c:'ㄱ', d:'ㄷ', f:'ㅍ', g:'ㄱ', k:'ㄱ', l:'ㄹ',
    m:'ㅁ', n:'ㄴ', p:'ㅂ', r:'ㄹ', s:'ㅅ', t:'ㅅ', x:'ㅋ',
  };

  function isVowel(ch) { return 'aeiou'.includes(ch); }

  /**
   * Pre-process English word to handle silent letters
   */
  function preprocess(word) {
    let w = word;
    // Silent 'h' at end after vowel (sarah→sara, leah→lea)
    if (w.length > 2 && w.endsWith('h') && isVowel(w[w.length - 2])) w = w.slice(0, -1);
    // Silent 'e' at end after consonant (kate→kat, mike→mik)
    if (w.length > 3 && w.endsWith('e') && !isVowel(w[w.length - 2])) {
      const exceptions = ['jose','chloe','zoe','eve','bebe'];
      if (!exceptions.includes(w)) w = w.slice(0, -1);
    }
    // Silent 'gh' (not at start)
    w = w.replace(/(?!^)gh/g, '');
    // Silent initial combos
    if (w.startsWith('kn')) w = 'n' + w.slice(2);
    if (w.startsWith('wr')) w = 'r' + w.slice(2);
    if (w.startsWith('gn')) w = 'n' + w.slice(2);
    return w;
  }

  /**
   * Try to consume a consonant (digraph or single) at position i.
   * Returns [cho, newIndex] or null.
   */
  function readInitial(word, i) {
    if (i >= word.length || isVowel(word[i])) return null;
    // Try digraphs
    if (i + 1 < word.length) {
      const pair = word[i] + word[i + 1];
      for (const [d, cho] of INIT_DIGRAPHS) {
        if (pair === d) return [cho, i + 2];
      }
    }
    const cho = INIT_CONSONANTS[word[i]];
    if (cho) return [cho, i + 1];
    return [null, i + 1]; // w, y handled specially
  }

  /**
   * Try to consume a vowel (digraph or single) at position i.
   * Returns [jung, newIndex] or null.
   */
  function readVowel(word, i) {
    if (i >= word.length || !isVowel(word[i])) return null;
    // Try digraphs
    if (i + 1 < word.length) {
      const pair = word[i] + word[i + 1];
      for (const [d, jung] of VOWEL_DIGRAPHS) {
        if (pair === d) return [jung, i + 2];
      }
    }
    return [VOWELS_MAP[word[i]] || 'ㅏ', i + 1];
  }

  /**
   * Syllable-based conversion: groups consonant+vowel(+finalConsonant) into
   * proper Korean syllables using Unicode composition.
   */
  function convertAlgorithmic(word) {
    const w = preprocess(word);
    const syllables = [];
    let i = 0;

    while (i < w.length) {
      let cho = null, jung = null, jong = null;

      // --- 1. Initial consonant (초성) ---
      if (!isVowel(w[i])) {
        // Handle 'w' + vowel
        if (w[i] === 'w' && i + 1 < w.length && isVowel(w[i + 1])) {
          cho = 'ㅇ'; i++;
          const v = w[i];
          if (v === 'a') { jung = 'ㅘ'; i++; }
          else if (v === 'i') { jung = 'ㅟ'; i++; }
          else if (v === 'o') { jung = 'ㅝ'; i++; }
          else if (v === 'e') { jung = 'ㅞ'; i++; }
          else if (v === 'u') { jung = 'ㅜ'; i++; }
        }
        // Handle 'y' + vowel
        else if (w[i] === 'y' && i + 1 < w.length && isVowel(w[i + 1])) {
          cho = 'ㅇ'; i++;
          const v = w[i];
          if (v === 'a') { jung = 'ㅑ'; i++; }
          else if (v === 'e') { jung = 'ㅖ'; i++; }
          else if (v === 'i') { jung = 'ㅣ'; i++; }
          else if (v === 'o') { jung = 'ㅛ'; i++; }
          else if (v === 'u') { jung = 'ㅠ'; i++; }
        }
        // Normal consonant
        else {
          const r = readInitial(w, i);
          if (r) { cho = r[0]; i = r[1]; }
          else { i++; continue; }
        }

        // Consonant at end of word with no vowel → add 으
        if (!jung && (i >= w.length || !isVowel(w[i]))) {
          jung = 'ㅡ';
        }
      } else {
        // Starts with vowel → silent ㅇ
        cho = 'ㅇ';
      }

      // --- 2. Vowel (중성) ---
      if (!jung) {
        const vr = readVowel(w, i);
        if (vr) { jung = vr[0]; i = vr[1]; }
        else { jung = 'ㅡ'; } // fallback
      }

      // --- 3. Final consonant (종성) ---
      if (i < w.length && !isVowel(w[i])) {
        // Check if this consonant should be a final or start next syllable
        // Rule: if followed by a vowel → start next syllable (no jong)
        //        if followed by consonant or end of word → jong

        // Try final digraphs first
        let gotFinal = false;
        if (i + 1 < w.length) {
          const pair = w[i] + w[i + 1];
          for (const [d, j] of FINAL_DIGRAPHS) {
            if (pair === d) {
              // If followed by vowel → first char is jong, second starts next
              if (i + 2 < w.length && isVowel(w[i + 2])) {
                // Don't take digraph as final; let single consonant be final
                break;
              }
              jong = j; i += 2; gotFinal = true;
              break;
            }
          }
        }

        if (!gotFinal) {
          // Single consonant: check if next char after it is a vowel
          if (i + 1 < w.length && isVowel(w[i + 1])) {
            // This consonant starts the next syllable → no jong
          } else if (i + 1 >= w.length) {
            // End of word → final consonant
            jong = FINAL_CONSONANTS[w[i]] || null;
            if (jong) i++;
            // If no valid jong mapping, it will become next syllable with 으
          } else {
            // Followed by another consonant → take as jong
            jong = FINAL_CONSONANTS[w[i]] || null;
            if (jong) i++;
          }
        }
      }

      // --- 4. Compose syllable ---
      if (cho && jung) {
        const s = composeSyllable(cho, jung, jong);
        if (s) syllables.push(s);
      }
    }

    return syllables.join('');
  }

  /**
   * Convert an English name to Hangul transliteration
   * @param {string} name - English name
   * @returns {string} Korean transliteration
   */
  function convert(name) {
    if (!name || typeof name !== 'string') return '';

    const input = name.toLowerCase().replace(/[^a-z\s\-']/g, '').trim();
    if (!input) return '';

    // Split by spaces/hyphens and convert each part
    const parts = input.split(/[\s\-]+/);
    return parts.map(part => {
      // 1. Check lookup table first
      if (NAME_TABLE[part]) {
        return NAME_TABLE[part];
      }

      // 2. Fall back to algorithmic conversion
      return convertAlgorithmic(part);
    }).join(' ');
  }

  return { convert };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HangulConverter;
}
