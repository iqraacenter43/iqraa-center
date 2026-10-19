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
  if (pl) { const L = (c.videos && c.videos.playlists) || []; if (!L.length) pl.parentElement.style.display = 'none'; else pl.innerHTML = L.map(p => '<a class="pl-card" href="' + p.url + '" target="_blank" rel="noopener noreferrer"><span class="pl-n">' + p.count + '</span><b>' + p.title + '</b><small>&#9654; YouTube</small></a>').join(''); }
  const vs = document.getElementById('videos');
  if (vs && !document.querySelector('#videos .video-card')) { const b = document.getElementById('youtube-button'); if (b) b.parentElement.style.marginTop = '0'; }

  // Pay buttons: PayPal.Me if set, otherwise WhatsApp message
  document.querySelectorAll('[data-pkg]').forEach(a => {
    const amount = a.dataset.amount, pkg = a.dataset.pkg;
    if (c.paypalMeUser) { a.href = 'https://www.paypal.com/paypalme/' + encodeURIComponent(c.paypalMeUser) + '/' + amount + 'USD'; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else { a.href = c.whatsapp + '?text=' + encodeURIComponent('Hello Iqraa Center! I finished my trial lesson and I want to pay for: ' + pkg + ' ($' + amount + '). My name: '); a.dataset.i18n = 'payWA'; a.textContent = 'Pay on WhatsApp'; }
  });

  // Auto-advance after a form is submitted (the form frame reloads on submit)
  const fr = document.querySelector('iframe.form-frame[data-next]');
  if (fr) {
    let n = 0, done = false; const need = (c.formLoads && c.formLoads[fr.dataset.form]) || 2;
    fr.addEventListener('load', () => { n++; if (n >= need && !done) { done = true; countdown(fr.dataset.next); } });
  }
  function countdown(url) {
    const b = document.getElementById('auto-banner'); if (!b) return;
    let t = 6; const num = document.getElementById('count'); num.textContent = t; b.hidden = false;
    document.getElementById('go-now').href = url;
    const id = setInterval(() => { t--; num.textContent = t; if (t <= 0) { clearInterval(id); location.href = url; } }, 1000);
    document.getElementById('stay').onclick = () => { clearInterval(id); b.hidden = true; };
  }
})();
