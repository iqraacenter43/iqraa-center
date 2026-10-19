(function () {
  const c = window.IQRAA_CONFIG || {};
  const get = (obj, path) => path.split('.').reduce((v, k) => v && v[k], obj);
  document.querySelectorAll('[data-config-link]').forEach(el => { const v = get(c, el.dataset.configLink); if (v) el.href = v; });
  document.querySelectorAll('[data-email]').forEach(el => { el.href = 'mailto:' + c.email; el.textContent = c.email; });
  const s = c.socials || {};
  const host = document.getElementById('social-links');
  if (host) host.innerHTML = [['YouTube', s.youtube], ['Facebook', s.facebook], ['TikTok', s.tiktok], ['Instagram', s.instagram], ['Telegram', s.telegram]]
    .filter(x => x[1]).map(x => '<a href="' + x[1] + '" target="_blank" rel="noopener noreferrer">' + x[0] + '</a>').join(' · ');
  const yt = document.getElementById('youtube-button'); if (yt && s.youtube) yt.href = s.youtube;

  function videoId(u) { const m = String(u).match(/(?:v=|shorts\/|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(u) ? u : ''); }
  function render(id, list, isShort) {
    const box = document.getElementById(id); if (!box) return;
    const items = (list || []).map(v => typeof v === 'string' ? {url: v} : v).map(v => ({id: videoId(v.url || v.id), title: v.title})).filter(v => v.id);
    if (!items.length) { box.parentElement.style.display = 'none'; return; }
    box.innerHTML = items.map(v => '<article class="video-card' + (isShort ? ' short' : '') + '"><a href="https://www.youtube.com/' + (isShort ? 'shorts/' : 'watch?v=') + v.id + '" target="_blank" rel="noopener noreferrer" aria-label="' + (v.title || 'YouTube') + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><span class="play">&#9654;</span></a>' + (v.title ? '<h3>' + v.title + '</h3>' : '') + '</article>').join('');
  }
  render('shorts', c.videos && c.videos.shorts, true);
  render('long-videos', c.videos && c.videos.long, false);
  const pl = document.getElementById('playlists');
  if (pl) {
    const L = (c.videos && c.videos.playlists) || [];
    if (!L.length) pl.parentElement.style.display = 'none';
    else pl.innerHTML = L.map(p => { const m = String(p.url).match(/list=([A-Za-z0-9_-]+)/); if (!m) return '';
      return '<article class="video-card"><div class="pl-frame"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/videoseries?list=' + m[1] + '" title="' + p.title + '" allow="encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><h3>' + p.title + '</h3><p class="pl-meta">&#9654; ' + p.count + ' &middot; <a href="' + p.url + '" target="_blank" rel="noopener noreferrer" data-i18n="openPlaylist">Open on YouTube</a></p></article>'; }).join('');
  }
  function countdown(url) {
    const b = document.getElementById('auto-banner'); if (!b) return;
    let t = 6; const num = document.getElementById('count'); num.textContent = t; b.hidden = false;
    document.getElementById('go-now').href = url;
    const id = setInterval(() => { t--; num.textContent = t; if (t <= 0) { clearInterval(id); location.href = url; } }, 1000);
    document.getElementById('stay').onclick = () => { clearInterval(id); b.hidden = true; };
  }
})();
