(() => {
  'use strict';
  const icons = {
    spotify: '<circle cx="12" cy="12" r="12" fill="#1ed760"/><g fill="none" stroke="#07161c" stroke-width="1.5" stroke-linecap="round"><path d="M5 8c5-1.7 10-1 14 1"/><path d="M6 12c4-1.3 8.5-.6 12 1"/><path d="M7 15.7c3.4-1 6.5-.5 9.5.8"/></g>',
    amazonMusic: '<path d="M5 18c5.5 4 11 4 15 0M16.6 17.5l4-.3-.8 3.7" fill="none" stroke="#82dbe1" stroke-width="1.5" stroke-linecap="round"/><text x="6" y="16" fill="currentColor" font-family="Arial,sans-serif" font-size="20" font-weight="700">a</text>',
    tidal: '<g fill="currentColor"><path d="m6 3 4 4-4 4-4-4ZM14 3l4 4-4 4-4-4ZM22 3l4 4-4 4-4-4ZM14 11l4 4-4 4-4-4Z" transform="translate(-2 1) scale(.9)"/></g>',
    pandora: '<path d="M7 22V3h7a7 7 0 0 1 0 14h-3v5Zm4-10h3a2 2 0 1 0 0-4h-3Z" fill="#76b4ff"/>',
    boomplay: '<circle cx="12" cy="12" r="11" fill="none" stroke="#6fd6f4" stroke-width="1.5"/><path d="m9 6 9 6-9 6Z" fill="#6fd6f4"/>',
    appleMusic: '<path d="M10 17V5l11-2v12M10 8l11-2" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="6.5" cy="17.5" rx="4" ry="3" fill="currentColor"/><ellipse cx="17.5" cy="15.5" rx="4" ry="3" fill="currentColor"/>',
    youtubeMusic: '<circle cx="12" cy="12" r="11" fill="#ff4545"/><circle cx="12" cy="12" r="8" fill="none" stroke="white"/><path d="m10 7 7 5-7 5Z" fill="white"/>',
    youtube: '<rect x="1" y="4" width="22" height="16" rx="5" fill="#ff4545"/><path d="m10 8 7 4-7 4Z" fill="white"/>',
    deezer: '<g fill="currentColor"><path d="M2 14h3v8H2ZM7 8h3v14H7ZM12 2h3v20h-3ZM17 10h3v12h-3ZM22 5h2v17h-2Z"/></g>',
    soundcloud: '<path d="M10 18h9a4 4 0 1 0-1.1-7.8A6 6 0 0 0 10 6Z" fill="currentColor"/><path d="M2 13v4M5 10v8M8 8v10" stroke="currentColor" stroke-width="2"/>'
  };
  const list = document.getElementById('platform-list');
  const entries = Array.isArray(window.ONIRICO_LINKS) ? window.ONIRICO_LINKS : [];
  const nodes = [];
  for (const entry of entries) {
    if (!entry || !entry.name || !entry.url) continue;
    let url;
    try { url = new URL(entry.url); } catch { continue; }
    if (url.protocol !== 'https:') continue;
    const link = document.createElement('a');
    link.className = 'platform';
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Escuchar ONÍRICO en ${entry.name} (abre una nueva pestaña)`);
    const badge = document.createElement('span');
    badge.className = 'platform-icon';
    badge.setAttribute('aria-hidden', 'true');
    // Los SVG son constantes locales; no se interpreta HTML del archivo de enlaces.
    if (icons[entry.platform]) badge.innerHTML = `<svg viewBox="0 0 24 24">${icons[entry.platform]}</svg>`;
    else badge.textContent = entry.name.slice(0, 1);
    const name = document.createElement('span');
    name.className = 'platform-name';
    name.textContent = entry.name;
    const action = document.createElement('span');
    action.className = 'listen-action';
    action.innerHTML = 'Escuchar <span aria-hidden="true">↗</span>';
    link.append(badge, name, action);
    nodes.push(link);
  }
  if (nodes.length) list.replaceChildren(...nodes);

  const details = document.getElementById('preview');
  const mount = document.getElementById('player-mount');
  details.addEventListener('toggle', () => {
    if (details.open && !mount.firstChild) {
      const iframe = document.createElement('iframe');
      iframe.title = 'Escuchar una muestra de ONÍRICO en Spotify';
      iframe.src = 'https://open.spotify.com/embed/album/55pI6ttuJnTuhAYin2TopE?theme=0';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      mount.append(iframe);
    } else if (!details.open) {
      // Al cerrar el reproductor se detiene cualquier muestra en reproducción.
      mount.replaceChildren();
    }
  });

  const shareButton = document.getElementById('share');
  const status = document.getElementById('share-status');
  shareButton.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    try {
      await navigator.clipboard.writeText(url.href);
      status.textContent = 'Enlace copiado. Compartí ONÍRICO.';
      document.getElementById('share-fallback').hidden = true;
    } catch {
      const input = document.getElementById('share-url');
      input.value = url.href;
      document.getElementById('share-fallback').hidden = false;
      input.focus();
      input.select();
      status.textContent = 'Seleccioná y copiá el enlace.';
    }
  });
})();
