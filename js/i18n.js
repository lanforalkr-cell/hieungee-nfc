/**
 * i18n.js — Lightweight internationalization for Hee-eung-ee NFC landing
 *
 * Supports: en, ko, ja, zh
 * Usage:
 *   t('hero.title')                    → translated string
 *   t('share.text', { name: '한글' })  → template replacement
 *   I18n.localizeField(obj, 'title')   → picks obj.titleJa etc. based on lang
 */
const I18n = (() => {
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'lanforal_lang';
  const SUPPORTED = ['en', 'ko', 'ja', 'zh'];

  const translations = {
    // ── English (default) ──────────────────────────────
    en: {
      // Hero
      'hero.greeting': '안녕하세요!',
      'hero.title': 'Hello, I\'m <span class="text-gold">Hee-eung-ee</span>',
      'hero.subtitle': 'I\'m a traveler from the Star of Hearts ✦<br>I collect emotions and share the beauty of Korea with everyone.',
      'hero.scroll': 'Discover your Korean name',

      // Hangul Name
      'name.title': 'Your Name in <span class="text-gold text-kr">한글</span>',
      'name.desc': 'Type your name and receive a beautiful Korean calligraphy artwork',
      'name.placeholder': 'Enter your name',
      'name.convert': 'Create Artwork',
      'name.save': 'Save Image',
      'name.share': 'Share',

      // Feed
      'feed.title': 'Learn Hangul with <span class="text-gold">Hee-eung-ee</span>',
      'feed.sub': '히응이의 한글 교실',
      'feed.tab.consonants': 'Consonants',
      'feed.tab.phrases': 'Daily Phrases',
      'feed.follow': 'Follow for more lessons',
      'feed.empty': 'Lessons coming soon!',
      'feed.lesson.default': 'Hangul Lesson',

      // Newsletter
      'newsletter.title': 'Want to learn more Korean?',
      'newsletter.desc': 'Get weekly Hangul lessons & exclusive deals from Hee-eung-ee directly to your inbox!',
      'newsletter.placeholder': 'your@email.com',
      'newsletter.btn': 'Subscribe',
      'newsletter.note': 'No spam. Unsubscribe anytime.',
      'newsletter.success.btn': 'Subscribed!',
      'newsletter.success.note': 'Welcome! You\'ll receive your first lesson soon.',

      // Coupons
      'coupons.title': 'Special <span class="text-gold">Offers</span>',
      'coupons.desc': 'Exclusive deals for NFC visitors',
      'coupons.shop': 'Visit Lanforal Shop',
      'coupons.empty': 'No coupons available right now.',
      'coupons.copied': 'Copied!',

      // Products
      'products.title': 'Shop <span class="text-gold">Lanforal</span>',
      'products.desc': 'Korean culture, beautifully designed',
      'products.empty': 'Products coming soon!',
      'products.shopnow': 'Shop Now',

      // Footer
      'footer.slogan': 'Connecting All Languages of Korea and Hearts',
      'footer.copy': '© 2025 Lanforal. All rights reserved.',

      // Dynamic
      'share.text': 'My Korean name is {name}! ✦\n#Lanforal #Hangeul #히응이 #MyKoreanName\n\nGet yours at lanforal.com',
      'share.title': 'My Korean Name — Lanforal',
      'toast.copied': 'Copied! Save the image and share together.',
      'toast.save': 'Save the image and share on Instagram!',
      'artwork.label': 'My Korean Name',
      'artwork.hashtags': '#Lanforal  #Hangeul  #히응이  #MyKoreanName',
    },

    // ── Korean ─────────────────────────────────────────
    ko: {
      'hero.greeting': '안녕하세요!',
      'hero.title': '안녕, 나는 <span class="text-gold">히응이</span>야!',
      'hero.subtitle': '마음의 별에서 온 여행자 ✦<br>감정을 모으고 한국의 아름다움을 모두와 나눠요.',
      'hero.scroll': '나의 한글 이름 만들기',

      'name.title': '나의 이름을 <span class="text-gold text-kr">한글</span>로',
      'name.desc': '이름을 입력하면 아름다운 한글 캘리그래피 작품을 만들어드려요',
      'name.placeholder': '이름을 입력하세요',
      'name.convert': '작품 만들기',
      'name.save': '이미지 저장',
      'name.share': '공유',

      'feed.title': '<span class="text-gold">히응이</span>와 함께 한글 배우기',
      'feed.sub': '히응이의 한글 교실',
      'feed.tab.consonants': '자음',
      'feed.tab.phrases': '일상 표현',
      'feed.follow': '더 많은 수업 보기',
      'feed.empty': '수업이 곧 업데이트됩니다!',
      'feed.lesson.default': '한글 수업',

      'newsletter.title': '한국어를 더 배우고 싶으세요?',
      'newsletter.desc': '히응이의 주간 한글 수업과 특별 혜택을 이메일로 받아보세요!',
      'newsletter.placeholder': 'your@email.com',
      'newsletter.btn': '구독하기',
      'newsletter.note': '스팸 없음. 언제든 구독 취소 가능.',
      'newsletter.success.btn': '구독 완료!',
      'newsletter.success.note': '환영합니다! 첫 번째 수업을 곧 보내드릴게요.',

      'coupons.title': '특별 <span class="text-gold">혜택</span>',
      'coupons.desc': 'NFC 방문자 전용 혜택',
      'coupons.shop': '랜포랄 샵 방문하기',
      'coupons.empty': '현재 이용 가능한 쿠폰이 없습니다.',
      'coupons.copied': '복사 완료!',

      'products.title': '<span class="text-gold">랜포랄</span> 쇼핑',
      'products.desc': '아름답게 디자인된 한국 문화',
      'products.empty': '상품이 곧 업데이트됩니다!',
      'products.shopnow': '구매하기',

      'footer.slogan': '한국의 모든 언어와 마음을 잇다',
      'footer.copy': '© 2025 Lanforal. All rights reserved.',

      'share.text': '내 한글 이름은 {name}! ✦\n#랜포랄 #한글 #히응이\n\nlanforal.com에서 만들어보세요',
      'share.title': '나의 한글 이름 — 랜포랄',
      'toast.copied': '복사 완료! 이미지를 저장하고 함께 공유하세요.',
      'toast.save': '이미지를 저장해서 인스타그램에 공유하세요!',
      'artwork.label': '나의 한글 이름',
      'artwork.hashtags': '#랜포랄  #한글  #히응이  #MyKoreanName',
    },

    // ── Japanese ───────────────────────────────────────
    ja: {
      'hero.greeting': 'アンニョンハセヨ!',
      'hero.title': 'こんにちは、<span class="text-gold">ヒウンイ</span>です',
      'hero.subtitle': '心の星から来た旅人 ✦<br>感情を集めて、韓国の美しさをみんなと分かち合います。',
      'hero.scroll': '韓国語の名前を見つけよう',

      'name.title': 'あなたの名前を<span class="text-gold text-kr">ハングル</span>で',
      'name.desc': '名前を入力すると、美しい韓国語カリグラフィー作品を作成します',
      'name.placeholder': '名前を入力',
      'name.convert': '作品を作る',
      'name.save': '画像を保存',
      'name.share': 'シェア',

      'feed.title': '<span class="text-gold">ヒウンイ</span>とハングルを学ぼう',
      'feed.sub': 'ヒウンイの韓国語教室',
      'feed.tab.consonants': '子音',
      'feed.tab.phrases': '日常フレーズ',
      'feed.follow': 'もっとレッスンを見る',
      'feed.empty': 'レッスンは近日公開!',
      'feed.lesson.default': 'ハングルレッスン',

      'newsletter.title': '韓国語をもっと学びたいですか?',
      'newsletter.desc': 'ヒウンイの週刊ハングルレッスンと特別セールをメールでお届け!',
      'newsletter.placeholder': 'your@email.com',
      'newsletter.btn': '登録する',
      'newsletter.note': 'スパムなし。いつでも解除可能。',
      'newsletter.success.btn': '登録完了!',
      'newsletter.success.note': 'ようこそ! 最初のレッスンをお届けします。',

      'coupons.title': '特別<span class="text-gold">オファー</span>',
      'coupons.desc': 'NFC訪問者限定の特典',
      'coupons.shop': 'Lanforalショップへ',
      'coupons.empty': '現在利用可能なクーポンはありません。',
      'coupons.copied': 'コピー完了!',

      'products.title': '<span class="text-gold">Lanforal</span>ショップ',
      'products.desc': '美しくデザインされた韓国文化',
      'products.empty': '商品は近日公開!',
      'products.shopnow': '購入する',

      'footer.slogan': '韓国のすべての言語と心をつなぐ',
      'footer.copy': '© 2025 Lanforal. All rights reserved.',

      'share.text': '私の韓国語の名前は{name}! ✦\n#Lanforal #ハングル #ヒウンイ\n\nlanforal.comで作ろう',
      'share.title': '私の韓国語名 — Lanforal',
      'toast.copied': 'コピー完了! 画像を保存してシェアしよう。',
      'toast.save': '画像を保存してインスタグラムでシェア!',
      'artwork.label': '私の韓国語名',
      'artwork.hashtags': '#Lanforal  #ハングル  #ヒウンイ  #MyKoreanName',
    },

    // ── Chinese ────────────────────────────────────────
    zh: {
      'hero.greeting': '安宁哈塞哟!',
      'hero.title': '你好，我是<span class="text-gold">ㅎ应</span>',
      'hero.subtitle': '我是来自心之星的旅行者 ✦<br>收集情感，与大家分享韩国之美。',
      'hero.scroll': '发现你的韩文名字',

      'name.title': '用<span class="text-gold text-kr">韩文</span>写你的名字',
      'name.desc': '输入你的名字，获得一幅美丽的韩文书法作品',
      'name.placeholder': '输入你的名字',
      'name.convert': '创建作品',
      'name.save': '保存图片',
      'name.share': '分享',

      'feed.title': '和<span class="text-gold">ㅎ应</span>一起学韩文',
      'feed.sub': 'ㅎ应的韩文教室',
      'feed.tab.consonants': '辅音',
      'feed.tab.phrases': '日常用语',
      'feed.follow': '查看更多课程',
      'feed.empty': '课程即将上线!',
      'feed.lesson.default': '韩文课程',

      'newsletter.title': '想学更多韩语吗?',
      'newsletter.desc': '获取ㅎ应的每周韩文课程和专属优惠!',
      'newsletter.placeholder': 'your@email.com',
      'newsletter.btn': '订阅',
      'newsletter.note': '无垃圾邮件，随时取消。',
      'newsletter.success.btn': '订阅成功!',
      'newsletter.success.note': '欢迎! 第一堂课即将发送。',

      'coupons.title': '特别<span class="text-gold">优惠</span>',
      'coupons.desc': 'NFC访客专属优惠',
      'coupons.shop': '访问Lanforal商店',
      'coupons.empty': '暂无可用优惠券。',
      'coupons.copied': '已复制!',

      'products.title': '<span class="text-gold">Lanforal</span>商店',
      'products.desc': '精心设计的韩国文化',
      'products.empty': '商品即将上线!',
      'products.shopnow': '立即购买',

      'footer.slogan': '连接韩国的所有语言与心灵',
      'footer.copy': '© 2025 Lanforal. All rights reserved.',

      'share.text': '我的韩文名字是{name}! ✦\n#Lanforal #韩文 #ㅎ应\n\n在lanforal.com创建你的',
      'share.title': '我的韩文名字 — Lanforal',
      'toast.copied': '已复制! 保存图片一起分享吧。',
      'toast.save': '保存图片到Instagram分享!',
      'artwork.label': '我的韩文名字',
      'artwork.hashtags': '#Lanforal  #韩文  #ㅎ应  #MyKoreanName',
    },
  };

  let currentLang = DEFAULT_LANG;

  function getLang() { return currentLang; }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyToDOM();
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function t(key, replacements = {}) {
    let str = translations[currentLang]?.[key]
           || translations[DEFAULT_LANG]?.[key]
           || key;
    for (const [k, v] of Object.entries(replacements)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return str;
  }

  function localizeField(obj, field) {
    const suffixMap = { ko: 'Ko', ja: 'Ja', zh: 'Zh' };
    const suffix = suffixMap[currentLang];
    if (suffix) {
      const val = obj[field + suffix] || obj[field + '_' + currentLang];
      if (val) return val;
    }
    return obj[field];
  }

  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) {
      currentLang = saved;
    }
    document.documentElement.lang = currentLang;

    // Wire up language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });

    applyToDOM();
  }

  // Expose t() globally
  window.t = t;
  window.localizeField = localizeField;

  return { init, setLang, getLang, t, localizeField, SUPPORTED };
})();
