/**
 * instagram.js — Instagram feed loader
 *
 * Supports two modes:
 * 1. JSON mode (default): loads from data/lessons.json
 * 2. Instagram Graph API mode: fetches from Instagram API
 *
 * To switch to Instagram API:
 *   InstagramFeed.init({ mode: 'api', accessToken: 'YOUR_TOKEN', hashtagFilter: '히응이한글교실' });
 *
 * Instagram Graph API setup:
 * 1. Create a Meta App at developers.facebook.com
 * 2. Add Instagram Graph API product
 * 3. Generate a long-lived token (60-day, auto-refresh via server)
 * 4. Endpoint: GET https://graph.instagram.com/me/media
 *    ?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp
 *    &access_token={token}
 *    &limit=12
 */

const InstagramFeed = (() => {
  const DEFAULT_CONFIG = {
    mode: 'json',              // 'json' or 'api'
    jsonPath: 'data/lessons.json',
    accessToken: '',           // Instagram Graph API token
    userId: 'me',
    hashtagFilter: '',         // Filter posts by hashtag in caption
    limit: 6,
    containerId: 'feedGrid',
  };

  let config = { ...DEFAULT_CONFIG };

  /**
   * Fetch lessons from local JSON
   */
  async function fetchJSON() {
    const res = await fetch(config.jsonPath);
    if (!res.ok) throw new Error(`Failed to load ${config.jsonPath}`);
    const data = await res.json();
    return data.slice(0, config.limit).map(item => ({
      id: item.id,
      title: localizeField(item, 'title'),
      hangul: item.hangul,
      romanized: item.romanized,
      example: localizeField(item, 'example'),
      description: localizeField(item, 'description'),
      imageUrl: item.image,
      link: item.instagram_url,
      date: item.date,
      source: 'json',
    }));
  }

  /**
   * Fetch posts from Instagram Graph API
   */
  async function fetchInstagram() {
    if (!config.accessToken) throw new Error('Instagram access token is required');

    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/${config.userId}/media?fields=${fields}&access_token=${config.accessToken}&limit=${config.limit * 2}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
    const json = await res.json();

    let posts = json.data || [];

    // Filter by hashtag if specified
    if (config.hashtagFilter) {
      const tag = config.hashtagFilter.replace('#', '').toLowerCase();
      posts = posts.filter(p => p.caption && p.caption.toLowerCase().includes(`#${tag}`));
    }

    // Only images and carousels (no videos for now)
    posts = posts.filter(p => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM');

    return posts.slice(0, config.limit).map(post => ({
      id: post.id,
      title: extractTitle(post.caption),
      hangul: extractHangul(post.caption),
      romanized: '',
      example: '',
      description: extractDescription(post.caption),
      imageUrl: post.media_url,
      link: post.permalink,
      date: post.timestamp ? post.timestamp.split('T')[0] : '',
      source: 'instagram',
    }));
  }

  /**
   * Extract title from Instagram caption (first line)
   */
  function extractTitle(caption) {
    if (!caption) return t('feed.lesson.default');
    return caption.split('\n')[0].slice(0, 60);
  }

  /**
   * Try to extract a single Hangul character from caption
   */
  function extractHangul(caption) {
    if (!caption) return 'ㅎ';
    const match = caption.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/);
    return match ? match[0] : 'ㅎ';
  }

  /**
   * Extract description (second line or trimmed caption)
   */
  function extractDescription(caption) {
    if (!caption) return '';
    const lines = caption.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    return lines.length > 1 ? lines[1].slice(0, 100) : lines[0].slice(0, 100);
  }

  /**
   * Render feed items into the container
   */
  function render(items) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<p class="feed-empty">${t('feed.empty')}</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <a href="${item.link}" target="_blank" rel="noopener" class="feed-card">
        <div class="feed-card__img">
          ${item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.title}" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="feed-card__placeholder" style="display:none">
                <span class="feed-card__hangul">${item.hangul}</span>
                <span class="feed-card__romanized">${item.romanized}</span>
              </div>`
            : `<div class="feed-card__placeholder">
                <span class="feed-card__hangul">${item.hangul}</span>
                <span class="feed-card__romanized">${item.romanized}</span>
              </div>`
          }
        </div>
        <div class="feed-card__body">
          <h3 class="feed-card__title">${item.title}</h3>
          <p class="feed-card__desc">${item.description}</p>
          ${item.example ? `<span class="feed-card__example">${item.example}</span>` : ''}
        </div>
      </a>
    `).join('');
  }

  /**
   * Fetch and render daily phrases
   */
  async function loadPhrases() {
    try {
      const res = await fetch('data/phrases.json');
      if (!res.ok) throw new Error('Failed to load phrases');
      const phrases = await res.json();
      const container = document.getElementById('phraseList');
      if (!container) return;

      container.innerHTML = phrases.map(p => `
        <a href="${p.instagram_url}" target="_blank" rel="noopener" class="phrase-card phrase-card--webtoon">
          ${p.webtoon
            ? `<div class="phrase-card__webtoon">
                <img src="${p.webtoon}" alt="DAY ${p.day}" loading="lazy">
              </div>`
            : `<div class="phrase-card__scene">
                <div class="phrase-card__character">
                  <img src="${p.character}" alt="" loading="lazy">
                </div>
                <div class="phrase-card__bubble">
                  <span class="phrase-card__korean">${p.korean}</span>
                  <span class="phrase-card__romanized">${p.romanized}</span>
                </div>
              </div>`
          }
          <div class="phrase-card__info">
            <div class="phrase-card__day">DAY ${p.day}</div>
            <span class="phrase-card__english">${localizeField(p, 'english')}${localizeField(p, 'subtitle') ? ` — ${localizeField(p, 'subtitle')}` : ''}</span>
          </div>
          <p class="phrase-card__context">${localizeField(p, 'context')}</p>
          ${localizeField(p, 'tip') ? `<p class="phrase-card__tip">${localizeField(p, 'tip')}</p>` : ''}
        </a>
      `).join('');
    } catch (err) {
      console.warn('Phrases load failed:', err.message);
    }
  }

  /**
   * Setup tab switching
   */
  function setupTabs() {
    const tabs = document.querySelectorAll('.lesson-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.lesson-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(`panel-${tab.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /**
   * Initialize the feed
   */
  async function init(options = {}) {
    config = { ...DEFAULT_CONFIG, ...options };

    try {
      const items = config.mode === 'api' ? await fetchInstagram() : await fetchJSON();
      render(items);
    } catch (err) {
      console.warn('Feed load failed, trying JSON fallback:', err.message);
      if (config.mode === 'api') {
        try {
          config.mode = 'json';
          const items = await fetchJSON();
          render(items);
        } catch (e) {
          console.error('JSON fallback also failed:', e.message);
        }
      }
    }

    loadPhrases();
    setupTabs();
  }

  return { init };
})();
