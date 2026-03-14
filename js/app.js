/**
 * app.js — Main application logic
 * Particles, scroll animations, Hangul conversion UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== i18n Init =====
  I18n.init();

  // ===== Elements =====
  const nameInput = document.getElementById('nameInput');
  const convertBtn = document.getElementById('convertBtn');
  const resultArea = document.getElementById('resultArea');
  const artworkCanvas = document.getElementById('artworkCanvas');
  const artworkPreview = document.getElementById('artworkPreview');
  const resultHangul = document.getElementById('resultHangul');
  const resultEnglish = document.getElementById('resultEnglish');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareBtn = document.getElementById('shareBtn');
  const scrollCue = document.querySelector('.scroll-cue');

  // ===== Floating Gold Particles =====
  const pCanvas = document.getElementById('particleCanvas');
  if (pCanvas) {
    const ctx = pCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 35;

    function resizeParticleCanvas() {
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    class Particle {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x = Math.random() * pCanvas.width;
        this.y = initial ? Math.random() * pCanvas.height : pCanvas.height + 10;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = -(Math.random() * 0.3 + 0.08);
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.phase) * 0.08;
        this.phase += 0.01;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0 || this.y < -10) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,151,74,${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ===== Scroll-triggered animations =====
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));

  // Hero entrance — slight delay so user sees animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.querySelectorAll('[data-animate]').forEach(el => el.classList.add('visible'));
    }, 300);
  }

  // ===== Scroll cue click =====
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      document.getElementById('hangul-name').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== Hangul Name Conversion =====
  let currentDataUrl = null;
  let currentHangulName = '';
  let currentEnglishName = '';

  function handleConvert() {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      nameInput.style.borderColor = 'var(--crimson)';
      setTimeout(() => { nameInput.style.borderColor = ''; }, 800);
      return;
    }

    const hangulName = HangulConverter.convert(name);
    if (!hangulName) return;

    currentHangulName = hangulName;
    currentEnglishName = name;
    convertBtn.classList.add('loading');

    setTimeout(() => {
      const dataUrl = ArtworkGenerator.generate(artworkCanvas, hangulName, name);
      currentDataUrl = dataUrl;

      artworkPreview.innerHTML = `<img src="${dataUrl}" alt="${hangulName} artwork">`;
      resultHangul.textContent = hangulName;
      resultEnglish.textContent = name.toUpperCase();

      resultArea.classList.remove('hidden');
      convertBtn.classList.remove('loading');

      setTimeout(() => {
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }, 350);
  }

  convertBtn.addEventListener('click', handleConvert);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleConvert(); });

  // ===== Download =====
  downloadBtn.addEventListener('click', () => {
    if (!currentDataUrl) return;
    const a = document.createElement('a');
    a.download = `my-korean-name-${currentEnglishName.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.href = currentDataUrl;
    a.click();
  });

  // ===== Share =====
  shareBtn.addEventListener('click', async () => {
    if (!currentDataUrl) return;
    const text = t('share.text', { name: currentHangulName });

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(currentDataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'my-korean-name.png', { type: 'image/png' });
        const data = { title: t('share.title'), text, files: [file] };
        if (navigator.canShare(data)) { await navigator.share(data); return; }
      } catch (err) { if (err.name === 'AbortError') return; }
      try { await navigator.share({ title: t('share.title'), text, url: 'https://lanforal.com' }); return; }
      catch (err) { if (err.name === 'AbortError') return; }
    }

    try { await navigator.clipboard.writeText(text); toast(t('toast.copied')); }
    catch { toast(t('toast.save')); }
  });

  // ===== Instagram Feed =====
  InstagramFeed.init({ limit: 6 });

  // ===== Coupons =====
  CouponManager.init();

  // ===== Product Shop =====
  ProductShop.init();

  // ===== Language change — re-render dynamic content =====
  window.addEventListener('langchange', () => {
    InstagramFeed.init({ limit: 6 });
    CouponManager.init();
    ProductShop.init();
  });

  // ===== Newsletter =====
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const btn = newsletterForm.querySelector('.newsletter__btn');
      const note = document.getElementById('newsletterNote');
      const email = emailInput.value.trim();
      if (!email) return;

      btn.disabled = true;
      btn.textContent = '...';

      try {
        // Send to Google Sheets
        if (!GOOGLE_SHEET_URL.includes('YOUR_SCRIPT_ID_HERE')) {
          await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              lang: I18n.getLang(),
              timestamp: new Date().toISOString(),
              source: 'nfc-landing',
            }),
          });
        }

        // Also store locally as backup
        const subs = JSON.parse(localStorage.getItem('lanforal_subscribers') || '[]');
        if (!subs.includes(email)) {
          subs.push(email);
          localStorage.setItem('lanforal_subscribers', JSON.stringify(subs));
        }

        btn.textContent = t('newsletter.success.btn');
        btn.classList.add('success');
        note.textContent = t('newsletter.success.note');
        note.style.opacity = '1';
        note.style.color = 'var(--gold)';
        emailInput.disabled = true;
      } catch {
        btn.textContent = t('newsletter.btn');
        btn.disabled = false;
        note.textContent = 'Please try again.';
        note.style.opacity = '1';
        note.style.color = 'var(--crimson)';
      }
    });
  }

  function toast(msg) {
    const el = document.querySelector('.toast');
    if (el) el.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(201,151,74,0.95)', color: '#0c0608',
      padding: '11px 22px', borderRadius: '8px',
      fontFamily: 'var(--font-en)', fontSize: '.82rem', fontWeight: '500',
      zIndex: '10000', maxWidth: '88vw', textAlign: 'center',
      animation: 'revealUp .3s ease'
    });
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3000);
  }
});
